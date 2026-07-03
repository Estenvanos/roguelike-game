// =====================================================================
// CONSTANTES DO CLIENTE — precisam BATER com o servidor
// (backend/src/config.js). Se divergirem, a predição não fecha com o
// servidor e o boneco treme. Fonte única no cliente.
// =====================================================================
export const WORLD = { w: 800, h: 600 };

export const SPEED = 4; // px por input (== PLAYER.speed no servidor)
export const RADIUS = 16; // == PLAYER.radius

export const TICK_RATE = 30; // igual ao TICK_RATE do servidor
export const TICK_MS = 1000 / TICK_RATE; // cliente amostra input 30x/s

// Render dos OUTROS players num tempo atrasado (folga contra jitter).
export const INTERP_DELAY = 100; // ms no passado (~3 ticks)

// Lag artificial padrão (didático) aplicado em cada sentido da rede.
export const DEFAULT_SIM_LAG = 120; // ms/lado

export const WS_URL = "ws://localhost:3000";
