import { registerPlugin } from '@capacitor/core';

export interface UpdaterPlugin {
  getAppVersion(): Promise<{ version: string }>;
  downloadAndInstall(options: { url: string }): Promise<void>;
  addListener(event: 'updateProgress', handler: (data: {
    downloaded: number; total: number; percent: number;
  }) => void): Promise<{ remove: () => void }>;
}

const Updater = registerPlugin<UpdaterPlugin>('Updater');
export default Updater;