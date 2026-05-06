import type { DownloadRecord } from '../types';

const HISTORY_KEY = 'vidsave_history';
const MAX_RECORDS = 50;

export function getHistory(): DownloadRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as DownloadRecord[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(record: Omit<DownloadRecord, 'id' | 'created_at'>): DownloadRecord {
  const existing = getHistory();
  const newRecord: DownloadRecord = {
    ...record,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newRecord, ...existing].slice(0, MAX_RECORDS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vidsave_history_updated'));

  return newRecord;
}

export function updateLatestHistoryFilename(title: string, filename: string): void {
  try {
    const records = getHistory();
    const idx = records.findIndex(r => r.title === title);
    if (idx !== -1) {
      records[idx].filename = filename;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
    }
  } catch {}
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}