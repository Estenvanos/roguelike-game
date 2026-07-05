import { useGame, SCENES } from "../state/GameStateContext.jsx";
import GameCanvas from "../game/GameCanvas.jsx";
import Button from "../ui/components/Button.jsx";

export default function GameScene() {
  const { setScene } = useGame();

  return (
    <div className="game-scene">
      <GameCanvas />
    </div>
  );
}
