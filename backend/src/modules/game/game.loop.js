// Loop de timestep fixo reutilizável (mesmo padrão do tick-loop.js).
// onTick(tick) roda exatamente TICK_RATE vezes por segundo de tempo real,
// independente da carga — o acumulador converte tempo decorrido em passos fixos.
import { MS_PER_TICK } from "../../config.js";

const INTERVAL_MS = 4;    // granularidade do acumulador (bem < MS_PER_TICK)
const MAX_CATCHUP = 250;  // trava anti "spiral of death" se o processo congelar

export function createFixedLoop(onTick) {
  let tick = 0;
  let last = performance.now();
  let acc = 0;

  const handle = setInterval(() => {
    const now = performance.now();
    let delta = now - last;
    last = now;
    if (delta > MAX_CATCHUP) delta = MAX_CATCHUP;

    acc += delta;
    while (acc >= MS_PER_TICK) {
      tick++;
      onTick(tick);
      acc -= MS_PER_TICK;
    }
  }, INTERVAL_MS);

  return () => clearInterval(handle); // stop()
}
