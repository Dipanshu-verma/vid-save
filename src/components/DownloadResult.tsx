// import { useState, useEffect } from 'react';
// import { Download, Play, Clock, User, Loader2, CheckCircle2 } from 'lucide-react';
// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Capacitor } from '@capacitor/core';
// import Downloader from '../plugins/Downloader';
// import type { DownloadResult, DownloadQuality } from '../types';
// import PlatformBadge from './PlatformBadge';
//
// function useDownloadKeyframes() {
//   useEffect(() => {
//     const id = 'vidsave-keyframes';
//     if (document.getElementById(id)) return;
//     const style = document.createElement('style');
//     style.id = id;
//     style.textContent = `
//       @keyframes vs-sweep {
//         0% { transform: translateX(-100%); }
//         100% { transform: translateX(400%); }
//       }
//       @keyframes vs-grow {
//         0%   { width: 0%; }
//         60%  { width: 72%; }
//         100% { width: 92%; }
//       }
//       @keyframes vs-bar {
//         0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
//         50%       { transform: scaleY(1);   opacity: 1; }
//       }
//       .vs-sweep  { animation: vs-sweep 1.6s ease-in-out infinite; }
//       .vs-grow   { animation: vs-grow 12s ease-out forwards; }
//       .vs-bar-1  { animation: vs-bar 0.8s ease-in-out infinite; }
//       .vs-bar-2  { animation: vs-bar 0.8s ease-in-out 0.15s infinite; }
//       .vs-bar-3  { animation: vs-bar 0.8s ease-in-out 0.3s infinite; }
//     `;
//     document.head.appendChild(style);
//   }, []);
// }
//
// interface DownloadResultProps {
//   result: DownloadResult;
// }
//
// const [progress, setProgress] = useState<string>(''); // ADD THIS LINE
// function QualityButton({ quality, title }: { quality: DownloadQuality; title: string }) {  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
//
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
//     // Handle RapidAPI render jobs
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
//       downloadUrl = await new Promise<string>((resolve, reject) => {
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
//             else if (data.status === 'processing') setProgress('Processing...');
//             else if (data.status === 'uploading_output') setProgress('Finalizing...');
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
//     }
//
//     setProgress('Saving...');
//
//     // Download directly
//     if (Capacitor.isNativePlatform()) {
//       await Downloader.download({ url: downloadUrl, filename });
//     } else {
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
//
//   const isLoading = state === 'loading';
//   const isDone = state === 'done';
//
//   return (
//     <button
//       onClick={handleDownload}
//       disabled={isLoading}
//       className={`
//         relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl
//         transition-all duration-200 overflow-hidden group
//         disabled:cursor-not-allowed
//         ${isDone
//           ? 'bg-green-500/10 border border-green-500/30'
//           : isLoading
//             ? 'bg-slate-800 border border-sky-500/40'
//             : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
//         }
//       `}
//     >
//       {/* Sweep shimmer overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
//           <div
//             className="vs-sweep absolute inset-y-0 w-1/2"
//             style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.07), transparent)' }}
//           />
//         </div>
//       )}
//
//       {/* Bottom progress bar */}
//       {isLoading && (
//         <div
//           className="vs-grow absolute bottom-0 left-0 h-0.5 rounded-full"
//           style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }}
//         />
//       )}
//
//       {/* Left — icon + text */}
//       <div className="flex items-center gap-3 relative z-10">
//         <div className={`
//           w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
//           ${isDone ? 'bg-green-500/15' : isLoading ? 'bg-sky-500/15' : 'bg-sky-500/10 group-hover:bg-sky-500/20'}
//         `}>
//           {isLoading ? (
//             <svg className="w-3.5 h-3.5 text-sky-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
//             </svg>
//           ) : isDone ? (
//             <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
//           ) : (
//             <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
//           )}
//         </div>
//
//         <div className="text-left">
//           <p className={`text-sm font-semibold transition-colors ${
//             isDone ? 'text-green-400' : isLoading ? 'text-sky-300' : 'text-white'
//           }`}>
//             {isDone ? 'Saved to downloads' : isLoading ? 'Preparing download…' : quality.label}
//           </p>
//           <p className={`text-xs mt-0.5 transition-colors ${
//             isDone ? 'text-green-500/60' : isLoading ? 'text-sky-500/60' : 'text-slate-400'
//           }`}>
//             {isLoading ? 'Merging video + audio' : quality.resolution ?? quality.label}
//           </p>
//         </div>
//       </div>
//
//       {/* Right — size + indicator */}
//       <div className="flex items-center gap-2 relative z-10">
//         {quality.size && (
//           <span className={`text-xs font-medium tabular-nums transition-colors ${
//             isDone ? 'text-green-500/70' : isLoading ? 'text-sky-400' : 'text-slate-400'
//           }`}>
//             {quality.size}
//           </span>
//         )}
//         <span className={`text-xs font-medium uppercase transition-colors ${
//           isDone ? 'text-green-500/40' : isLoading ? 'text-sky-500/50' : 'text-slate-500'
//         }`}>
//           .{quality.ext}
//         </span>
//
//         {isLoading ? (
//           <div className="flex items-end gap-0.5 h-5">
//             <div className="vs-bar-1 w-0.5 h-3 bg-sky-400 rounded-full" />
//             <div className="vs-bar-2 w-0.5 h-4 bg-sky-400 rounded-full" />
//             <div className="vs-bar-3 w-0.5 h-3 bg-sky-400 rounded-full" />
//           </div>
//         ) : isDone ? (
//           <CheckCircle2 className="w-4 h-4 text-green-400" />
//         ) : (
//           <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
//         )}
//       </div>
//     </button>
//   );
// }
//
// export default function DownloadResultCard({ result }: DownloadResultProps) {
//   return (
//     <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
//       <div className="relative">
//         {result.thumbnail ? (
//           <img
//             src={result.thumbnail}
//             alt={result.title}
//             className="w-full h-48 object-cover"
//             onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
//           />
//         ) : (
//           <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
//             <Play className="w-12 h-12 text-slate-600" />
//           </div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
//         <div className="absolute bottom-3 left-3 right-3">
//           <div className="flex items-center gap-1.5 flex-wrap">
//             <PlatformBadge platform={result.platform} />
//             {result.duration && (
//               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium">
//                 <Clock className="w-2.5 h-2.5" />
//                 {result.duration}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//
//       <div className="p-4 space-y-1">
//         <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{result.title}</h3>
//         {result.author && (
//           <p className="text-xs text-slate-400 flex items-center gap-1">
//             <User className="w-3 h-3" />
//             {result.author}
//           </p>
//         )}
//       </div>
//
//       <div className="px-4 pb-4">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Choose Quality</p>
//           <span className="text-xs text-slate-500">
//             {result.qualities.length} option{result.qualities.length !== 1 ? 's' : ''}
//           </span>
//         </div>
//         <div className="space-y-2">
// {result.qualities.map((q, i) => (
//   <QualityButton key={i} quality={q} title={result.title} />
// ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { Download, Play, Clock, User, CheckCircle2 } from 'lucide-react';
// import { Capacitor } from '@capacitor/core';
// import Downloader from '../plugins/Downloader';
// import type { DownloadResult, DownloadQuality } from '../types';
// import PlatformBadge from './PlatformBadge';
// import { useToast } from './Toast';
// import AdMob from '../plugins/AdMob';
//
// function useDownloadKeyframes() {
//   useEffect(() => {
//     const id = 'vidsave-keyframes';
//     if (document.getElementById(id)) return;
//     const style = document.createElement('style');
//     style.id = id;
//     style.textContent = `
//       @keyframes vs-bar {
//         0%, 100% { transform: scaleY(0.5); opacity: 0.4; }
//         50%       { transform: scaleY(1);   opacity: 1; }
//       }
//       @keyframes vs-shimmer {
//         0% { transform: translateX(-100%); }
//         100% { transform: translateX(200%); }
//       }
//       @keyframes vs-pulse-ring {
//         0% { transform: scale(0.8); opacity: 1; }
//         100% { transform: scale(2); opacity: 0; }
//       }
//       .vs-bar-1 { animation: vs-bar 0.8s ease-in-out infinite; }
//       .vs-bar-2 { animation: vs-bar 0.8s ease-in-out 0.15s infinite; }
//       .vs-bar-3 { animation: vs-bar 0.8s ease-in-out 0.3s infinite; }
//       .vs-bar-4 { animation: vs-bar 0.8s ease-in-out 0.45s infinite; }
//       .vs-shimmer { animation: vs-shimmer 2s ease-in-out infinite; }
//       .vs-pulse-ring { animation: vs-pulse-ring 1.5s ease-out infinite; }
//     `;
//     document.head.appendChild(style);
//   }, []);
// }
//
// interface DownloadResultProps {
//   result: DownloadResult;
// }
//
// function QualityButton({ quality, title }: { quality: DownloadQuality; title: string }) {
//   const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
//   const [progress, setProgress] = useState<string>('');
//   const [percent, setPercent] = useState<number>(0);
//   const { showError, showSuccess } = useToast();
//   useDownloadKeyframes();
//
//   const handleDownload = async () => {
//     if (state === 'loading') return;
//     setState('loading');
//     setProgress('Connecting...');
//     setPercent(5);
//
//     try {
//       const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
//       let downloadUrl = quality.url.replace('http://localhost:3001', API);
//       const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;
//
//       const isRenderJob = downloadUrl.includes('render-api') && downloadUrl.includes('execute');
//
//       if (isRenderJob) {
//         setProgress('Starting render job...');
//         setPercent(10);
//
//         const execRes = await fetch(downloadUrl);
//         const text = await execRes.text();
//         let execData;
//         try { execData = JSON.parse(text); } catch {
//           throw new Error('Render API invalid response');
//         }
//
//         const sseUrl = execData.sseStatusUrl;
//         if (!sseUrl) throw new Error('No SSE URL');
//
//         setProgress('Processing video...');
//         setPercent(20);
//
//         downloadUrl = await new Promise<string>((resolve, reject) => {
//           const eventSource = new EventSource(sseUrl);
//           const timeout = setTimeout(() => {
//             eventSource.close();
//             reject(new Error('Render timeout'));
//           }, 120000);
//
//           eventSource.onmessage = (event) => {
//             try {
//               const data = JSON.parse(event.data);
//               if (data.status === 'downloading_inputs') {
//                 setProgress('Downloading source...');
//                 setPercent(20 + Math.floor((data.progress || 0) * 0.4));
//               } else if (data.status === 'processing') {
//                 setProgress('Merging audio & video...');
//                 setPercent(65);
//               } else if (data.status === 'uploading_output') {
//                 setProgress('Finalizing...');
//                 setPercent(85 + Math.floor((data.progress || 0) * 0.1));
//               }
//               if (data.status === 'done' && data.output?.url) {
//                 clearTimeout(timeout);
//                 eventSource.close();
//                 setPercent(95);
//                 resolve(data.output.url);
//               } else if (data.status === 'error' || data.status === 'failed') {
//                 clearTimeout(timeout);
//                 eventSource.close();
//                 reject(new Error('Render failed'));
//               }
//             } catch {}
//           };
//
//           eventSource.onerror = () => {
//             clearTimeout(timeout);
//             eventSource.close();
//             reject(new Error('SSE failed'));
//           };
//         });
//       }
//
//       setProgress('Saving to device...');
//       setPercent(98);
//
// if (Capacitor.isNativePlatform()) {
//   setProgress('Downloading to device...');
//   // This now waits until download actually completes
//   await Downloader.download({ url: downloadUrl, filename });
//   setProgress('Saved! Check Downloads folder');
//     // Show interstitial ad after download
//     try {
//       await AdMob.loadInterstitial();
//       await AdMob.showInterstitial();
//     } catch {}
// } else {
//   window.open(downloadUrl, '_blank');
// }
//
//       setPercent(100);
//       showSuccess('Saved to Downloads!');
//
//       setState('done');
//       setProgress('');
//       setTimeout(() => setState('idle'), 3000);
//     } catch (err: any) {
//       console.error(err);
//       setState('idle');
//       setProgress('');
//       setPercent(0);
// showError(`Download failed: ${err?.message || 'Unknown error'}`);
//     }
//   };
//
//   const isLoading = state === 'loading';
//   const isDone = state === 'done';
//
//   return (
//     <button
//       onClick={handleDownload}
//       disabled={isLoading}
//       className={`
//         relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl
//         transition-all duration-300 overflow-hidden group
//         disabled:cursor-not-allowed
//         ${isDone
//           ? 'bg-green-500/10 border border-green-500/30'
//           : isLoading
//             ? 'bg-slate-800/90 border border-sky-500/50 shadow-lg shadow-sky-500/10'
//             : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
//         }
//       `}
//     >
//       {/* Animated background fill */}
//       {isLoading && (
//         <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
//           {/* Fill bar */}
//           <div
//             className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500/8 to-indigo-500/8 transition-all duration-700"
//             style={{ width: `${percent}%` }}
//           />
//           {/* Shimmer */}
//           <div
//             className="vs-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400/8 to-transparent"
//           />
//         </div>
//       )}
//
//       {/* Progress bar at bottom */}
//       {isLoading && (
//         <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-700/50 overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 transition-all duration-700 rounded-full"
//             style={{ width: `${percent}%` }}
//           />
//         </div>
//       )}
//
//       {/* Left */}
//       <div className="flex items-center gap-3 relative z-10">
//         <div className={`
//           relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
//           ${isDone ? 'bg-green-500/15' : isLoading ? 'bg-sky-500/15' : 'bg-sky-500/10 group-hover:bg-sky-500/20'}
//         `}>
//           {isLoading && (
//             <div className="vs-pulse-ring absolute inset-0 rounded-lg bg-sky-400/20" />
//           )}
//           {isLoading ? (
//             <svg className="w-4 h-4 text-sky-400 animate-spin relative z-10" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
//               <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
//             </svg>
//           ) : isDone ? (
//             <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
//           ) : (
//             <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
//           )}
//         </div>
//
//         <div className="text-left">
//           <p className={`text-sm font-semibold transition-colors ${
//             isDone ? 'text-green-400' : isLoading ? 'text-sky-300' : 'text-white'
//           }`}>
//             {isDone ? 'Saved to Downloads ✓' : isLoading ? progress : quality.label}
//           </p>
//           <p className={`text-xs mt-0.5 transition-colors ${
//             isDone ? 'text-green-500/60' : isLoading ? 'text-sky-500/70' : 'text-slate-400'
//           }`}>
//             {isLoading ? `${percent}% complete` : quality.resolution ?? quality.label}
//           </p>
//         </div>
//       </div>
//
//       {/* Right */}
//       <div className="flex items-center gap-2 relative z-10">
//         {quality.size && !isLoading && (
//           <span className={`text-xs font-medium tabular-nums ${
//             isDone ? 'text-green-500/70' : 'text-slate-400'
//           }`}>
//             {quality.size}
//           </span>
//         )}
//         {isLoading && (
//           <span className="text-xs font-bold tabular-nums text-sky-400 min-w-[32px] text-right">
//             {percent}%
//           </span>
//         )}
//         <span className={`text-xs font-medium uppercase ${
//           isDone ? 'text-green-500/40' : isLoading ? 'text-sky-500/50' : 'text-slate-500'
//         }`}>
//           .{quality.ext}
//         </span>
//
//         {isLoading ? (
//           <div className="flex items-end gap-0.5 h-5">
//             <div className="vs-bar-1 w-0.5 h-2 bg-sky-400 rounded-full" />
//             <div className="vs-bar-2 w-0.5 h-3 bg-sky-400 rounded-full" />
//             <div className="vs-bar-3 w-0.5 h-4 bg-indigo-400 rounded-full" />
//             <div className="vs-bar-4 w-0.5 h-3 bg-sky-400 rounded-full" />
//           </div>
//         ) : isDone ? (
//           <CheckCircle2 className="w-4 h-4 text-green-400" />
//         ) : (
//           <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
//         )}
//       </div>
//     </button>
//   );
// }
//
// export default function DownloadResultCard({ result }: DownloadResultProps) {
//   return (
//     <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
//       <div className="relative">
//         {result.thumbnail ? (
//           <img
//             src={result.thumbnail}
//             alt={result.title}
//             className="w-full h-48 object-cover"
//             onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
//           />
//         ) : (
//           <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
//             <Play className="w-12 h-12 text-slate-600" />
//           </div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
//         <div className="absolute bottom-3 left-3 right-3">
//           <div className="flex items-center gap-1.5 flex-wrap">
//             <PlatformBadge platform={result.platform} />
//             {result.duration && (
//               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium">
//                 <Clock className="w-2.5 h-2.5" />
//                 {result.duration}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//
//       <div className="p-4 space-y-1">
//         <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{result.title}</h3>
//         {result.author && (
//           <p className="text-xs text-slate-400 flex items-center gap-1">
//             <User className="w-3 h-3" />
//             {result.author}
//           </p>
//         )}
//       </div>
//
//       <div className="px-4 pb-4">
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Choose Quality</p>
//           <span className="text-xs text-slate-500">
//             {result.qualities.length} option{result.qualities.length !== 1 ? 's' : ''}
//           </span>
//         </div>
//         <div className="space-y-2">
//           {result.qualities.map((q, i) => (
//             <QualityButton key={i} quality={q} title={result.title} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Download, Play, Clock, User, CheckCircle2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Downloader from '../plugins/Downloader';
import type { DownloadResult, DownloadQuality } from '../types';
import PlatformBadge from './PlatformBadge';
import { useToast } from './Toast';
import AdMob from '../plugins/AdMob';

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
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [progress, setProgress] = useState<string>('');
  const [percent, setPercent] = useState<number>(0);
  const { showError, showSuccess } = useToast();
  useDownloadKeyframes();

  const handleDownload = async () => {
    if (state === 'loading') return;
    setState('loading');
    setProgress('Connecting...');
    setPercent(5);

    try {
      const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
      let downloadUrl = quality.url.replace('http://localhost:3001', API);
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}_${quality.label.replace(/\s+/g, '_')}.mp4`;

      const isMergeJob = (quality as any)._needsMerge === true;
      const isRenderJob = !isMergeJob && downloadUrl.includes('render-api') && downloadUrl.includes('execute');

      // Handle zm.io.vn YouTube HD — merge via backend ffmpeg
      if (isMergeJob) {
        setProgress('Merging video + audio...');
        setPercent(15);

        const audioUrl = (quality as any).audioUrl;
        const mergeUrl = `${API}/api/merge?videoUrl=${encodeURIComponent(downloadUrl)}&audioUrl=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(filename)}`;

        setProgress('Downloading merged video...');
        setPercent(30);

        if (Capacitor.isNativePlatform()) {
          await Downloader.download({ url: mergeUrl, filename });
          try {
            await AdMob.loadInterstitial();
            await AdMob.showInterstitial();
          } catch {}
        } else {
          window.open(mergeUrl, '_blank');
        }

        setPercent(100);
        showSuccess('Saved to Downloads!');
        setState('done');
        setProgress('');
        setTimeout(() => setState('idle'), 3000);
        return;
      }

      // Handle old RapidAPI render jobs
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
            reject(new Error('Render timeout'));
          }, 120000);

          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.status === 'downloading_inputs') {
                setProgress('Downloading source...');
                setPercent(20 + Math.floor((data.progress || 0) * 0.4));
              } else if (data.status === 'processing') {
                setProgress('Merging audio & video...');
                setPercent(65);
              } else if (data.status === 'uploading_output') {
                setProgress('Finalizing...');
                setPercent(85 + Math.floor((data.progress || 0) * 0.1));
              }
              if (data.status === 'done' && data.output?.url) {
                clearTimeout(timeout);
                eventSource.close();
                setPercent(95);
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

      // Direct download (Instagram/Facebook/YouTube 360p)
      setProgress('Saving to device...');
      setPercent(98);

      if (Capacitor.isNativePlatform()) {
        setProgress('Downloading to device...');
        await Downloader.download({ url: downloadUrl, filename });
        try {
          await AdMob.loadInterstitial();
          await AdMob.showInterstitial();
        } catch {}
      } else {
        window.open(downloadUrl, '_blank');
      }

      setPercent(100);
      showSuccess('Saved to Downloads!');
      setState('done');
      setProgress('');
      setTimeout(() => setState('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setState('idle');
      setProgress('');
      setPercent(0);
      showError(`Download failed: ${err?.message || 'Unknown error'}`);
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
        transition-all duration-300 overflow-hidden group
        disabled:cursor-not-allowed
        ${isDone
          ? 'bg-green-500/10 border border-green-500/30'
          : isLoading
            ? 'bg-slate-800/90 border border-sky-500/50 shadow-lg shadow-sky-500/10'
            : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 active:scale-[0.98]'
        }
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500/8 to-indigo-500/8 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
          <div className="vs-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400/8 to-transparent" />
        </div>
      )}

      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-700/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 transition-all duration-700 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <div className="flex items-center gap-3 relative z-10">
        <div className={`
          relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
          ${isDone ? 'bg-green-500/15' : isLoading ? 'bg-sky-500/15' : 'bg-sky-500/10 group-hover:bg-sky-500/20'}
        `}>
          {isLoading && (
            <div className="vs-pulse-ring absolute inset-0 rounded-lg bg-sky-400/20" />
          )}
          {isLoading ? (
            <svg className="w-4 h-4 text-sky-400 animate-spin relative z-10" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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
            {isDone ? 'Saved to Downloads ✓' : isLoading ? progress : quality.label}
          </p>
          <p className={`text-xs mt-0.5 transition-colors ${
            isDone ? 'text-green-500/60' : isLoading ? 'text-sky-500/70' : 'text-slate-400'
          }`}>
            {isLoading ? `${percent}% complete` : quality.resolution ?? quality.label}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        {quality.size && !isLoading && (
          <span className={`text-xs font-medium tabular-nums ${isDone ? 'text-green-500/70' : 'text-slate-400'}`}>
            {quality.size}
          </span>
        )}
        {isLoading && (
          <span className="text-xs font-bold tabular-nums text-sky-400 min-w-[32px] text-right">
            {percent}%
          </span>
        )}
        <span className={`text-xs font-medium uppercase ${
          isDone ? 'text-green-500/40' : isLoading ? 'text-sky-500/50' : 'text-slate-500'
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