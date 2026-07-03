// =====================================================================
// ENTITY INTERPOLATION dos OUTROS players.
//
// Pra cada player remoto guarda um histórico de posições com timestamp
// local. No render desenha num tempo ATRASADO (agora - INTERP_DELAY),
// interpolando entre as duas posições que cercam esse instante. Resultado:
// movimento suave mesmo com snapshots chegando a cada ~33ms.
// =====================================================================

export class RemoteBuffers {
  constructor() {
    this.buffers = {}; // id -> [ { t, x, y, color } ]
  }

  // Empilha a posição de cada player remoto com o horário de chegada.
  push(id, sample, now) {
    (this.buffers[id] ||= []).push({ t: now, ...sample });
    if (this.buffers[id].length > 60) this.buffers[id].shift(); // ~2s
  }

  // Remove buffers de quem não está no snapshot atual (desconectou).
  prune(livePlayers) {
    for (const id in this.buffers) {
      if (!livePlayers[id]) delete this.buffers[id];
    }
  }

  get(id) {
    return this.buffers[id];
  }
}

// Acha a posição do player remoto em renderTime (um instante no passado),
// interpolando linearmente entre as duas amostras que o cercam.
export function sampleInterpolated(buf, renderTime) {
  if (!buf || buf.length === 0) return null;
  // renderTime antes de tudo que temos: segura na amostra mais antiga.
  if (renderTime <= buf[0].t) return buf[0];
  // Procura o par a..b tal que a.t <= renderTime <= b.t e faz o lerp.
  for (let i = 0; i < buf.length - 1; i++) {
    const a = buf[i];
    const b = buf[i + 1];
    if (renderTime <= b.t) {
      const span = b.t - a.t;
      const alpha = span > 0 ? (renderTime - a.t) / span : 1; // 0..1
      return {
        x: a.x + (b.x - a.x) * alpha,
        y: a.y + (b.y - a.y) * alpha,
        color: b.color,
      };
    }
  }
  // renderTime além da última amostra: segura na última.
  return buf[buf.length - 1];
}
