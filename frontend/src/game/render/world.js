// Fundo do mundo: grid do "chão do parque". Portado do index.html.
export function drawWorld(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#141a24";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

// Rótulo de texto acima de uma entidade.
export function drawLabel(ctx, txt, x, y, offsetY = 22) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#e6edf3";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(txt, x, y - offsetY);
}
