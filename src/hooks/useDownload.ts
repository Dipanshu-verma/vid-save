import { useState, useCallback } from 'react';
import type { DownloadResult, DownloadStatus } from '../types';
import { addToHistory } from '../lib/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useDownload() {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDownload = useCallback(async (url: string) => {
    setStatus('loading');
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      const downloadResult = data as DownloadResult;
      setResult(downloadResult);
      setStatus('success');

      // Save to localStorage history
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

  return { status, result, error, fetchDownload, reset };
}