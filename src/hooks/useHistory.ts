import { useState, useEffect, useCallback } from 'react';
import type { DownloadRecord } from '../types';
import { getHistory } from '../lib/storage';

export function useHistory() {
  const [records, setRecords] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(() => {
    setLoading(true);
    // Simulate async for consistent UX with loading state
    setTimeout(() => {
      setRecords(getHistory());
      setLoading(false);
    }, 150);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Re-fetch when tab becomes visible (e.g., user returns to history tab)
  useEffect(() => {
    const onFocus = () => refetch();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetch]);

  return { records, loading, refetch };
}