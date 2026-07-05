import { useEffect, useState } from "react";
import { useGame, SCENES } from "../state/GameStateContext.jsx";
import { gameClient } from "../game/GameClient.js";
import { listRooms, createRoom } from "../game/net/api.js";

export default function LobbyScene() {
  const { setScene, net, username } = useGame();
  const [mode, setMode] = useState("choose"); // choose | create | join

  const [roomName, setRoomName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState(null); // null = ainda não buscou
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  // Painel de status aparece assim que uma conexão foi iniciada, independente do mode.
  const inRoom = net.status !== "disconnected";

  async function fetchRooms() {
    setListLoading(true);
    setListError("");
    try {
      setRooms(await listRooms());
    } catch (err) {
      setListError(err.message);
      setRooms([]);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    if (mode === "join" && rooms === null) fetchRooms();
  }, [mode]);

  async function handleCreate(e) {
    e.preventDefault();
    if (createLoading) return;
    const trimmed = roomName.trim();
    if (!trimmed) {
      setCreateError("Nome da sala não pode ser vazio.");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const room = await createRoom(trimmed);
      gameClient.connect({ roomId: room.id, hostToken: room.hostToken, username, roomName: room.name });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  }

  function handleJoinRoom(room) {
    gameClient.connect({ roomId: room.id, username, roomName: room.name });
  }

  function handleChangeRoom() {
    gameClient.disconnect();
    setMode("choose");
    setRoomName("");
    setCreateError("");
    setQuery("");
    setRooms(null);
    setListError("");
  }

  const filteredRooms = rooms
    ? rooms.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <div className="pixel-screen lobby-screen">
      <div className="pixel-content lobby-content">
        <header>
          <h1 className="pixel-title">Bastidores</h1>
          <p className="pixel-tagline">
            {username ? `Boa noite, ${username}. ` : ""}O show ainda não começou.
          </p>
        </header>

        {inRoom ? (
          <>
            <div className="lobby-panel">
              <p className="lobby-status">
                <span
                  className={"lobby-dot" + (net.status === "connected" ? " on" : "")}
                  aria-hidden="true"
                />
                {net.status === "connected" ? "Conectado à arena" : "Ligando os holofotes…"}
              </p>
              {net.roomName && (
                <p className="lobby-count">
                  Sala: <b>{net.roomName}</b>
                </p>
              )}
              {net.isHost && <p className="lobby-host-tag">Você é o host</p>}
              <p className="lobby-count">
                Sobreviventes na fila: <b>{net.stats.players}</b>
              </p>
              <p className="lobby-hint">
                {net.status === "connected"
                  ? "O Empresário te espera no picadeiro. Abra outra aba pra chamar um segundo sobrevivente (coop)."
                  : "Estabelecendo conexão com o servidor autoritativo…"}
              </p>
              {net.error && (
                <p className="pixel-error" role="alert">
                  ! {net.error}
                </p>
              )}
            </div>

            <div className="lobby-actions">
              <button
                type="button"
                className="pixel-btn"
                disabled={net.status !== "connected"}
                onClick={() => setScene(SCENES.GAME)}
              >
                Entrar na arena
              </button>
              <button type="button" className="pixel-btn ghost" onClick={handleChangeRoom}>
                Trocar de sala
              </button>
              <button
                type="button"
                className="pixel-btn ghost"
                onClick={() => {
                  gameClient.disconnect();
                  setScene(SCENES.MENU);
                }}
              >
                Voltar aos portões
              </button>
            </div>
          </>
        ) : mode === "choose" ? (
          <div className="lobby-actions">
            <button type="button" className="pixel-btn" onClick={() => setMode("create")}>
              Fundar sala
            </button>
            <button type="button" className="pixel-btn" onClick={() => setMode("join")}>
              Entrar em sala
            </button>
            <button type="button" className="pixel-btn ghost" onClick={() => setScene(SCENES.MENU)}>
              Voltar aos portões
            </button>
          </div>
        ) : mode === "create" ? (
          <form onSubmit={handleCreate} noValidate className="lobby-form">
            <div className="pixel-field">
              <label className="pixel-label" htmlFor="room-name">
                Nome da sala
              </label>
              <input
                id="room-name"
                className={"pixel-input" + (createError ? " is-error" : "")}
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="a tenda dos horrores"
                value={roomName}
                disabled={createLoading}
                aria-invalid={Boolean(createError)}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  if (createError) setCreateError("");
                }}
              />
              <p className="pixel-error" role="alert">
                {createError ? "! " + createError : ""}
              </p>
            </div>
            <div className="lobby-actions">
              <button type="submit" className="pixel-btn" disabled={createLoading}>
                {createLoading ? "Erguendo a lona" : "Fundar sala"}
                {createLoading && <span className="pixel-dots" aria-hidden="true" />}
              </button>
              <button type="button" className="pixel-btn ghost" onClick={() => setMode("choose")}>
                Voltar
              </button>
            </div>
          </form>
        ) : (
          <div className="lobby-join">
            <div className="pixel-field">
              <label className="pixel-label" htmlFor="room-query">
                Buscar sala pelo nome
              </label>
              <input
                id="room-query"
                className="pixel-input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="digite pra filtrar…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <p className="pixel-error" role="alert">
                {listError ? "! " + listError : ""}
              </p>
            </div>

            <ul className="lobby-room-list">
              {listLoading && <li className="lobby-room-empty">Procurando salas…</li>}
              {!listLoading && rooms !== null && filteredRooms.length === 0 && (
                <li className="lobby-room-empty">Nenhuma sala encontrada.</li>
              )}
              {!listLoading &&
                filteredRooms.map((room) => (
                  <li key={room.id}>
                    <button type="button" className="lobby-room-card" onClick={() => handleJoinRoom(room)}>
                      <span className="lobby-room-name">{room.name}</span>
                      <span className="lobby-room-count">{room.playerCount} online</span>
                    </button>
                  </li>
                ))}
            </ul>

            <div className="lobby-actions">
              <button type="button" className="pixel-btn ghost" onClick={fetchRooms} disabled={listLoading}>
                Atualizar lista
              </button>
              <button type="button" className="pixel-btn ghost" onClick={() => setMode("choose")}>
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
