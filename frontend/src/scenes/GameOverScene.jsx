import { useGame, SCENES } from "../state/GameStateContext.jsx";
import { gameClient } from "../game/GameClient.js";
import Button from "../ui/components/Button.jsx";

// Placeholder de fim de run. Sem trigger real de morte ainda (combate é
// roadmap) — a cena existe pra fechar o fluxo menu -> jogo -> fim.
export default function GameOverScene() {
  const { setScene } = useGame();

  return (
    <>
      <div className="logo">🌙</div>
      <h1 style={{ fontSize: 28 }}>A sessão foi encerrada</h1>
      <p className="hint">
        O carnaval baixou as cortinas. (Fim de run é placeholder — o combate
        autoritativo que decide a morte ainda está no roadmap.)
      </p>
      <Button
        onClick={() => {
          gameClient.disconnect();
          setScene(SCENES.MENU);
        }}
      >
        Voltar ao menu
      </Button>
    </>
  );
}
