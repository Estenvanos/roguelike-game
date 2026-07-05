// =====================================================================
// CAMADA DE REDE (WebSocket) — com lag artificial nos DOIS sentidos, pra
// prediction/interpolação ficarem visíveis (didático). O lag é lido via
// getLag() a cada envio/recebimento, então o slider muda em tempo real.
// =====================================================================
import { WS_URL } from "../engine/constants.js";

// roomId/hostToken/username: fixados na criação, mandados em join_room a
// cada (re)conexão — connect() é reusado pelo reconnectTimer, então toda
// reconexão automática reentra na mesma sala sozinha.
// onWelcome(msg), onState(msg), onError(msg), onRoomClosed(msg): handlers do protocolo
// onStatus(connected: boolean)
export function createSocket({ roomId, hostToken, username, getLag, onWelcome, onState, onError, onRoomClosed, onStatus }) {
  let ws = null;
  let closed = false;
  let reconnectTimer = null;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      onStatus?.(true);
      send({ type: "join_room", roomId, hostToken, username });
    };

    ws.onclose = () => {
      onStatus?.(false);
      if (!closed) reconnectTimer = setTimeout(connect, 1000);
    };

    ws.onerror = () => {};

    ws.onmessage = (ev) => {
      // Atraso artificial na CHEGADA (downstream lag).
      const raw = ev.data;
      setTimeout(() => {
        let msg;
        try {
          msg = JSON.parse(raw);
        } catch {
          return;
        }
        if (msg.type === "welcome") onWelcome?.(msg);
        else if (msg.type === "state") onState?.(msg);
        else if (msg.type === "error") onError?.(msg);
        else if (msg.type === "room_closed") onRoomClosed?.(msg);
      }, getLag());
    };
  }

  // Envio com atraso artificial (upstream lag).
  function send(obj) {
    const data = JSON.stringify(obj);
    setTimeout(() => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
    }, getLag());
  }

  function close() {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (ws) ws.close();
  }

  connect();
  return { send, close };
}
