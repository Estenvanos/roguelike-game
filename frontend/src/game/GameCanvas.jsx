// =====================================================================
// GameCanvas — a ponte React <-> canvas. Monta o <canvas>, carrega os
// assets, liga o teclado ao gameClient e roda o render loop. Toda a lógica
// de jogo/rede vive no gameClient; aqui só desenhamos o estado dele.
// =====================================================================
import { useEffect, useRef } from "react";
import { gameClient } from "./GameClient.js";
import { assets } from "./render/AssetLoader.js";
import { drawEntity } from "./render/SpriteRenderer.js";
import { drawWorld, drawLabel } from "./render/world.js";
import { sampleInterpolated } from "./net/interpolation.js";
import { createRenderLoop } from "./engine/loop.js";
import { INTERP_DELAY } from "./engine/constants.js";
import { enemiesByAct, ENTITIES } from "./entities/registry.js";

// Teclas aceitas -> chave interna do input.
const KEY_MAP = {
  w: "w", a: "a", s: "s", d: "d",
  arrowup: "w", arrowleft: "a", arrowdown: "s", arrowright: "d",
};

export default function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = gameClient.world.w;
    canvas.height = gameClient.world.h;

    // ---- input: teclado liga direto no gameClient ----
    const onKeyDown = (e) => {
      const k = KEY_MAP[e.key.toLowerCase()];
      if (!k) return;
      e.preventDefault();
      gameClient.setKey(k, true);
    };
    const onKeyUp = (e) => {
      const k = KEY_MAP[e.key.toLowerCase()];
      if (!k) return;
      gameClient.setKey(k, false);
    };
    const onBlur = () => gameClient.clearKeys();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    // ---- render loop ----
    const loop = createRenderLoop(() => draw(ctx, canvas));
    assets.load().then(() => loop.start());

    return () => {
      loop.stop();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      gameClient.clearKeys();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

// =====================================================================
// draw — desenha o último estado. Meu player = posição PREVISTA (+ fantasma
// translúcido do servidor). Outros = interpolados (ou crus). No rodapé, uma
// vitrine dos inimigos/itens do manifest (valida AssetLoader + placeholders).
// =====================================================================
function draw(ctx, canvas) {
  const gc = gameClient;
  drawWorld(ctx, canvas.width, canvas.height);
  drawShowcase(ctx, canvas);

  for (const id in gc.serverPlayers) {
    const sp = gc.serverPlayers[id];
    if (id === gc.myId) {
      // fantasma: onde o servidor me vê (atrasado pelo lag).
      drawEntity(ctx, "player", sp.x, sp.y, { alpha: 0.25, colorOverride: sp.color });
      // sólido: minha posição prevista (instantânea).
      const p = gc.predictor.predicted || sp;
      drawEntity(ctx, "player", p.x, p.y, { colorOverride: sp.color });
      drawLabel(ctx, "você", p.x, p.y);
    } else {
      const buf = gc.remotes.get(id);
      const pos = gc.settings.interpolation
        ? sampleInterpolated(buf, performance.now() - INTERP_DELAY)
        : buf && buf[buf.length - 1];
      const p = pos || sp;
      drawEntity(ctx, "player", p.x, p.y, { colorOverride: sp.color });
      drawLabel(ctx, id.slice(0, 4), p.x, p.y);
    }
  }
}

// Vitrine estática: um de cada inimigo (por ato) + boss, no rodapé. Serve de
// validação visual do pipeline de sprites até a arte/IA reais existirem.
function drawShowcase(ctx, canvas) {
  const row = [
    ...enemiesByAct(1),
    ...enemiesByAct(2),
    ...enemiesByAct(3),
    ENTITIES["the-impresario"],
  ];
  const y = canvas.height - 40;
  const gap = canvas.width / (row.length + 1);
  ctx.save();
  ctx.globalAlpha = 0.85;
  row.forEach((e, i) => {
    const x = gap * (i + 1);
    drawEntity(ctx, e.type, x, y);
  });
  ctx.restore();
}
