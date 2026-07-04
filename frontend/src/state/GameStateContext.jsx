// Estado global leve: qual cena está ativa + status de rede (espelhado do
// gameClient). Sem lib de rota — o jogo é single-page com máquina de estados
// de cena (menu -> lobby -> game -> gameover).
import { createContext, useContext, useEffect, useState } from "react";
import { gameClient } from "../game/GameClient.js";

export const SCENES = {
  MENU: "menu",
  LOBBY: "lobby",
  GAME: "game",
  GAMEOVER: "gameover",
};

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const [scene, setScene] = useState(SCENES.MENU);
  const [username, setUsername] = useState("");
  const [net, setNet] = useState(gameClient.getPublicState());

  // Inscreve no gameClient: status/stats fluem pra UI sem re-render do canvas.
  useEffect(() => gameClient.subscribe(setNet), []);

  return (
    <GameStateContext.Provider
      value={{ scene, setScene, username, setUsername, net }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGame precisa estar dentro de <GameStateProvider>");
  return ctx;
}
