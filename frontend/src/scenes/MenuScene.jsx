import { useGame, SCENES } from "../state/GameStateContext.jsx";
import Button from "../ui/components/Button.jsx";

export default function MenuScene() {
  const { setScene } = useGame();

  return (
    <>
      <div className="logo">🎪</div>
      <h1 style={{ fontSize: 32, textAlign: "center" }}>Carnaval das Sombras</h1>
      <p className="hint">
        Roguelike cooperativo de sobrevivência a hordas. Resista aos atos do
        carnaval até o amanhecer — ou derrote <b>O Empresário</b> antes disso.
      </p>
      <Button onClick={() => setScene(SCENES.LOBBY)}>Entrar</Button>
    </>
  );
}
