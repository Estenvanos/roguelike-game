// Cliente REST das salas. Fetch puro, sem lib — mesmo padrão minimalista do resto do projeto.
import { API_URL } from "../engine/constants.js";

async function parseErrorMessage(res, fallback) {
  try {
    const body = await res.json();
    if (body?.message) return body.message;
  } catch {}
  return fallback;
}

export async function listRooms() {
  const res = await fetch(`${API_URL}/rooms`);
  if (!res.ok) throw new Error(await parseErrorMessage(res, "não foi possível listar as salas"));
  return res.json(); // [{id, name, playerCount}]
}

export async function createRoom(name) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "não foi possível fundar a sala"));
  return res.json(); // {id, name, hostToken}
}
