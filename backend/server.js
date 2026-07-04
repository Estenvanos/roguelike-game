// Entry point. Só amarra as peças: HTTP + WebSocket + loop do jogo.
import http from "http";
import { PORT, TICK_RATE } from "./src/config.js";
import { logger } from "./src/logger.js";
import { createApp } from "./src/app.js";
import { attachSocketServer, broadcastToRoom } from "./src/modules/realtime/socket.js";
import { createFixedLoop } from "./src/modules/game/game.loop.js";
import { listActiveRooms } from "./src/modules/rooms/rooms.state.js";

const app = createApp();
const server = http.createServer(app);

attachSocketServer(server);

// Cada tick: avança e transmite o estado de cada sala ativa, isoladamente.
createFixedLoop((tick) => {
  for (const room of listActiveRooms()) {
    room.game.step();
    broadcastToRoom(room, { type: "state", tick, players: room.game.snapshot() });
  }
});

server.listen(PORT, () => {
  logger.info(`Servidor na porta ${PORT} — tick fixo ${TICK_RATE}/s`);
});
