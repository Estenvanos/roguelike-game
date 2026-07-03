// Controller: só monta a resposta. Sem lógica de rota aqui.
export function getHealth(req, res) {
  res.json({ status: "ok", uptime: process.uptime() });
}
