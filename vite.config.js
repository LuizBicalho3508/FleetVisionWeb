import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fleet Vision Web',
        short_name: 'FleetVision',
        description: 'Sistema Avançado de Gestão de Frotas',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone', // Remove a barra de URL do navegador
        icons: [
          {
            src: 'pwa-192x192.png', // Nota: Você precisará adicionar essas imagens na pasta public depois
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});