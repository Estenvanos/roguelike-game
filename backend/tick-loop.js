// Loop de timestep fixo isolado — sem lógica de jogo.
// Prova: o tickrate se mantém em 30/s mesmo com o processador travado por um for pesado,
// porque o número de ticks depende do tempo decorrido, não da carga do frame.

const TICKS_POR_SEGUNDO = 30;
const MS_POR_TICK = 1000 / TICKS_POR_SEGUNDO; // 33.333... ms por tick

let tickCount = 0;      // total de ticks desde o início
let ticksNoSegundo = 0; // ticks contados na janela de 1s atual

let ultimoTempo = performance.now();
let acumulador = 0;       // tempo pendente ainda não convertido em ticks
let acumuladorSegundo = 0; // tempo pendente para o log de 1s

function tick() {
  tickCount++;
  ticksNoSegundo++;
  // (sem lógica de jogo — só o contador)
}

function loop() {
  const agora = performance.now();
  let delta = agora - ultimoTempo;
  ultimoTempo = agora;

  // Trava de segurança: se o processo congelar muito, não tenta "recuperar"
  // milhares de ticks de uma vez (spiral of death). Limita a 250ms de catch-up.
  if (delta > 250) delta = 250;

  acumulador += delta;
  acumuladorSegundo += delta;

  // Consome o tempo acumulado em passos fixos de MS_POR_TICK.
  // Se um frame demorou, roda vários ticks para compensar — timestep continua fixo.
  while (acumulador >= MS_POR_TICK) {
    tick();
    acumulador -= MS_POR_TICK;
  }

  // Log a cada segundo de tempo real.
  while (acumuladorSegundo >= 1000) {
    console.log(`ticks no último segundo: ${ticksNoSegundo} | total: ${tickCount}`);
    ticksNoSegundo = 0;
    acumuladorSegundo -= 1000;
  }
}

// setInterval bem mais rápido que o timestep para o acumulador ter granularidade.
setInterval(loop, 4);

// --- Teste de carga: trava o processador de tempos em tempos ---
// Descomente para provar que o tickrate NÃO cai mesmo com o for pesado.
setInterval(() => {
  const fim = performance.now() + 200; // trava por 200ms
  let x = 0;
  while (performance.now() < fim) x++;
  console.log(`>>> travou 200ms de propósito (x=${x})`);
}, 3000);
