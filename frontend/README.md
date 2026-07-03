# Frontend — Carnaval das Sombras

Cliente do jogo: **React + Canvas**, empacotado com **Vite**. React cuida das
telas (menu, lobby, game over); o jogo em si roda num `<canvas>` dirigido pelo
netcode portado (client prediction, server reconciliation, entity interpolation).

## Rodar em dev

```bash
# 1) suba o backend (servidor autoritativo + tick loop na porta 3000)
cd ../backend && npm install && npm run dev

# 2) suba o frontend (Vite na porta 5173)
cd ../frontend && npm install && npm run dev
```

Abra `http://localhost:5173`. O WebSocket conecta direto em
`ws://localhost:3000` (handshake WS não sofre CORS). Abra uma segunda aba pra
ter um segundo jogador coop.

## Build de produção

```bash
npm run build      # gera frontend/dist/
```

O backend pode servir o `dist/` (ver `backend/src/app.js`).

## Estrutura

```
src/
  scenes/     telas React (Menu, Lobby, Game, GameOver)
  game/       núcleo do jogo, agnóstico de React
    net/      socket, prediction/reconciliation, interpolation
    render/   AssetLoader, placeholders, SpriteRenderer, world
    engine/   constants (espelham backend/src/config.js), loop
    entities/ registry das criaturas/itens + Player
    GameClient.js   orquestrador singleton do netcode
    GameCanvas.jsx  ponte React <-> canvas
  state/      GameStateContext (roteia cenas + status de rede)
  ui/         componentes reusáveis (Button, NetworkPill)
public/assets/  sprites (+ manifest.json), audio, fonts
```

## Adicionar conteúdo

- **Nova entidade** (inimigo/item): entrada em `src/game/entities/registry.js`
  + entrada em `public/assets/sprites/manifest.json`. Renderiza como placeholder
  até você dropar o PNG e apontar `src` no manifest.
- **Nova tela**: componente em `src/scenes/`, adicione ao enum `SCENES` e ao
  switch em `App.jsx`.

⚠️ **Sincronia de física**: `src/game/engine/constants.js` (SPEED, RADIUS, WORLD,
TICK) DEVE bater com `backend/src/config.js`. Se divergir, a predição não fecha
com o servidor e o boneco treme.
