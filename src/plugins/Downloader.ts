import { registerPlugin } from '@capacitor/core';

export interface DownloaderPlugin {
  download(options: { url: string; filename: string }): Promise<void>;
  scanFile(options: { path: string }): Promise<void>;
  copyFile(options: { sourcePath: string; filename: string }): Promise<{ path: string }>;
  getYoutubeInfo(options: { videoId: string }): Promise<{
    title: string;
    thumbnail: string;
    qualities: string;
    platform: string;
  }>;
}

const Downloader = registerPlugin<DownloaderPlugin>('Downloader');

export default Downloader;