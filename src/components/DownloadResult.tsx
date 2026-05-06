    import { useState, useEffect, useRef } from 'react';
    import { Download, Play, Clock, User, CheckCircle2, Pause, PlayCircle, Music } from 'lucide-react';
    import Downloader from '../plugins/Downloader';
    import type { DownloadResult, DownloadQuality } from '../types';
    import PlatformBadge from './PlatformBadge';
    import { useToast } from './Toast';
    import AdMob from '../plugins/AdMob';
    import { MONETAG_VIDEO_DOWNLOAD } from '../lib/constants';
    import { updateLatestHistoryFilename } from '../lib/storage';

    function useDownloadKeyframes() {
      useEffect(() => {
        const id = 'vidsave-keyframes';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
          @keyframes vs-bar {
            0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
            50%       { transform: scaleY(1);   opacity: 1; }
          }
          @keyframes vs-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes vs-pulse-ring {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          .vs-bar-1 { animation: vs-bar 0.8s ease-in-out infinite; }
          .vs-bar-2 { animation: vs-bar 0.8s ease-in-out 0.15s infinite; }
          .vs-bar-3 { animation: vs-bar 0.8s ease-in-out 0.3s infinite; }
          .vs-bar-4 { animation: vs-bar 0.8s ease-in-out 0.45s infinite; }
          .vs-shimmer { animation: vs-shimmer 2s ease-in-out infinite; }
          .vs-pulse-ring { animation: vs-pulse-ring 1.5s ease-out infinite; }
        `;
        document.head.appendChild(style);
      }, []);
    }

    interface DownloadResultProps {
      result: DownloadResult;
    }

    function QualityButton({ quality, title }: { quality: DownloadQuality; title: string }) {
      const [state, setState] = useState<'idle' | 'loading' | 'paused' | 'done'>('idle');
      const [progress, setProgress] = useState<string>('');
      const [percent, setPercent] = useState<number>(0);
      const [downloadedMB, setDownloadedMB] = useState<string>('');
      const { showError, showSuccess } = useToast();
      const progressListenerRef = useRef<{ remove: () => void } | null>(null);
      useDownloadKeyframes();
     const isAudio = quality.isAudio === true;
      const ext = isAudio ? 'mp3' : 'mp4';
      const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
      const handlePause = async () => {
        if (!Capacitor.isNativePlatform()) return;
        setState('paused');
        await Downloader.pauseDownload();
      };

      const handleResume = async () => {
        if (!Capacitor.isNativePlatform()) return;
        setState('loading');
        await Downloader.resumeDownload();
      };

      const handleDownload = async () => {
        if (state === 'loading' || state === 'paused') return;
        setState('loading');
        setProgress('Connecting...');
        setPercent(5);
        setDownloadedMB('');

        try {
          const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
          let downloadUrl = quality.url.replace('http://localhost:3001', API);
    //       const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;

    //       const isRenderJob = downloadUrl.includes('render-api') && downloadUrl.includes('execute');

    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.${ext}`;

    // Render job check — both video and audio use render job
    const isRenderJob = downloadUrl.includes('render-api') && downloadUrl.includes('execute');

          if (isRenderJob) {
            setProgress('Starting render job...');
            setPercent(10);

            const execRes = await fetch(downloadUrl);
            const text = await execRes.text();
            let execData;
            try { execData = JSON.parse(text); } catch {
              throw new Error('Render API invalid response');
            }

            const sseUrl = execData.sseStatusUrl;
            if (!sseUrl) throw new Error('No SSE URL');

            setProgress('Processing video...');
            setPercent(20);

            downloadUrl = await new Promise<string>((resolve, reject) => {
              const eventSource = new EventSource(sseUrl);
              const timeout = setTimeout(() => {
                eventSource.close();
                reject(new Error('Render timeout — video too large, try lower quality'));
              }, 300000);

              eventSource.onmessage = (event) => {
                try {
                  const data = JSON.parse(event.data);
                  if (data.status === 'not_found') {
                    setProgress('Queuing render job...');
                    setPercent(15);
                  } else if (data.status === 'downloading_inputs') {
                    setProgress('Downloading source...');
                    setPercent(20 + Math.floor((data.progress || 0) * 0.4));
                  } else if (data.status === 'processing') {
                    setProgress('Merging audio & video...');
                    setPercent(65);
                  } else if (data.status === 'uploading_output') {
                    setProgress('Finalizing...');
                    setPercent(85 + Math.floor((data.progress || 0) * 0.1));
                  }
    //               if (data.status === 'done' && data.output?.url) {
    //                 clearTimeout(timeout);
    //                 eventSource.close();
    //                 setPercent(95);
    //                 resolve(data.output.url);
    //               }
    if (data.status === 'done' && data.output?.url) {
      clearTimeout(timeout);
      eventSource.close();
      setPercent(90);

      if (isAudio) {
        // Route rendered video URL through audio extractor
        const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
        resolve(`${API}/api/audio?videoUrl=${encodeURIComponent(data.output.url)}&title=${encodeURIComponent(title)}`);
      } else {
        resolve(data.output.url);
      }
    }
              else if (data.status === 'error' || data.status === 'failed') {
                    clearTimeout(timeout);
                    eventSource.close();
                    reject(new Error('Render failed — try a lower quality'));
                  }
                } catch {}
              };

              eventSource.onerror = () => {
                console.warn('[SSE] reconnecting...');
                setProgress('Reconnecting...');
              };
            });
          }

          if (Capacitor.isNativePlatform()) {
            setProgress('Downloading...');
            setPercent(5);

            // Listen to progress events
            progressListenerRef.current = await Downloader.addListener(
              'downloadProgress',
              (data) => {
                const dlMB = (data.downloaded / (1024 * 1024)).toFixed(1);
                const totalMB = data.total > 0
                  ? ` / ${(data.total / (1024 * 1024)).toFixed(1)} MB`
                  : ' MB';
                setDownloadedMB(`${dlMB}${totalMB}`);
                if (data.percent > 0) setPercent(data.percent);
                if (!data.paused) {
                  setProgress(`Downloading... ${dlMB}${totalMB}`);
                }
              }
            );

            await Downloader.download({ url: downloadUrl, filename });

            progressListenerRef.current?.remove();
            progressListenerRef.current = null;

            setProgress('Saved! Check Downloads folder');
            updateLatestHistoryFilename(title, filename);

            try {
              await AdMob.loadInterstitial();
              await AdMob.showInterstitial();
//             } catch {
//               const { Browser } = await import('@capacitor/browser');
//               await Browser.open({ url: MONETAG_VIDEO_DOWNLOAD });
//             }
} catch {
  try {
    await AdMob.showMonatagInterstitial({ url: MONETAG_VIDEO_DOWNLOAD });
  } catch {}
}

          } else {
            try {
              setProgress('Downloading...');
              const response = await fetch(downloadUrl);
              const blob = await response.blob();
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = blobUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
            } catch {
              window.open(downloadUrl, '_blank');
            }
          }

          setPercent(100);
          showSuccess('Saved to Downloads!');
          setState('done');
          setProgress('');
          setDownloadedMB('');
          setTimeout(() => setState('idle'), 3000);

        } catch (err: any) {
          progressListenerRef.current?.remove();
          progressListenerRef.current = null;
          console.error(err);
          setState('idle');
          setProgress('');
          setPercent(0);
          setDownloadedMB('');
          showError(`Download failed: ${err?.message || 'Unknown error'}`);
        }
      };

      const isLoading = state === 'loading';
      const isPaused = state === 'paused';
      const isDone = state === 'done';
      const isActive = isLoading || isPaused;

      return (
        <div className="space-y-0">
          <button
            onClick={handleDownload}
            disabled={isActive}
            className={`
              relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl
              transition-all duration-300 overflow-hidden group
              disabled:cursor-not-allowed
              ${isDone
                ? 'bg-green-500/10 border border-green-500/30'
                : isActive
                  ? 'bg-slate-800/90 border border-sky-500/50 shadow-lg shadow-sky-500/10'
    //               : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
    : isAudio
      ? 'bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 active:scale-[0.98]'
      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
              }
            `}
          >
            {/* Animated background fill */}
            {isActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500/8 to-indigo-500/8 transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
                {isLoading && (
                  <div className="vs-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400/8 to-transparent" />
                )}
              </div>
            )}

            {/* Progress bar at bottom */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-700/50 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    isPaused
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}

            {/* Left */}
            <div className="flex items-center gap-3 relative z-10">
              <div className={`
                relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${isDone ? 'bg-green-500/15' : isActive ? 'bg-sky-500/15' : 'bg-sky-500/10 group-hover:bg-sky-500/20'}
              `}>
                {isLoading && (
                  <div className="vs-pulse-ring absolute inset-0 rounded-lg bg-sky-400/20" />
                )}
                {isLoading ? (
                  <svg className="w-4 h-4 text-sky-400 animate-spin relative z-10" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : isPaused ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
    //             ) : (
    //               <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
    //             )}
    ) : isAudio ? (
      <Music className="w-3.5 h-3.5 text-purple-400" />
    ) : (
      <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
    )}
              </div>

              <div className="text-left">
                <p className={`text-sm font-semibold transition-colors ${
                  isDone ? 'text-green-400'
                  : isPaused ? 'text-amber-400'
                  : isLoading ? 'text-sky-300'
                  : 'text-white'
                }`}>
                  {isDone ? 'Saved to Downloads ✓'
                    : isPaused ? 'Download Paused'
                    : isLoading ? progress
                    : quality.label}
                </p>
    <p className={`text-xs mt-0.5 transition-colors ${
      isDone ? 'text-green-500/60'
      : isPaused ? 'text-amber-500/70'
      : isLoading ? 'text-sky-500/70'
      : 'text-slate-400'
    }`}>
      {isActive
        ? downloadedMB || progress  // ← MB when available, else progress text (no %)
        : isDone ? 'Saved to Downloads'
    : (quality.resolution ?? quality.label)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              {quality.size && !isActive && (
                <span className={`text-xs font-medium tabular-nums ${
                  isDone ? 'text-green-500/70' : 'text-slate-400'
                }`}>
                  {quality.size}
                </span>
              )}
              {/* Percent removed — MB shown in subtitle instead */}
              <span className={`text-xs font-medium uppercase ${
                isDone ? 'text-green-500/40'
                : isActive ? 'text-sky-500/50'
                : 'text-slate-500'
              }`}>
                .{quality.ext}
              </span>

              {isLoading ? (
                <div className="flex items-end gap-0.5 h-5">
                  <div className="vs-bar-1 w-0.5 h-2 bg-sky-400 rounded-full" />
                  <div className="vs-bar-2 w-0.5 h-3 bg-sky-400 rounded-full" />
                  <div className="vs-bar-3 w-0.5 h-4 bg-indigo-400 rounded-full" />
                  <div className="vs-bar-4 w-0.5 h-3 bg-sky-400 rounded-full" />
                </div>
              ) : isDone ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (

                  <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
              )}
            </div>
          </button>

          {/* Pause / Resume button — only on native during download */}
          {isActive && Capacitor.isNativePlatform() && (
            <div className="flex gap-2 mt-1.5">
              {isLoading ? (
                <button
                  onClick={handlePause}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-semibold transition-all active:scale-95"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Pause Download
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-semibold transition-all active:scale-95"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Resume Download
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    export default function DownloadResultCard({ result }: DownloadResultProps) {
      return (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative">
            {result.thumbnail ? (
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
                <Play className="w-12 h-12 text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <PlatformBadge platform={result.platform} />
                {result.duration && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium">
                    <Clock className="w-2.5 h-2.5" />
                    {result.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{result.title}</h3>
            {result.author && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {result.author}
              </p>
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Choose Quality</p>
              <span className="text-xs text-slate-500">
                {result.qualities.length} option{result.qualities.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {result.qualities.map((q, i) => (
                <QualityButton key={i} quality={q} title={result.title} />
              ))}
            </div>
          </div>
        </div>
      );
    }