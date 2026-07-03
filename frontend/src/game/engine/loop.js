// Loop de render baseado em requestAnimationFrame. Desacopla o "quando
// desenhar" (rAF, ~60fps) do "quando amostrar input" (setInterval TICK_MS).
// Retorna um handle com stop() pra o cleanup do React.
export function createRenderLoop(draw) {
  let rafId = null;
  let running = false;

  function frame() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
    },
  };
}
