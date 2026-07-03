import { useState } from "react";
import { useGame, SCENES } from "../state/GameStateContext.jsx";
import { gameClient } from "../game/GameClient.js";
import GameCanvas from "../game/GameCanvas.jsx";
import NetworkPill from "../ui/components/NetworkPill.jsx";
import Button from "../ui/components/Button.jsx";

export default function GameScene() {
  const { setScene, net } = useGame();
  const s = net.stats;

  // Controles didáticos: escrevem direto em gameClient.settings (o loop lê de lá).
  const [lag, setLag] = useState(gameClient.settings.simLag);
  const [prediction, setPrediction] = useState(gameClient.settings.prediction);
  const [interpolation, setInterp] = useState(gameClient.settings.interpolation);

  return (
    <>
      <div className="bar">
        <NetworkPill status={net.status} />
        <div className="pill">Players: <b>{s.players}</b></div>
        <div className="pill">Tick srv: <b>{s.tick}</b></div>
        <div className="pill">Buffer: <b>{s.buffer}</b></div>
        <div className="pill">Último ack: <b>{s.ack}</b></div>
      </div>

      <div className="bar">
        <div className="pill ctrl">
          <label>
            Lag simulado: <b style={{ color: "var(--accent-2)" }}>{lag}</b> ms/lado
          </label>
          <input
            type="range"
            min="0"
            max="400"
            step="10"
            value={lag}
            onChange={(e) => {
              const v = +e.target.value;
              setLag(v);
              gameClient.settings.simLag = v;
            }}
          />
        </div>
        <div className="pill ctrl">
          <label>
            <input
              type="checkbox"
              checked={prediction}
              onChange={(e) => {
                setPrediction(e.target.checked);
                gameClient.settings.prediction = e.target.checked;
              }}
            />
            Prediction
          </label>
        </div>
        <div className="pill ctrl">
          <label>
            <input
              type="checkbox"
              checked={interpolation}
              onChange={(e) => {
                setInterp(e.target.checked);
                gameClient.settings.interpolation = e.target.checked;
              }}
            />
            Interpolação (outros)
          </label>
        </div>
      </div>

      <GameCanvas />

      <p className="hint">
        Mova com <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>. Aumente o lag e
        desligue a <b>prediction</b>: o boneco vira gelo. Religue: responde na hora,
        e o fantasma translúcido mostra onde o servidor te vê. Abra outra aba pra um
        segundo jogador e teste a <b>interpolação</b>.
      </p>

      <Button
        variant="ghost"
        onClick={() => setScene(SCENES.GAMEOVER)}
      >
        Encerrar run
      </Button>
    </>
  );
}
