import { useState, useCallback } from 'react';
import { Link, Clipboard, Loader2, Download, X } from 'lucide-react';
import { detectPlatform } from './PlatformBadge';
import type { DownloadStatus } from '../types';

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  status: DownloadStatus;
  onReset: () => void;
}

export default function DownloadForm({ onSubmit, status, onReset }: DownloadFormProps) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const detected = url.trim() ? detectPlatform(url.trim()) : null;
  const isLoading = status === 'loading';

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // Clipboard not available
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim() || isLoading) return;
      onSubmit(url.trim());
    },
    [url, isLoading, onSubmit]
  );

  const handleClear = useCallback(() => {
    setUrl('');
    onReset();
  }, [onReset]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-200 bg-slate-800/80 ${
          focused
            ? 'border-sky-500 shadow-lg shadow-sky-500/10'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="flex-shrink-0 pl-4">
          <Link className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste video URL here..."
          className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm px-3 py-4 outline-none min-w-0"
          disabled={isLoading}
        />
        {url ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-2 mr-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePaste}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 mr-2 rounded-xl bg-slate-700/80 text-slate-300 text-xs font-medium hover:bg-slate-600 transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>
        )}
      </div>

      {detected && (
        <p className="text-xs text-slate-400 px-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Detected: <span className="text-green-400 font-medium capitalize">{detected}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-sky-500 hover:bg-sky-400 active:scale-95 text-white shadow-lg shadow-sky-500/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Video
          </>
        )}
      </button>
    </form>
  );
}
