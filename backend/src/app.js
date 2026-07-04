// Monta o app Express: middlewares + rotas. Sem listen() aqui —
// quem sobe o servidor é o server.js (facilita testar o app isolado).
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import healthRoutes from "./modules/health/health.routes.js";
import roomsRoutes from "./modules/rooms/rooms.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "15mb" }));
  app.use(express.static("public"));

  // Em produção o front é buildado com Vite (frontend/dist) e servido aqui.
  // Em dev, o Vite serve o front na 5173 e essa pasta simplesmente não existe.
  app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

  app.use("/health", healthRoutes);
  app.use("/rooms", roomsRoutes);

  return app;
}
