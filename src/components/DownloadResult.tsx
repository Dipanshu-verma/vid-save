import { useState, useEffect } from 'react';
import { Download, Play, Clock, User, Loader2, CheckCircle2 } from 'lucide-react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import Downloader from '../plugins/Downloader';
import type { DownloadResult, DownloadQuality } from '../types';
import PlatformBadge from './PlatformBadge';

function useDownloadKeyframes() {
  useEffect(() => {
    const id = 'vidsave-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes vs-sweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
      @keyframes vs-grow {
        0%   { width: 0%; }
        60%  { width: 72%; }
        100% { width: 92%; }
      }
      @keyframes vs-bar {
        0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
        50%       { transform: scaleY(1);   opacity: 1; }
      }
      .vs-sweep  { animation: vs-sweep 1.6s ease-in-out infinite; }
      .vs-grow   { animation: vs-grow 12s ease-out forwards; }
      .vs-bar-1  { animation: vs-bar 0.8s ease-in-out infinite; }
      .vs-bar-2  { animation: vs-bar 0.8s ease-in-out 0.15s infinite; }
      .vs-bar-3  { animation: vs-bar 0.8s ease-in-out 0.3s infinite; }
    `;
    document.head.appendChild(style);
  }, []);
}

interface DownloadResultProps {
  result: DownloadResult;
}

function QualityButton({ quality, title }: { quality: DownloadQuality; title: string }) {  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
const [progress, setProgress] = useState<string>(''); // ADD THIS LINE

// const handleDownload = async () => {
//   if (state === 'loading') return;
//   setState('loading');
//
//   try {
//     const downloadUrl = quality.url
//       .replace('http://localhost:3001', import.meta.env.VITE_API_URL || 'http://192.168.1.11:3001');
//
//     const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;
//
//     try {
//       // Use native downloader — works in background
//       const { FileDownloader } = await import('@capawesome-team/capacitor-file-downloader');
//       await FileDownloader.download({
//         url: downloadUrl,
//         fileName: filename,
//       });
//     } catch {
//       // Fallback: fetch blob
//       const response = await fetch(downloadUrl);
//       if (!response.ok) throw new Error('Download failed');
//       const blob = await response.blob();
//       const base64 = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//       const { Filesystem, Directory } = await import('@capacitor/filesystem');
//       await Filesystem.writeFile({
//         path: filename,
//         data: base64,
//         directory: Directory.Documents,
//       });
//     }
//
//     setState('done');
//     setTimeout(() => setState('idle'), 3000);
//   } catch (err) {
//     console.error(err);
//     setState('idle');
//   }
// };

// const handleDownload = async () => {
//   if (state === 'loading') return;
//   setState('loading');
//
//   try {
//     const downloadUrl = quality.url
//       .replace('http://localhost:3001', import.meta.env.VITE_API_URL || 'http://192.168.1.4:3001');
//
//     const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;
//
//     if (Capacitor.isNativePlatform()) {
//       // Use native Android DownloadManager — runs in background, shows notification
//       await Downloader.download({ url: downloadUrl, filename });
//     } else {
//       // Web fallback
//       const a = document.createElement('a');
//       a.href = downloadUrl;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }
//
//     setState('done');
//     setTimeout(() => setState('idle'), 3000);
//   } catch (err) {
//     console.error(err);
//     setState('idle');
//   }
// };

// const handleDownload = async () => {
//   if (state === 'loading') return;
//   setState('loading');
//   setProgress('');
//
//   try {
//     const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
//     let downloadUrl = quality.url.replace('http://localhost:3001', API);
//     const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;
//
//     const isRenderJob = downloadUrl.includes('render-api') && downloadUrl.includes('execute');
//
//     if (isRenderJob) {
//       setProgress('Starting render...');
//       const execRes = await fetch(downloadUrl);
//       const text = await execRes.text();
//       let execData;
//       try { execData = JSON.parse(text); } catch {
//         throw new Error('Render API invalid response');
//       }
//
//       const sseUrl = execData.sseStatusUrl;
//       if (!sseUrl) throw new Error('No SSE URL');
//
//       setProgress('Processing...');
//       const cdnUrl = await new Promise<string>((resolve, reject) => {
//         const eventSource = new EventSource(sseUrl);
//         const timeout = setTimeout(() => {
//           eventSource.close();
//           reject(new Error('Render timeout'));
//         }, 120000);
//
//         eventSource.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             if (data.status === 'downloading_inputs') setProgress(`Downloading... ${data.progress || 0}%`);
//             else if (data.status === 'processing') setProgress(`Processing...`);
//             else if (data.status === 'uploading_output') setProgress(`Finalizing...`);
//             if (data.status === 'done' && data.output?.url) {
//               clearTimeout(timeout);
//               eventSource.close();
//               resolve(data.output.url);
//             } else if (data.status === 'error' || data.status === 'failed') {
//               clearTimeout(timeout);
//               eventSource.close();
//               reject(new Error('Render failed'));
//             }
//           } catch {}
//         };
//
//         eventSource.onerror = () => {
//           clearTimeout(timeout);
//           eventSource.close();
//           reject(new Error('SSE failed'));
//         };
//       });
//
//       // Proxy CDN URL through backend to avoid CORS/0kb issues
//         setProgress('Saving...');
//             downloadUrl = cdnUrl;
// //       setProgress('Saving...');
// //       downloadUrl = `${API}/api/proxy?url=${encodeURIComponent(cdnUrl)}&filename=${encodeURIComponent(filename)}`;
//     }
//
//     // Download
// //     if (Capacitor.isNativePlatform()) {
// //       await Downloader.download({ url: downloadUrl, filename });
// //     } else {
// //       const a = document.createElement('a');
// //       a.href = downloadUrl;
// //       a.download = filename;
// //       document.body.appendChild(a);
// //       a.click();
// //       document.body.removeChild(a);
// //     }
// // Download
//     if (Capacitor.isNativePlatform()) {
//       // Native — download directly from CDN
//       await Downloader.download({ url: downloadUrl, filename });
//     } else {
//       // Web — open CDN URL directly in new tab
//       window.open(downloadUrl, '_blank');
//     }
//
//     setState('done');
//     setProgress('');
//     setTimeout(() => setState('idle'), 3000);
//   } catch (err: any) {
//     console.error(err);
//     setState('idle');
//     setProgress('');
//     alert(`Download failed: ${err?.message || 'Unknown error'}`);
//   }
// };

// const handleDownload = async () => {
//   if (state === 'loading') return;
//   setState('loading');
//   setProgress('');
//
//   try {
//     const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
//     const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;
//
//     let sseStatusUrl = '';
//
//     const isRenderJob = quality.url.includes('render-api') && quality.url.includes('execute');
//     const isDirectUrl = (quality as any)._type === 'direct' || (quality as any).hashId;
//
//     if (isRenderJob) {
//       // Already has execution URL — trigger directly
//       setProgress('Starting render...');
//       const execRes = await fetch(quality.url);
//       const text = await execRes.text();
//       let execData;
//       try { execData = JSON.parse(text); } catch {
//         throw new Error('Render API invalid response');
//       }
//       sseStatusUrl = execData.sseStatusUrl;
//
//     } else if (isDirectUrl && (quality as any).hashId) {
//       // Get render URL on demand via backend
//       setProgress('Preparing render...');
//       const renderRes = await fetch(`${API}/api/render`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           hashId: (quality as any).hashId,
//           quality: quality.label,
//         }),
//       });
//       const renderData = await renderRes.json();
//       if (!renderData.sseStatusUrl) throw new Error('Render failed to start');
//       sseStatusUrl = renderData.sseStatusUrl;
//
//     } else {
//       throw new Error('No valid download method for this quality');
//     }
//
//     if (!sseStatusUrl) throw new Error('No SSE URL');
//
//     // Poll SSE
//     setProgress('Processing...');
//     const cdnUrl = await new Promise<string>((resolve, reject) => {
//       const eventSource = new EventSource(sseStatusUrl);
//       const timeout = setTimeout(() => {
//         eventSource.close();
//         reject(new Error('Render timeout'));
//       }, 120000);
//
//       eventSource.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           if (data.status === 'downloading_inputs') setProgress(`Downloading... ${data.progress || 0}%`);
//           else if (data.status === 'processing') setProgress('Processing...');
//           else if (data.status === 'uploading_output') setProgress('Finalizing...');
//           if (data.status === 'done' && data.output?.url) {
//             clearTimeout(timeout);
//             eventSource.close();
//             resolve(data.output.url);
//           } else if (data.status === 'error' || data.status === 'failed') {
//             clearTimeout(timeout);
//             eventSource.close();
//             reject(new Error('Render failed'));
//           }
//         } catch {}
//       };
//
//       eventSource.onerror = () => {
//         clearTimeout(timeout);
//         eventSource.close();
//         reject(new Error('SSE failed'));
//       };
//     });
//
//     setProgress('Saving...');
//     if (Capacitor.isNativePlatform()) {
//       await Downloader.download({ url: cdnUrl, filename });
//     } else {
//       window.open(cdnUrl, '_blank');
//     }
//
//     setState('done');
//     setProgress('');
//     setTimeout(() => setState('idle'), 3000);
//   } catch (err: any) {
//     console.error(err);
//     setState('idle');
//     setProgress('');
//     alert(`Download failed: ${err?.message || 'Unknown error'}`);
//   }
// };

const handleDownload = async () => {
  if (state === 'loading') return;
  setState('loading');
  setProgress('');

  try {
    const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
    let downloadUrl = quality.url.replace('http://localhost:3001', API);
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;

    // Handle RapidAPI render jobs
    const isRenderJob = downloadUrl.includes('render-api') && downloadUrl.includes('execute');

    if (isRenderJob) {
      setProgress('Starting render...');
      const execRes = await fetch(downloadUrl);
      const text = await execRes.text();
      let execData;
      try { execData = JSON.parse(text); } catch {
        throw new Error('Render API invalid response');
      }

      const sseUrl = execData.sseStatusUrl;
      if (!sseUrl) throw new Error('No SSE URL');

      setProgress('Processing...');
      downloadUrl = await new Promise<string>((resolve, reject) => {
        const eventSource = new EventSource(sseUrl);
        const timeout = setTimeout(() => {
          eventSource.close();
          reject(new Error('Render timeout'));
        }, 120000);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === 'downloading_inputs') setProgress(`Downloading... ${data.progress || 0}%`);
            else if (data.status === 'processing') setProgress('Processing...');
            else if (data.status === 'uploading_output') setProgress('Finalizing...');
            if (data.status === 'done' && data.output?.url) {
              clearTimeout(timeout);
              eventSource.close();
              resolve(data.output.url);
            } else if (data.status === 'error' || data.status === 'failed') {
              clearTimeout(timeout);
              eventSource.close();
              reject(new Error('Render failed'));
            }
          } catch {}
        };

        eventSource.onerror = () => {
          clearTimeout(timeout);
          eventSource.close();
          reject(new Error('SSE failed'));
        };
      });
    }

    setProgress('Saving...');

    // Download directly
    if (Capacitor.isNativePlatform()) {
      await Downloader.download({ url: downloadUrl, filename });
    } else {
      window.open(downloadUrl, '_blank');
    }

    setState('done');
    setProgress('');
    setTimeout(() => setState('idle'), 3000);
  } catch (err: any) {
    console.error(err);
    setState('idle');
    setProgress('');
    alert(`Download failed: ${err?.message || 'Unknown error'}`);
  }
};

  const isLoading = state === 'loading';
  const isDone = state === 'done';

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`
        relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl
        transition-all duration-200 overflow-hidden group
        disabled:cursor-not-allowed
        ${isDone
          ? 'bg-green-500/10 border border-green-500/30'
          : isLoading
            ? 'bg-slate-800 border border-sky-500/40'
            : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
        }
      `}
    >
      {/* Sweep shimmer overlay */}
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div
            className="vs-sweep absolute inset-y-0 w-1/2"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.07), transparent)' }}
          />
        </div>
      )}

      {/* Bottom progress bar */}
      {isLoading && (
        <div
          className="vs-grow absolute bottom-0 left-0 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }}
        />
      )}

      {/* Left — icon + text */}
      <div className="flex items-center gap-3 relative z-10">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
          ${isDone ? 'bg-green-500/15' : isLoading ? 'bg-sky-500/15' : 'bg-sky-500/10 group-hover:bg-sky-500/20'}
        `}>
          {isLoading ? (
            <svg className="w-3.5 h-3.5 text-sky-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          ) : isDone ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
          )}
        </div>

        <div className="text-left">
          <p className={`text-sm font-semibold transition-colors ${
            isDone ? 'text-green-400' : isLoading ? 'text-sky-300' : 'text-white'
          }`}>
            {isDone ? 'Saved to downloads' : isLoading ? 'Preparing download…' : quality.label}
          </p>
          <p className={`text-xs mt-0.5 transition-colors ${
            isDone ? 'text-green-500/60' : isLoading ? 'text-sky-500/60' : 'text-slate-400'
          }`}>
            {isLoading ? 'Merging video + audio' : quality.resolution ?? quality.label}
          </p>
        </div>
      </div>

      {/* Right — size + indicator */}
      <div className="flex items-center gap-2 relative z-10">
        {quality.size && (
          <span className={`text-xs font-medium tabular-nums transition-colors ${
            isDone ? 'text-green-500/70' : isLoading ? 'text-sky-400' : 'text-slate-400'
          }`}>
            {quality.size}
          </span>
        )}
        <span className={`text-xs font-medium uppercase transition-colors ${
          isDone ? 'text-green-500/40' : isLoading ? 'text-sky-500/50' : 'text-slate-500'
        }`}>
          .{quality.ext}
        </span>

        {isLoading ? (
          <div className="flex items-end gap-0.5 h-5">
            <div className="vs-bar-1 w-0.5 h-3 bg-sky-400 rounded-full" />
            <div className="vs-bar-2 w-0.5 h-4 bg-sky-400 rounded-full" />
            <div className="vs-bar-3 w-0.5 h-3 bg-sky-400 rounded-full" />
          </div>
        ) : isDone ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : (
          <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
        )}
      </div>
    </button>
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