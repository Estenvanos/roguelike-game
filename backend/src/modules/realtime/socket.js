// Camada de rede (WebSocket). Controller das conexões: traduz mensagens
// do socket em chamadas ao service da sala/jogo. Sem regra de jogo aqui.
//
// Uma conexão não entra em jogo nenhum automaticamente: fica sem sala até
// mandar join_room. A sala da conexão vive num objeto de closure (ctx.room)
// só daquele socket, não em Map global — cada sala tem seus próprios sockets.
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import { WORLD } from "../../config.js";
import { logger } from "../../logger.js";
import * as rooms from "../rooms/rooms.state.js";

const send = (socket, obj) => {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(obj));
};

// Manda um objeto só pros sockets de UMA sala.
export function broadcastToRoom(room, obj) {
  const msg = JSON.stringify(obj);
  for (const socket of room.sockets.values()) {
    if (socket.readyState === socket.OPEN) socket.send(msg);
  }
}

// Host caiu: decisão do produto é desligar a sala inteira, não promover outro host.
function closeRoom(room, reason) {
  broadcastToRoom(room, { type: "room_closed", message: reason });
  for (const socket of room.sockets.values()) socket.close();
  rooms.removeRoom(room.id);
  logger.info(`Sala ${room.name} encerrada (${reason})`);
}

function handleJoinRoom(id, socket, data, ctx) {
  const room = rooms.findById(data.roomId);
  if (!room) return send(socket, { type: "error", message: "sala não encontrada" });

  const isHost = rooms.claimHost(room, id, data.hostToken);
  room.sockets.set(id, socket);
  room.game.addPlayer(id);
  ctx.room = room;

  logger.info(
    `Player ${id} entrou na sala ${room.name}${isHost ? " como host" : ""} (${room.game.playerCount()} online)`
  );
  send(socket, { type: "welcome", id, roomId: room.id, isHost, world: WORLD });
}

function onMessage(id, socket, ctx, raw) {
  let data;
  try { data = JSON.parse(raw.toString()); } catch { return; }

  if (data.type === "join_room") return handleJoinRoom(id, socket, data, ctx);
  if (!ctx.room) return; // input/ping antes do join: ignora, sem sala pra rotear

  if (data.type === "input") return ctx.room.game.enqueueInput(id, data);
  if (data.type === "ping") return send(socket, { type: "pong", ts: data.ts });
}

function onConnection(socket) {
  const id = randomUUID();
  const ctx = { room: null };

  socket.on("message", (raw) => onMessage(id, socket, ctx, raw));
  socket.on("close", () => {
    const room = ctx.room;
    if (!room) return; // nunca chegou a entrar em nenhuma sala

    if (room.hostId === id) return closeRoom(room, "host desconectou");

    room.sockets.delete(id);
    room.game.removePlayer(id);
    logger.info(`Player ${id} saiu da sala ${room.name} (${room.game.playerCount()} online)`);
  });
}

// Pluga o WebSocketServer no servidor HTTP existente.
export function attachSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", onConnection);
  return wss;
}
