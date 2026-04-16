import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vidsave.app',
  appName: 'VidSave',
  webDir: 'dist',
  server: {
    cleartext: true,
    allowNavigation: ['*'],
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;