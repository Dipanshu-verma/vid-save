// import { registerPlugin } from '@capacitor/core';
//
// export interface DownloaderPlugin {
//   download(options: { url: string; filename: string }): Promise<void>;
//   pauseDownload(): Promise<void>;
//   resumeDownload(): Promise<void>;
//   cancelDownload(): Promise<void>;
//   scanFile(options: { path: string }): Promise<void>;
//   copyFile(options: { sourcePath: string; filename: string }): Promise<{ path: string }>;
//   getYoutubeInfo(options: { videoId: string }): Promise<{
//     title: string; thumbnail: string; qualities: string; platform: string;
//   }>;
//   requestStatusPermission(): Promise<{ uri: string }>;
//   getStatuses(options: { uri: string }): Promise<{ files: string }>;
//   saveStatusFile(options: { uri: string; filename: string }): Promise<void>;
//   openDownloadedFile(options: { filename: string }): Promise<void>;
//   addListener(event: 'downloadProgress', handler: (data: {
//     downloaded: number;
//     total: number;
//     percent: number;
//     paused: boolean;
//   }) => void): Promise<{ remove: () => void }>;
// }
//
// const Downloader = registerPlugin<DownloaderPlugin>('Downloader');
// export default Downloader;
import { registerPlugin } from '@capacitor/core';

export interface DownloaderPlugin {
  download(options: { url: string; filename: string; mimeType?: string }): Promise<void>;
  pauseDownload(): Promise<void>;
  resumeDownload(): Promise<void>;
  cancelDownload(): Promise<void>;
  scanFile(options: { path: string }): Promise<void>;
  copyFile(options: { sourcePath: string; filename: string }): Promise<{ path: string }>;
  getYoutubeInfo(options: { videoId: string }): Promise<{
    title: string; thumbnail: string; qualities: string; platform: string;
  }>;
  requestStatusPermission(): Promise<{ uri: string }>;
  getStatuses(options: { uri: string }): Promise<{ files: string }>;
  getStatusesDirect(): Promise<{ files: string; isDirect: boolean }>;
  saveStatusFile(options: { uri: string; filename: string }): Promise<void>;
  openDownloadedFile(options: { filename: string }): Promise<void>;
  addListener(event: 'downloadProgress', handler: (data: {
    downloaded: number; total: number; percent: number; paused: boolean;
  }) => void): Promise<{ remove: () => void }>;
checkStoragePermission(): Promise<{ granted: boolean }>;
requestAllFilesAccess(): Promise<void>;
addListener(event: 'statusThumbnailBatch', handler: (data: {
  batch: string;
}) => void): Promise<{ remove: () => void }>;
}

const Downloader = registerPlugin<DownloaderPlugin>('Downloader');

export default Downloader; // ← this line must exist