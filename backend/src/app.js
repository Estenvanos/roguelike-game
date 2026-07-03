// Monta o app Express: middlewares + rotas. Sem listen() aqui —
// quem sobe o servidor é o server.js (facilita testar o app isolado).
import express from "express";
import healthRoutes from "./modules/health/health.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "15mb" }));
  app.use(express.static("public"));

  app.use("/health", healthRoutes);

  return app;
}
