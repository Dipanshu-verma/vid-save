import { AlertCircle } from 'lucide-react';
import DownloadForm from '../components/DownloadForm';
import DownloadResultCard from '../components/DownloadResult';
import { AdPlaceholder, InterstitialAd } from '../components/AdBanner';
import type { UseDownloadReturn } from '../hooks/useDownload';
import { useState, useEffect } from 'react';

interface DownloaderProps {
  downloadState: UseDownloadReturn;
}

export default function Downloader({ downloadState }: DownloaderProps) {
  const { status, result, error, fetchDownload, reset } = downloadState;
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    if (status === 'success' && result) {
      setShowInterstitial(true);
    }
  }, [status, result]);

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Video Downloader</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Download HD videos from YouTube, Instagram and Facebook — free, fast, no login required.
        </p>
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
          </div>
        </div>
      )}

      {result && status === 'success' && (
        <>
          <DownloadResultCard result={result} />
          <AdPlaceholder label="Advertisement" type="rectangle" />
        </>
      )}

      {/* Supported links content — always visible */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">How to Download</p>
        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>1. Copy the video link from YouTube, Instagram or Facebook</p>
          <p>2. Paste the URL above and tap Download Video</p>
          <p>3. Select quality and save to your Downloads folder</p>
        </div>
        <div className="border-t border-slate-700/30 pt-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Supported Links</p>
          <div className="space-y-1.5 text-xs text-slate-400">
            <p>• <span className="text-red-400 font-medium">YouTube</span> — youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...</p>
            <p>• <span className="text-pink-400 font-medium">Instagram</span> — instagram.com/p/..., instagram.com/reel/...</p>
            <p>• <span className="text-blue-400 font-medium">Facebook</span> — facebook.com/..., fb.watch/...</p>
          </div>
        </div>
      </div>

      {/* Ad only after content */}
      {status === 'idle' && <AdPlaceholder label="Advertisement" />}

      {showInterstitial && (
        <InterstitialAd onClose={() => setShowInterstitial(false)} />
      )}
    </div>
  );
}