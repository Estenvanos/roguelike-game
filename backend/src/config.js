// Constantes do servidor. Fonte única de números mágicos.
export const PORT = 3000;

export const TICK_RATE = 30;                 // ticks por segundo (timestep fixo)
export const MS_PER_TICK = 1000 / TICK_RATE; // 33.333... ms por tick

export const WORLD = { w: 800, h: 600 };

export const PLAYER = {
  speed: 4,   // px por tick
  radius: 16, // usado no clamp das bordas
};

export const COLORS = [
  "#ff6b35", "#f7c948", "#3fb950",
  "#58a6ff", "#f85149", "#bc8cff", "#39c5cf",
];
