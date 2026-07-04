// Registro de salas em memória. Cada sala tem seu próprio gameState isolado
// e seu próprio conjunto de sockets — é o que substitui o "canal único" antigo.
import { randomUUID } from "crypto";
import { createGameState } from "../game/game.state.js";

const rooms = new Map(); // id -> room
// room = { id, name, game, sockets: Map<playerId, socket>, hostId: null|string, pendingHostToken }

export class RoomValidationError extends Error {}
export class RoomNameTakenError extends Error {}

export function createRoom(name) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new RoomValidationError("nome da sala não pode ser vazio");
  if (findByName(trimmed)) throw new RoomNameTakenError("já existe uma sala com esse nome");

  const id = randomUUID();
  const hostToken = randomUUID(); // amarra criador (HTTP) -> host (reivindicado depois via WS)
  const room = {
    id,
    name: trimmed,
    game: createGameState(),
    sockets: new Map(),
    hostId: null,
    pendingHostToken: hostToken,
  };
  rooms.set(id, room);
  return { id, name: trimmed, hostToken };
}

export function findById(id) {
  return rooms.get(id) ?? null;
}

export function findByName(name) {
  const target = name.trim().toLowerCase();
  for (const room of rooms.values()) {
    if (room.name.toLowerCase() === target) return room;
  }
  return null;
}

// Objetos crus (game/sockets inclusos) — uso interno: server.js (loop) e controller (formata pra resposta).
export function listActiveRooms() {
  return [...rooms.values()];
}

export function removeRoom(id) {
  rooms.delete(id);
}

// Só pode virar host uma vez; o token "morre" por construção assim que hostId != null.
export function claimHost(room, id, token) {
  if (room.hostId !== null) return false;
  if (!token || token !== room.pendingHostToken) return false;
  room.hostId = id;
  return true;
}
