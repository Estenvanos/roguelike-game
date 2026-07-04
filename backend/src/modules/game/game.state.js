// Service do jogo: dono do gameState. Fonte única da verdade.
//
// Modelo de input: cada comando do cliente vem NUMERADO (seq). O servidor
// enfileira e processa um por um no tick. Guarda o último seq processado de
// cada player (lastSeq) e devolve no snapshot — é isso que deixa o cliente
// fazer reconciliation (saber quais inputs já foram confirmados).
//
// Factory em vez de módulo-singleton: cada sala precisa do seu próprio mundo
// isolado, então cada chamada de createGameState() dá uma instância nova.
import { WORLD, PLAYER, COLORS } from "../../config.js";

export function createGameState() {
  const players = {}; // id -> { x, y, color }
  const queues = {};  // id -> [ { seq, keys } ]  fila de inputs não processados
  const lastSeq = {}; // id -> seq do último input aplicado
  let colorIdx = 0;

  const spawn = () => ({
    x: Math.random() * (WORLD.w - 2 * PLAYER.radius) + PLAYER.radius,
    y: Math.random() * (WORLD.h - 2 * PLAYER.radius) + PLAYER.radius,
    color: COLORS[colorIdx++ % COLORS.length],
  });

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Movimento de UM comando. Precisa ser idêntico ao applyMove do cliente,
  // senão a predição diverge do servidor e o boneco fica "tremendo".
  function applyMove(p, keys) {
    if (keys.w) p.y -= PLAYER.speed;
    if (keys.s) p.y += PLAYER.speed;
    if (keys.a) p.x -= PLAYER.speed;
    if (keys.d) p.x += PLAYER.speed;
    p.x = clamp(p.x, PLAYER.radius, WORLD.w - PLAYER.radius);
    p.y = clamp(p.y, PLAYER.radius, WORLD.h - PLAYER.radius);
  }

  function addPlayer(id) {
    players[id] = spawn();
    queues[id] = [];
    lastSeq[id] = 0;
  }

  function removePlayer(id) {
    delete players[id];
    delete queues[id];
    delete lastSeq[id];
  }

  // Enfileira um input numerado. Não move aqui — só no step() do tick.
  function enqueueInput(id, input) {
    if (!queues[id]) return;
    if (typeof input?.seq !== "number") return; // ignora lixo/sem seq
    const k = input.keys || {};
    queues[id].push({
      seq: input.seq,
      keys: { w: !!k.w, a: !!k.a, s: !!k.s, d: !!k.d },
    });
  }

  function playerCount() {
    return Object.keys(players).length;
  }

  // Snapshot pro broadcast: posição + lastSeq de cada player.
  // O lastSeq é o que o cliente usa pra filtrar o buffer na reconciliation.
  function snapshot() {
    const out = {};
    for (const id in players) {
      out[id] = { ...players[id], lastSeq: lastSeq[id] };
    }
    return out;
  }

  // Avança a simulação um tick: drena a fila de cada player, aplicando
  // cada comando na ordem e anotando o último seq processado.
  function step() {
    for (const id in players) {
      const q = queues[id];
      while (q.length) {
        const cmd = q.shift();
        applyMove(players[id], cmd.keys);
        lastSeq[id] = cmd.seq;
      }
    }
  }

  return { addPlayer, removePlayer, enqueueInput, playerCount, snapshot, step };
}
