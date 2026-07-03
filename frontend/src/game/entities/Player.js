// Representação leve de um player no cliente. O servidor é autoritativo —
// isto é só o espelho local pra render/predição. Posição vem do snapshot
// (outros players) ou do predictor (meu player).
export class Player {
  constructor({ id, x, y, color }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = "player";
  }

  update({ x, y, color }) {
    this.x = x;
    this.y = y;
    if (color) this.color = color;
  }
}
