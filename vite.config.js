import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseado no mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',
    server: {
      port: 5173,
      host: true, // Permite acesso externo (0.0.0.0)
      strictPort: false,
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
})
