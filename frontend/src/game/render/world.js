let arenaImg = null;
let arenaLoading = false;

function loadArena() {
  if (arenaImg || arenaLoading) return;
  arenaLoading = true;
  const img = new Image();
  img.onload = () => { arenaImg = img; };
  img.onerror = () => console.warn("[world] arena.png não carregou");
  img.src = "/arena.png";
}

export function drawWorld(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  if (arenaImg) {
    ctx.drawImage(arenaImg, 0, 0, width, height);
  }
}

export function drawLabel(ctx, txt, x, y, offsetY = 22) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#e6edf3";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(txt, x, y - offsetY);
}
