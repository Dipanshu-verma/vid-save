import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // New content available — auto-update silently
    updateSW(true);
  },
  onOfflineReady() {
    console.log('VidSave is ready to work offline!');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
