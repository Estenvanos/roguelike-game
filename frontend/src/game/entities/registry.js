// =====================================================================
// REGISTRY de entidades — fonte única das criaturas/itens do jogo.
// Usado pelo render (via manifest) e, no futuro, pela IA de horda
// server-side. Cada tipo aqui deve ter uma entrada correspondente em
// public/assets/sprites/manifest.json (mesma chave "type").
//
// kind: player | enemy | boss | item
// act:  1..3 (ato/onda em que o inimigo aparece), null pra player/item/boss
// =====================================================================
export const ENTITIES = {
  // ---- jogador ----
  player: { type: "player", kind: "player", name: "Sobrevivente", act: null },

  // ---- Ato 1 — Abertura (fácil) ----
  "clown-balloon": {
    type: "clown-balloon",
    kind: "enemy",
    act: 1,
    name: "Palhaço Balão",
    behavior: "Fraco; explode em confete cortante ao morrer (dano em área)",
  },
  "loose-marionette": {
    type: "loose-marionette",
    kind: "enemy",
    act: 1,
    name: "Marionete Solta",
    behavior: "Lenta; move em grupo puxada por fios invisíveis",
  },
  "ghost-popcorn": {
    type: "ghost-popcorn",
    kind: "enemy",
    act: 1,
    name: "Pipoqueiro Fantasma",
    behavior: "Parado; atira pipoca em chamas à distância",
  },

  // ---- Ato 2 — Atrações Principais (médio) ----
  "rusty-strongman": {
    type: "rusty-strongman",
    kind: "enemy",
    act: 2,
    name: "Homem-Forte Enferrujado",
    behavior: "Tanque lento; quebra cobertura",
  },
  "shadow-contortionist": {
    type: "shadow-contortionist",
    kind: "enemy",
    act: 2,
    name: "Contorcionista Sombra",
    behavior: "Rápida; passa por espaços apertados, ataques imprevisíveis",
  },
  "faceless-tamer": {
    type: "faceless-tamer",
    kind: "enemy",
    act: 2,
    name: "Domador Sem Rosto",
    behavior: "Controla um grupo de feras distorcidas como minions",
  },

  // ---- Ato 3 — Espetáculo Final (difícil) ----
  "knife-juggler": {
    type: "knife-juggler",
    kind: "enemy",
    act: 3,
    name: "Malabarista de Facas",
    behavior: "Ataques à distância em padrão giratório; obriga movimentação",
  },
  "mirror-twins": {
    type: "mirror-twins",
    kind: "enemy",
    act: 3,
    name: "Gêmeos do Espelho",
    behavior: "Só morrem se atacados simultaneamente (força cooperação)",
  },
  "the-audience": {
    type: "the-audience",
    kind: "enemy",
    act: 3,
    name: "A Plateia",
    behavior: "Só aparece quando os jogadores ficam parados demais (pune camping)",
  },

  // ---- Chefe de ciclo ----
  "the-impresario": {
    type: "the-impresario",
    kind: "boss",
    act: null,
    name: "O Empresário",
    behavior: "Muda de forma por fase; dirige as ondas como um show ao vivo",
  },

  // ---- Itens / pickups ----
  applause: {
    type: "applause",
    kind: "item",
    act: null,
    name: "Aplauso",
    behavior: "Moeda de progressão da run (hype meter)",
  },
  "weapon-upgrade": {
    type: "weapon-upgrade",
    kind: "item",
    act: null,
    name: "Upgrade de Arma",
    behavior: "Barraca Tiro ao Alvo",
  },
  "mirror-clone": {
    type: "mirror-clone",
    kind: "item",
    act: null,
    name: "Clone do Espelho",
    behavior: "Barraca Casa dos Espelhos (duplicação)",
  },
  "fortune-wheel": {
    type: "fortune-wheel",
    kind: "item",
    act: null,
    name: "Roda da Fortuna",
    behavior: "Upgrade aleatório de risco/recompensa",
  },
};

export const enemiesByAct = (act) =>
  Object.values(ENTITIES).filter((e) => e.kind === "enemy" && e.act === act);
