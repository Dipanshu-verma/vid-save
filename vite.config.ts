import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'VidSave - Video Downloader',
        short_name: 'VidSave',
        description: 'Download videos from YouTube, Instagram, Facebook and save WhatsApp statuses',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0ea5e9',
        orientation: 'portrait-primary',
        categories: ['utilities', 'entertainment'],
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Download Video',
            short_name: 'Download',
            description: 'Download a video from a URL',
            url: '/?tab=downloader',
          },
          {
            name: 'WhatsApp Saver',
            short_name: 'WA Saver',
            description: 'Save WhatsApp status videos',
            url: '/?tab=whatsapp',
          },
        ],
      },
      workbox: {
        // globPatterns is auto-detected by vite-plugin-pwa from the build output
        // Specifying it manually causes a warning in dev mode (dev-dist is empty)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
