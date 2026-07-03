// =====================================================================
// CLIENT-SIDE PREDICTION + SERVER RECONCILIATION
//
// applyMove: MESMA função do servidor (backend/src/modules/game/
// game.state.js:applyMove). Move UM input, determinística. É o que permite
// reaplicar (replay) os inputs pendentes e cair no mesmo lugar que o
// servidor cairia.
// =====================================================================
import { WORLD, SPEED, RADIUS } from "../engine/constants.js";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function applyMove(p, keys) {
  if (keys.w) p.y -= SPEED;
  if (keys.s) p.y += SPEED;
  if (keys.a) p.x -= SPEED;
  if (keys.d) p.x += SPEED;
  p.x = clamp(p.x, RADIUS, WORLD.w - RADIUS);
  p.y = clamp(p.y, RADIUS, WORLD.h - RADIUS);
}

// Predictor do MEU player: guarda a posição prevista e o buffer de inputs
// ainda não confirmados pelo servidor.
export function createPredictor() {
  let predicted = null; // {x,y} posição que EU desenho
  let seq = 0; // numerador de inputs
  let pending = []; // inputs enviados ainda NÃO confirmados

  return {
    get predicted() {
      return predicted;
    },
    get pendingCount() {
      return pending.length;
    },

    // Loop do cliente: cria input numerado, prevê JÁ na posição local
    // (zero espera pelo servidor), guarda no buffer e devolve pra enviar.
    tick(keys, predictionOn) {
      const input = { seq: ++seq, keys: { ...keys } };
      if (predictionOn && predicted) applyMove(predicted, input.keys);
      pending.push(input);
      return input;
    },

    // RECONCILIATION — roda a cada snapshot do servidor.
    // 1) nasce a posição prevista onde o servidor diz (primeira vez)
    // 2) SNAP na posição autoritativa (velha, corresponde a me.lastSeq)
    // 3) descarta do buffer tudo que o servidor já confirmou (seq <= lastSeq)
    // 4) reaplica os inputs restantes por cima (replay) — mantém responsividade
    reconcile(me, predictionOn) {
      if (!predicted) predicted = { x: me.x, y: me.y };
      predicted.x = me.x;
      predicted.y = me.y;
      pending = pending.filter((input) => input.seq > me.lastSeq);
      if (predictionOn) {
        for (const input of pending) applyMove(predicted, input.keys);
      }
    },
  };
}
