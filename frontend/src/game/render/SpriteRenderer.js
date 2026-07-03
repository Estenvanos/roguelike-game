// =====================================================================
// SPRITE RENDERER — ponto único de desenho de entidade. Usa a imagem do
// AssetLoader se existir; senão cai no placeholder procedural. Trocar arte
// real depois = por PNG + apontar "src" no manifest. Zero mudança aqui.
// =====================================================================
import { assets } from "./AssetLoader.js";
import { drawPlaceholder } from "./placeholders.js";

// Desenha a entidade `type` centrada em (x, y). opts: { alpha, colorOverride }.
export function drawEntity(ctx, type, x, y, opts = {}) {
  const entry = assets.get(type);

  // Sem entrada no manifest: fallback bem visível pra denunciar tipo faltando.
  if (!entry) {
    drawPlaceholder(ctx, { w: 24, h: 24, shape: "circle", color: "#f85149" }, x, y, opts);
    return;
  }

  const def = opts.colorOverride
    ? { ...entry.def, color: opts.colorOverride }
    : entry.def;

  if (entry.image) {
    const w = def.w ?? 32;
    const h = def.h ?? 32;
    ctx.save();
    ctx.globalAlpha = opts.alpha ?? 1;
    ctx.drawImage(entry.image, x - w / 2, y - h / 2, w, h);
    ctx.restore();
    return;
  }

  drawPlaceholder(ctx, def, x, y, opts);
}
