// Camada de rede (WebSocket). Controller das conexões: traduz mensagens
// do socket em chamadas ao service do jogo. Sem regra de jogo aqui.
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import { WORLD } from "../../config.js";
import { logger } from "../../logger.js";
import * as game from "../game/game.state.js";

const sockets = new Map(); // id -> socket

const send = (socket, obj) => {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(obj));
};

// Manda um objeto pra todos os sockets abertos.
export function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const socket of sockets.values()) {
    if (socket.readyState === socket.OPEN) socket.send(msg);
  }
}

function onMessage(id, socket, raw) {
  let data;
  try { data = JSON.parse(raw.toString()); } catch { return; }

  // Input numerado (seq + keys): enfileira no service. Movimento no tick.
  if (data.type === "input") return game.enqueueInput(id, data);
  if (data.type === "ping") return send(socket, { type: "pong", ts: data.ts });
}

function onConnection(socket) {
  const id = randomUUID();
  sockets.set(id, socket);
  game.addPlayer(id);
  logger.info(`Player conectou: ${id} (${game.playerCount()} online)`);

  send(socket, { type: "welcome", id, world: WORLD });

  socket.on("message", (raw) => onMessage(id, socket, raw));
  socket.on("close", () => {
    game.removePlayer(id);
    sockets.delete(id);
    logger.info(`Player desconectou: ${id} (${game.playerCount()} online)`);
  });
}

// Pluga o WebSocketServer no servidor HTTP existente.
export function attachSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", onConnection);
  return wss;
}
