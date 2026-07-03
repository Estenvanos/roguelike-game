import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server na 5173. O WebSocket do jogo conecta direto em ws://localhost:3000
// (handshake WS não sofre CORS), então não precisa de proxy aqui.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
