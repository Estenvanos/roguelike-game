// Pílula de status de rede (portada do index.html). Verde = conectado.
const LABEL = {
  connected: "Conectado",
  connecting: "Conectando…",
  disconnected: "Desconectado",
};

export default function NetworkPill({ status }) {
  const on = status === "connected";
  return (
    <div className="pill">
      <span className={"dot " + (on ? "on" : "off")} />
      <span>{LABEL[status] ?? "Desconectado"}</span>
    </div>
  );
}
