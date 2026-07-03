// Roteador de cenas: renderiza a tela ativa segundo o GameStateContext.
import { useGame, SCENES } from "./state/GameStateContext.jsx";
import MenuScene from "./scenes/MenuScene.jsx";
import LobbyScene from "./scenes/LobbyScene.jsx";
import GameScene from "./scenes/GameScene.jsx";
import GameOverScene from "./scenes/GameOverScene.jsx";

export default function App() {
  const { scene } = useGame();

  switch (scene) {
    case SCENES.LOBBY:
      return <LobbyScene />;
    case SCENES.GAME:
      return <GameScene />;
    case SCENES.GAMEOVER:
      return <GameOverScene />;
    case SCENES.MENU:
    default:
      return <MenuScene />;
  }
}
