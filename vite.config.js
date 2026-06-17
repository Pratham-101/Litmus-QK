import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replit serves on $PORT and proxies via a *.replit.dev host, so preview must
// bind 0.0.0.0 and allow that host. Locally this still runs on 5190.
const PORT = Number(process.env.PORT) || 5190;

export default defineConfig({
  plugins: [react()],
  server: { port: 5190, host: true },
  preview: {
    port: PORT,
    host: true,
    allowedHosts: true,
  },
});
