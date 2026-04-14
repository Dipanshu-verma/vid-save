import { AlertCircle , Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import DownloadForm from '../components/DownloadForm';
import DownloadResultCard from '../components/DownloadResult';
import { AdPlaceholder } from '../components/AdBanner';
import { useDownload } from '../hooks/useDownload';

export default function Downloader() {
  const { status, result, error, fetchDownload, reset } = useDownload();

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Video Downloader</h2>
        <p className="text-sm text-slate-400 mt-0.5">Supports YouTube, Instagram, Facebook & more</p>
      </div>

      <DownloadForm onSubmit={fetchDownload} status={status} onReset={reset} />

      {status === 'error' && error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Download Failed</p>
            <p className="text-xs text-red-400/80 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="h-48 rounded-2xl bg-slate-800 animate-pulse" />
          <div className="h-4 rounded-lg bg-slate-800 animate-pulse w-3/4" />
          <div className="space-y-2">
            <div className="h-14 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-14 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-14 rounded-xl bg-slate-800 animate-pulse" />
          </div>
        </div>
      )}

      {status !== 'loading' && (
        <AdPlaceholder label="Advertisement" />
      )}

      {result && status === 'success' && (
        <DownloadResultCard result={result} />
      )}

      {status === 'success' && (
        <AdPlaceholder label="Advertisement" />
      )}

      <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Supported Links</p>
        <div className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
  <p className="flex items-center gap-2">
    <Youtube className="w-4 h-4 text-red-500" />
    <span>
      <span className="text-red-400 font-medium">YouTube</span> — youtube.com/watch?v=..., youtu.be/...
    </span>
  </p>

  <p className="flex items-center gap-2">
    <Instagram className="w-4 h-4 text-pink-500" />
    <span>
      <span className="text-pink-400 font-medium">Instagram</span> — instagram.com/p/..., instagram.com/reel/...
    </span>
  </p>

  <p className="flex items-center gap-2">
    <Facebook className="w-4 h-4 text-blue-500" />
    <span>
      <span className="text-blue-400 font-medium">Facebook</span> — facebook.com/..., fb.watch/...
    </span>
  </p>

  <p className="flex items-center gap-2">
    <Twitter className="w-4 h-4 text-sky-500" />
    <span>
      <span className="text-sky-400 font-medium">Twitter/X</span> — twitter.com/.../status/...
    </span>
  </p>
</div>
      </div>
    </div>
  );
}
