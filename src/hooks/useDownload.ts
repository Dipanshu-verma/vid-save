import { useState, useCallback } from 'react';
import type { DownloadResult, DownloadStatus } from '../types';
import { supabase, getSessionId } from '../lib/supabase';

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-downloader`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useDownload() {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDownload = useCallback(async (url: string) => {
    setStatus('loading');
    setResult(null);
    setError(null);

    const sessionId = getSessionId();

    const { data: record } = await supabase
      .from('downloads')
      .insert({
        session_id: sessionId,
        platform: 'unknown',
        original_url: url,
        status: 'pending',
      })
      .select('id')
      .single();

    const recordId = record?.id;

    try {
      const response = await fetch(EDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data: DownloadResult = await response.json();
      setResult(data);
      setStatus('success');

      if (recordId) {
        await supabase
          .from('downloads')
          .update({
            platform: data.platform,
            title: data.title,
            thumbnail_url: data.thumbnail,
            download_url: data.qualities[0]?.url ?? '',
            quality: data.qualities[0]?.label ?? '',
            status: 'completed',
          })
          .eq('id', recordId);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setStatus('error');
      if (recordId) {
        await supabase
          .from('downloads')
          .update({ status: 'failed', error_message: msg })
          .eq('id', recordId);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, fetchDownload, reset };
}
