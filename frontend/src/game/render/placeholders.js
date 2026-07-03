// =====================================================================
// PLACEHOLDERS PROCEDURAIS — desenham forma+cor por tipo enquanto não há
// arte real. Assim a tela nunca fica vazia e cada entidade é distinguível.
// Descritor vem do manifest.json: { w, h, shape, color }.
// =====================================================================

// Desenha um placeholder centrado em (x, y).
export function drawPlaceholder(ctx, def, x, y, opts = {}) {
  const w = def.w ?? 32;
  const h = def.h ?? 32;
  const r = Math.max(w, h) / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = opts.alpha ?? 1;
  ctx.fillStyle = def.color ?? "#ff6b35";
  ctx.strokeStyle = opts.stroke ?? "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1.5;

  switch (def.shape) {
    case "circle":
    case "balloon":
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (def.shape === "balloon") {
        // barbante do balão
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(0, r + h * 0.4);
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.stroke();
      }
      break;

    case "square":
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      break;

    case "diamond":
      poly(ctx, [
        [0, -h / 2],
        [w / 2, 0],
        [0, h / 2],
        [-w / 2, 0],
      ]);
      break;

    case "triangle":
      poly(ctx, [
        [0, -h / 2],
        [w / 2, h / 2],
        [-w / 2, h / 2],
      ]);
      break;

    case "cross":
      // marionete: cruz de controle
      ctx.fillRect(-w / 2, -h / 8, w, h / 4);
      ctx.fillRect(-w / 8, -h / 2, w / 4, h);
      break;

    case "star":
      star(ctx, 0, 0, 5, r, r * 0.45);
      break;

    case "ghost":
      ghost(ctx, w, h);
      break;

    default:
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
  }

  ctx.restore();
}

function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function star(ctx, cx, cy, spikes, outer, inner) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.lineTo(cx, cy - outer);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function ghost(ctx, w, h) {
  const r = w / 2;
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0); // topo arredondado
  ctx.lineTo(r, h / 2);
  // babados de baixo
  const waves = 4;
  for (let i = 0; i < waves; i++) {
    const x = r - ((i + 0.5) * w) / waves;
    ctx.lineTo(x, h / 2 - (i % 2 === 0 ? 6 : 0));
  }
  ctx.lineTo(-r, h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
