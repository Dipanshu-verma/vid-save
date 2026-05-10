import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// vite-plugin-prerender's .mjs uses require() internally — broken in ESM.
// Force CJS loading via createRequire so Node uses dist/index.js instead.
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VitePluginPrerender: any = _require('vite-plugin-prerender');
const PuppeteerRenderer = VitePluginPrerender.PuppeteerRenderer;
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prerenderRoutes = [
  '/',
  '/downloader',
  '/whatsapp',
  '/history',
  '/about',
  '/faq',
  '/privacy',
  '/blog',
  '/blog/how-to-download-youtube-videos-2026',
  '/blog/how-to-save-instagram-reels',
  '/blog/how-to-save-whatsapp-status',
  '/blog/best-video-downloader-android-2026',
  '/blog/how-to-download-facebook-videos',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginPrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: prerenderRoutes,
      renderer: new PuppeteerRenderer({
        // Wait 5 s after mount so React fully renders before HTML capture.
        // wakeUpServer() fires a background fetch that doesn't block rendering.
        renderAfterTime: 5000,
        headless: true,
      }),
    }),
  ],
  // Must be '/' (absolute) so prerendered files at dist/downloader/index.html
  // reference /assets/... correctly regardless of their directory depth.
  // For Capacitor Android builds use: vite build --base=./
  base: '/',
  build: {
    // Target Chromium 77 (Puppeteer v1.20's bundled browser) so the prerender
    // step can execute the JS bundle. Chromium 77 lacks ?. and ?? (Chrome 80+),
    // so esbuild transpiles them here. Dynamic imports (Chrome 63+) are unaffected.
    // The resulting bundle runs fine in any modern browser too.
    target: ['chrome77'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
