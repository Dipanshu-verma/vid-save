export type Platform = 'youtube' | 'instagram' | 'facebook' | 'whatsapp' | 'tiktok' | 'twitter';

export type DownloadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface DownloadQuality {
  label: string;
  url: string;
  ext: string;
  size?: string;
  resolution?: string;
}

export interface DownloadResult {
  title: string;
  thumbnail: string;
  duration?: string;
  author?: string;
  platform: Platform;
  qualities: DownloadQuality[];
}

export interface DownloadRecord {
  id: string;
  session_id: string;
  platform: string;
  original_url: string;
  title: string;
  thumbnail_url: string;
  download_url: string;
  quality: string;
  file_size: number;
  status: string;
  error_message: string;
  created_at: string;
}

export interface Tab {
  id: string;
  label: string;
}
