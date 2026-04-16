import { registerPlugin } from '@capacitor/core';

export interface DownloaderPlugin {
  download(options: { url: string; filename: string }): Promise<void>;
}

const Downloader = registerPlugin<DownloaderPlugin>('Downloader');

export default Downloader;