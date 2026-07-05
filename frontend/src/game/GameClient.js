// =====================================================================
// GameClient — orquestrador do netcode. Amarra socket + predictor +
// interpolação e mantém o estado mutável do jogo. É um singleton
// compartilhado: a cena Lobby chama connect(), a cena Jogo (GameCanvas)
// lê o estado pra desenhar, e o React se inscreve via subscribe() só pro
// que a UI precisa (status, stats).
//
// Netcode portado fielmente do index.html original:
//   - clientTick 30x/s: amostra input, prevê local, envia numerado
//   - onState: reconciliation do meu player + buffer de interpolação dos outros
// =====================================================================
import { createSocket } from "./net/socket.js";
import { createPredictor } from "./net/prediction.js";
import { RemoteBuffers } from "./net/interpolation.js";
import { WORLD, TICK_MS, DEFAULT_SIM_LAG } from "./engine/constants.js";

class GameClient {
  constructor() {
    this.reset();
    // controles didáticos (persistem entre conexões)
    this.settings = {
      simLag: DEFAULT_SIM_LAG,
      prediction: true,
      interpolation: true,
    };
    this.listeners = new Set();
  }

  reset() {
    this.myId = null;
    this.world = { ...WORLD };
    this.serverPlayers = {}; // último snapshot (todos)
    this.predictor = createPredictor();
    this.remotes = new RemoteBuffers();
    this.keys = { w: false, a: false, s: false, d: false };
    this.status = "disconnected"; // disconnected | connecting | connected
    this.stats = { tick: "—", players: 0, buffer: 0, ack: 0 };
    this.socket = null;
    this.tickTimer = null;
    this.roomId = null;
    this.roomName = null;
    this.isHost = false;
    this.error = null;
  }

  // ---- pub/sub pro React (só status/stats mudam a UI) ----
  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.getPublicState());
    return () => this.listeners.delete(fn);
  }

  getPublicState() {
    return {
      status: this.status,
      stats: { ...this.stats },
      myId: this.myId,
      roomId: this.roomId,
      roomName: this.roomName,
      isHost: this.isHost,
      error: this.error,
    };
  }

  emit() {
    const s = this.getPublicState();
    for (const fn of this.listeners) fn(s);
  }

  // ---- conexão ----
  // roomId/hostToken: obtidos via REST (POST /rooms ou GET /rooms) antes de chamar isso.
  // roomName: só pra exibição na UI, não é campo de protocolo.
  connect({ roomId, hostToken, username, roomName } = {}) {
    if (this.socket) return; // já conectado/conectando
    this.status = "connecting";
    this.roomId = roomId ?? null;
    this.roomName = roomName ?? null;
    this.error = null;
    this.emit();

    this.socket = createSocket({
      roomId,
      hostToken,
      username,
      getLag: () => this.settings.simLag,
      onWelcome: (msg) => this.onWelcome(msg),
      onState: (msg) => this.onState(msg),
      onStatus: (up) => {
        this.status = up ? "connected" : "connecting";
        this.emit();
      },
      onError: (msg) => this.onError(msg),
      onRoomClosed: (msg) => this.onRoomClosed(msg),
    });

    // Loop do cliente: 30x/s amostra input, prevê e envia.
    this.tickTimer = setInterval(() => this.clientTick(), TICK_MS);
  }

  disconnect() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.socket) this.socket.close();
    this.reset();
    this.emit();
  }

  onWelcome(msg) {
    this.myId = msg.id;
    this.roomId = msg.roomId ?? this.roomId;
    this.isHost = Boolean(msg.isHost);
    if (msg.world) this.world = { ...this.world, ...msg.world };
    this.status = "connected";
    this.error = null;
    this.emit();
  }

  onError(msg) {
    this.error = msg.message || "erro desconhecido";
    this.emit(); // não derruba conexão nem muda status — a UI decide o que fazer
  }

  onRoomClosed(msg) {
    const reason = msg.message || "sala encerrada";
    this.disconnect(); // já existe: para tickTimer, fecha socket, reset()
    this.error = reason; // reset() zera error — reatribui depois
    this.emit();
  }

  onState(msg) {
    this.serverPlayers = msg.players;
    this.stats.tick = msg.tick;
    this.stats.players = Object.keys(msg.players).length;

    // Buffer de interpolação: empilha posição de cada OUTRO player.
    const now = performance.now();
    for (const id in msg.players) {
      if (id === this.myId) continue;
      const sp = msg.players[id];
      this.remotes.push(id, { x: sp.x, y: sp.y, color: sp.color }, now);
    }
    this.remotes.prune(msg.players);

    // Reconciliation do MEU player.
    const me = msg.players[this.myId];
    if (me) {
      this.predictor.reconcile(me, this.settings.prediction);
      this.stats.buffer = this.predictor.pendingCount;
      this.stats.ack = me.lastSeq;
    }
    this.emit();
  }

  clientTick() {
    if (!this.myId || !this.predictor.predicted) return; // espera 1º state
    const input = this.predictor.tick(this.keys, this.settings.prediction);
    this.socket?.send({ type: "input", seq: input.seq, keys: input.keys });
    this.stats.buffer = this.predictor.pendingCount;
  }

  // ---- input (chamado pelos listeners de teclado da cena) ----
  setKey(k, down) {
    if (k in this.keys) this.keys[k] = down;
  }
  clearKeys() {
    for (const k in this.keys) this.keys[k] = false;
  }
}

// Singleton compartilhado entre as cenas.
export const gameClient = new GameClient();
