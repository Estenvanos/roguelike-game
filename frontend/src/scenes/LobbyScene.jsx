import { useEffect } from "react";
import { useGame, SCENES } from "../state/GameStateContext.jsx";
import { gameClient } from "../game/GameClient.js";

export default function LobbyScene() {
  const { setScene, net, username } = useGame();
  const connected = net.status === "connected";

  // Dispara a conexão ao entrar no lobby. O gameClient é idempotente.
  useEffect(() => {
    gameClient.connect();
  }, []);

  return (
    <div className="pixel-screen lobby-screen">
      <div className="pixel-content lobby-content">
        <header>
          <h1 className="pixel-title lobby-title">Bastidores</h1>
          <p className="pixel-tagline">
            {username ? `Boa noite, ${username}. ` : ""}O show ainda não
            começou.
          </p>
        </header>

        <div className="lobby-panel">
          <p className="lobby-status">
            <span
              className={"lobby-dot" + (connected ? " on" : "")}
              aria-hidden="true"
            />
            {connected ? "Conectado à arena" : "Ligando os holofotes…"}
          </p>
          <p className="lobby-count">
            Sobreviventes na fila: <b>{net.stats.players}</b>
          </p>
          <p className="lobby-hint">
            {connected
              ? "O Empresário te espera no picadeiro. Abra outra aba pra chamar um segundo sobrevivente (coop)."
              : "Estabelecendo conexão com o servidor autoritativo (ws://localhost:3000)…"}
          </p>
        </div>

        <div className="lobby-actions">
          <button
            type="button"
            className="pixel-btn"
            disabled={!connected}
            onClick={() => setScene(SCENES.GAME)}
          >
            Entrar na arena
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
      </div>
    </div>
  );
}
