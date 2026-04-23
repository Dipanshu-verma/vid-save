// import { useState, useCallback } from 'react';
// import type { DownloadResult, DownloadStatus } from '../types';
// import { addToHistory } from '../lib/storage';
//
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
//
// export function useDownload() {
//   const [status, setStatus] = useState<DownloadStatus>('idle');
//   const [result, setResult] = useState<DownloadResult | null>(null);
//   const [error, setError] = useState<string | null>(null);
//
//   const fetchDownload = useCallback(async (url: string) => {
//     setStatus('loading');
//     setResult(null);
//     setError(null);
//
//     try {
//       const response = await fetch(`${API_URL}/api/download`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url }),
//       });
//
//       const data = await response.json();
//
//       if (!response.ok) {
//         throw new Error(data.error || `Request failed (${response.status})`);
//       }
//
//       const downloadResult = data as DownloadResult;
//       setResult(downloadResult);
//       setStatus('success');
//
//       addToHistory({
//         platform: downloadResult.platform,
//         title: downloadResult.title,
//         thumbnail_url: downloadResult.thumbnail,
//         download_url: downloadResult.qualities[0]?.url ?? '',
//         quality: downloadResult.qualities[0]?.label ?? '',
//         status: 'completed',
//         original_url: url,
//       });
//
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
//       setError(msg);
//       setStatus('error');
//     }
//   }, []);
//
//   const reset = useCallback(() => {
//     setStatus('idle');
//     setResult(null);
//     setError(null);
//   }, []);
//
//   return { status, result, error, fetchDownload, reset };
// }
//
// export type UseDownloadReturn = ReturnType<typeof useDownload>;

import { useState, useCallback, useEffect } from 'react';
import type { DownloadResult, DownloadStatus } from '../types';
import { addToHistory } from '../lib/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useDownload() {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Listen for network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (error === 'No internet connection. Please check your network and try again.') {
        setError(null);
        setStatus('idle');
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setError('No internet connection. Please check your network and try again.');
      setStatus('error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  const fetchDownload = useCallback(async (url: string) => {
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setResult(null);
    setError(null);

  const slowTimer = setTimeout(() => {
    setError('Server is starting up, please wait...');
  }, 8000);
    try {
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
  clearTimeout(slowTimer);
    setError(null);
      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || `Request failed (${response.status})`;

        // Friendly error messages
        if (msg.includes('bot') || msg.includes('Sign in') || msg.includes('cookies')) {
          throw new Error('YouTube downloads are temporarily unavailable. Try Instagram or Facebook.');
        } else if (msg.includes('private') || msg.includes('unavailable')) {
          throw new Error('This video is private or unavailable.');
        } else if (msg.includes('Unsupported platform')) {
          throw new Error('This platform is not supported. Try YouTube, Instagram or Facebook.');
        } else {
          throw new Error(msg);
        }
      }

      const downloadResult = data as DownloadResult;
      setResult(downloadResult);
      setStatus('success');

      addToHistory({
        platform: downloadResult.platform,
        title: downloadResult.title,
        thumbnail_url: downloadResult.thumbnail,
        download_url: downloadResult.qualities[0]?.url ?? '',
        quality: downloadResult.qualities[0]?.label ?? '',
        status: 'completed',
        original_url: url,
      });

    } catch (err) {
            clearTimeout(slowTimer);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, isOnline, fetchDownload, reset };
}

export type UseDownloadReturn = ReturnType<typeof useDownload>;