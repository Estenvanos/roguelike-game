// Entry point. Só amarra as peças: HTTP + WebSocket + loop do jogo.
import http from "http";
import { PORT, TICK_RATE } from "./src/config.js";
import { logger } from "./src/logger.js";
import { createApp } from "./src/app.js";
import { attachSocketServer, broadcast } from "./src/modules/realtime/socket.js";
import { createFixedLoop } from "./src/modules/game/game.loop.js";
import * as game from "./src/modules/game/game.state.js";

const app = createApp();
const server = http.createServer(app);

attachSocketServer(server);

// Cada tick: avança o estado e transmite pra todos.
createFixedLoop((tick) => {
  game.step();
  broadcast({ type: "state", tick, players: game.snapshot() });
});

server.listen(PORT, () => {
  logger.info(`Servidor na porta ${PORT} — tick fixo ${TICK_RATE}/s`);
});
