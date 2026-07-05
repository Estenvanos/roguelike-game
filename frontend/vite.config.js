import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server na 5173. O WebSocket do jogo conecta direto em ws://localhost:3000
// (handshake WS não sofre CORS). Já as rotas REST de sala (/rooms) precisam de
// proxy: o backend não responde preflight OPTIONS, então POST cross-origin
// com Content-Type: application/json quebraria sem isso.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/rooms": "http://localhost:3000",
    },
  },
});
