// Controller: valida input e monta resposta. Regra de sala mora em rooms.state.js.
import * as rooms from "./rooms.state.js";

export function create(req, res) {
  const { name } = req.body ?? {};
  try {
    const { id, name: roomName, hostToken } = rooms.createRoom(name);
    res.status(201).json({ id, name: roomName, hostToken });
  } catch (err) {
    if (err instanceof rooms.RoomValidationError) return res.status(400).json({ message: err.message });
    if (err instanceof rooms.RoomNameTakenError) return res.status(409).json({ message: err.message });
    throw err;
  }
}

export function list(req, res) {
  res.json(
    rooms.listActiveRooms().map((r) => ({ id: r.id, name: r.name, playerCount: r.game.playerCount() }))
  );
}

export function findByName(req, res) {
  const room = rooms.findByName(req.params.name);
  if (!room) return res.status(404).json({ message: "sala não encontrada" });
  res.json({ id: room.id, name: room.name, playerCount: room.game.playerCount() });
}
