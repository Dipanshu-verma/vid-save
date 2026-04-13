import { useState, useEffect, useCallback } from 'react';
import type { DownloadRecord } from '../types';
import { supabase, getSessionId } from '../lib/supabase';

export function useHistory() {
  const [records, setRecords] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('downloads')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50);
    setRecords((data as DownloadRecord[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { records, loading, refetch: fetch };
}
