// =====================================================================
// CAMADA DE REDE (WebSocket) — com lag artificial nos DOIS sentidos, pra
// prediction/interpolação ficarem visíveis (didático). O lag é lido via
// getLag() a cada envio/recebimento, então o slider muda em tempo real.
// =====================================================================
import { WS_URL } from "../engine/constants.js";

// getLag: () => ms de atraso artificial por sentido
// onWelcome(msg), onState(msg): handlers do protocolo
// onStatus(connected: boolean)
export function createSocket({ getLag, onWelcome, onState, onStatus }) {
  let ws = null;
  let closed = false;
  let reconnectTimer = null;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => onStatus?.(true);

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
