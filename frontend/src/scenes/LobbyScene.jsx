import { useEffect } from "react";
import { useGame, SCENES } from "../state/GameStateContext.jsx";
import { gameClient } from "../game/GameClient.js";
import NetworkPill from "../ui/components/NetworkPill.jsx";
import Button from "../ui/components/Button.jsx";

export default function LobbyScene() {
  const { setScene, net } = useGame();
  const connected = net.status === "connected";

  // Dispara a conexão ao entrar no lobby. O gameClient é idempotente.
  useEffect(() => {
    gameClient.connect();
  }, []);

  return (
    <>
      <div className="logo">🎭</div>
      <h1 style={{ fontSize: 24 }}>Lobby</h1>

      <div className="bar">
        <NetworkPill status={net.status} />
        <div className="pill">
          Sobreviventes online: <b>{net.stats.players}</b>
        </div>
      </div>

      <p className="hint">
        {connected
          ? "Conectado à arena. Entre quando estiver pronto — abra outra aba pra ter um segundo jogador coop."
          : "Estabelecendo conexão com o servidor autoritativo (ws://localhost:3000)…"}
      </p>

      <div className="bar">
        <Button disabled={!connected} onClick={() => setScene(SCENES.GAME)}>
          Entrar na arena
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            gameClient.disconnect();
            setScene(SCENES.MENU);
          }}
        >
          Voltar
        </Button>
      </div>
    </>
  );
}
