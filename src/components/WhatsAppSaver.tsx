// import { useState, useCallback, useRef } from 'react';
// import { MessageCircle, FolderOpen, Download, Image, Film, AlertCircle, CheckCircle2, Info } from 'lucide-react';

// interface MediaFile {
//   name: string;
//   url: string;
//   type: 'video' | 'image';
//   size: string;
// }

// function formatSize(bytes: number): string {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// }

// export default function WhatsAppSaver() {
//   const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
//   const [picked, setPicked] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [saved, setSaved] = useState<Set<string>>(new Set());
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFilePick = useCallback(async () => {
//     if ('showDirectoryPicker' in window) {
//       try {
//         const dirHandle = await (window as Window & typeof globalThis & {
//           showDirectoryPicker: (opts?: { id?: string, mode?: string }) => Promise<FileSystemDirectoryHandle>
//         }).showDirectoryPicker({ id: 'whatsapp-status', mode: 'read' });

//         const files: MediaFile[] = [];
//         for await (const entry of (dirHandle as unknown as AsyncIterable<FileSystemHandle>)) {
//           if (entry.kind !== 'file') continue;
//           const fileHandle = entry as FileSystemFileHandle;
//           const file = await fileHandle.getFile();
//           const isVideo = file.type.startsWith('video/');
//           const isImage = file.type.startsWith('image/');
//           if (!isVideo && !isImage) continue;
//           const url = URL.createObjectURL(file);
//           files.push({
//             name: file.name,
//             url,
//             type: isVideo ? 'video' : 'image',
//             size: formatSize(file.size),
//           });
//         }
//         setMediaFiles(files);
//         setPicked(true);
//         setError(null);
//       } catch (err) {
//         if (err instanceof Error && err.name !== 'AbortError') {
//           setError('Could not access folder. Please try the manual file picker below.');
//         }
//       }
//     } else {
//       inputRef.current?.click();
//     }
//   }, []);

//   const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     const media: MediaFile[] = files
//       .filter((f) => f.type.startsWith('video/') || f.type.startsWith('image/'))
//       .map((f) => ({
//         name: f.name,
//         url: URL.createObjectURL(f),
//         type: f.type.startsWith('video/') ? 'video' : 'image',
//         size: formatSize(f.size),
//       }));
//     setMediaFiles(media);
//     setPicked(true);
//     setError(null);
//   }, []);

//   const saveFile = useCallback((file: MediaFile) => {
//     const a = document.createElement('a');
//     a.href = file.url;
//     a.download = file.name;
//     a.click();
//     setSaved((prev) => new Set(prev).add(file.name));
//   }, []);

//   const videoCount = mediaFiles.filter((f) => f.type === 'video').length;
//   const imageCount = mediaFiles.filter((f) => f.type === 'image').length;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
//         <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
//         <div>
//           <p className="text-sm font-semibold text-green-300">WhatsApp Status Saver</p>
//           <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
//             Save photos and videos from WhatsApp statuses before they disappear in 24 hours.
//           </p>
//         </div>
//       </div>

//       <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-3">
//         <div className="flex items-start gap-2">
//           <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
//           <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
//             <p className="font-medium text-sky-300">How to access WhatsApp statuses:</p>
//             <ol className="space-y-1.5 list-none">
//               <li className="flex gap-2"><span className="text-sky-400 font-bold">1.</span>Open WhatsApp and view the statuses you want to save</li>
//               <li className="flex gap-2"><span className="text-sky-400 font-bold">2.</span>On Android: Navigate to <span className="font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Internal Storage / WhatsApp / Media / .Statuses</span></li>
//               <li className="flex gap-2"><span className="text-sky-400 font-bold">3.</span>Click "Open Status Folder" below and select that folder</li>
//               <li className="flex gap-2"><span className="text-sky-400 font-bold">4.</span>Or use the file picker to manually select status files</li>
//             </ol>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <button
//           onClick={handleFilePick}
//           className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 transition-all active:scale-95"
//         >
//           <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
//             <FolderOpen className="w-5 h-5 text-green-400" />
//           </div>
//           <span className="text-xs font-semibold text-white text-center">Open Status Folder</span>
//         </button>
//         <button
//           onClick={() => inputRef.current?.click()}
//           className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all active:scale-95"
//         >
//           <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
//             <Film className="w-5 h-5 text-sky-400" />
//           </div>
//           <span className="text-xs font-semibold text-white text-center">Pick Files</span>
//         </button>
//       </div>

//       <input
//         ref={inputRef}
//         type="file"
//         multiple
//         accept="video/*,image/*"
//         className="hidden"
//         onChange={handleFileInput}
//       />

//       {error && (
//         <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
//           <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-xs text-red-300">{error}</p>
//         </div>
//       )}

//       {picked && mediaFiles.length === 0 && (
//         <div className="text-center py-8">
//           <MessageCircle className="w-10 h-10 text-slate-700 mx-auto mb-2" />
//           <p className="text-sm text-slate-400">No media files found in selected location</p>
//           <p className="text-xs text-slate-500 mt-1">Make sure you selected the correct folder</p>
//         </div>
//       )}

//       {mediaFiles.length > 0 && (
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <p className="text-sm font-semibold text-white">
//               {mediaFiles.length} Status{mediaFiles.length !== 1 ? 'es' : ''} Found
//             </p>
//             <div className="flex gap-2 text-xs text-slate-400">
//               {videoCount > 0 && (
//                 <span className="flex items-center gap-1">
//                   <Film className="w-3 h-3" /> {videoCount}
//                 </span>
//               )}
//               {imageCount > 0 && (
//                 <span className="flex items-center gap-1">
//                   <Image className="w-3 h-3" /> {imageCount}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             {mediaFiles.map((file, i) => (
//               <div key={i} className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 group">
//                 {file.type === 'video' ? (
//                   <video
//                     src={file.url}
//                     className="w-full h-28 object-cover"
//                     muted
//                     playsInline
//                     onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
//                     onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
//                   />
//                 ) : (
//                   <img src={file.url} alt={file.name} className="w-full h-28 object-cover" />
//                 )}
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <button
//                     onClick={() => saveFile(file)}
//                     className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
//                   >
//                     {saved.has(file.name) ? (
//                       <CheckCircle2 className="w-5 h-5 text-green-300" />
//                     ) : (
//                       <Download className="w-5 h-5 text-white" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="absolute top-1.5 right-1.5">
//                   {file.type === 'video' ? (
//                     <span className="p-1 rounded-md bg-black/60 text-white">
//                       <Film className="w-3 h-3" />
//                     </span>
//                   ) : (
//                     <span className="p-1 rounded-md bg-black/60 text-white">
//                       <Image className="w-3 h-3" />
//                     </span>
//                   )}
//                 </div>
//                 {saved.has(file.name) && (
//                   <div className="absolute top-1.5 left-1.5">
//                     <span className="p-1 rounded-md bg-green-500/80 text-white">
//                       <CheckCircle2 className="w-3 h-3" />
//                     </span>
//                   </div>
//                 )}
//                 <div className="p-2">
//                   <p className="text-[10px] text-slate-400 truncate">{file.size}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => mediaFiles.forEach(saveFile)}
//             className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-green-500/20"
//           >
//             <Download className="w-4 h-4" />
//             Save All ({mediaFiles.length})
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useCallback, useRef } from 'react';
import {
  MessageCircle, Download, Image, Film, AlertCircle,
  CheckCircle2, Info, Smartphone, RefreshCw, FolderOpen,
  Shield, X, Play
} from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  type: 'video' | 'image';
  size: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isAndroid = /android/i.test(navigator.userAgent);

type Step = 'guide' | 'permission' | 'picker' | 'results';

export default function WhatsAppSaver() {
  const [step, setStep] = useState<Step>('guide');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: File[]) => {
    setMediaFiles(prev => { prev.forEach(f => URL.revokeObjectURL(f.url)); return []; });

    const media: MediaFile[] = files
      .filter(f => f.type.startsWith('video/') || f.type.startsWith('image/'))
      .sort((a, b) => b.lastModified - a.lastModified)
      .map(f => ({
        name: f.name,
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video/') ? 'video' : 'image',
        size: formatSize(f.size),
      }));

    setSaved(new Set());
    setError(null);
    setLoading(false);

    if (media.length === 0) {
      setError('No media files found. Make sure you selected the correct files.');
      return;
    }

    setMediaFiles(media);
    setStep('results');
  }, []);

  const handlePermissionAllow = useCallback(() => {
    setPermissionGranted(true);
    setStep('picker');
  }, []);

  const handlePermissionDeny = useCallback(() => {
    setStep('guide');
  }, []);

  const handleFilePick = useCallback(() => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setLoading(true);
    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  const saveFile = useCallback((file: MediaFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSaved(prev => new Set(prev).add(file.name));
  }, []);

  const saveAll = useCallback(() => {
    mediaFiles.forEach((f, i) => setTimeout(() => saveFile(f), i * 400));
  }, [mediaFiles, saveFile]);

  const reset = useCallback(() => {
    setMediaFiles(prev => { prev.forEach(f => URL.revokeObjectURL(f.url)); return []; });
    setSaved(new Set());
    setError(null);
    setStep('guide');
    setPermissionGranted(false);
  }, []);

  const videoCount = mediaFiles.filter(f => f.type === 'video').length;
  const imageCount = mediaFiles.filter(f => f.type === 'image').length;

  // ── Step 1: Guide ────────────────────────────────────────────────────
  if (step === 'guide') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 overflow-hidden">
          <div className="flex items-center gap-2.5 p-4 border-b border-slate-700/40">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Before you start</p>
              <p className="text-[11px] text-slate-400">Follow these steps on your Android phone</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">1</div>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">View statuses in WhatsApp</p>
                <p className="text-xs text-slate-400 leading-relaxed">Open WhatsApp → Status tab → tap each status you want to save. This copies them to your device storage.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">2</div>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">Open your Files app → navigate to:</p>
                <code className="block bg-slate-900/80 text-green-300 text-[11px] px-3 py-2 rounded-lg leading-relaxed border border-slate-700/50">
                  Internal Storage / Android / media /{'\n'}
                  com.whatsapp / WhatsApp / Media / .Statuses
                </code>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enable <span className="text-white">"Show hidden files"</span> in your file manager settings if you can't see <code className="bg-slate-800 px-1 rounded text-[11px]">.Statuses</code>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">3</div>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">Copy files to Downloads</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select all files in <code className="bg-slate-800 px-1 rounded text-[11px]">.Statuses</code> → Copy → paste into your <span className="text-white">Downloads</span> folder.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">4</div>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">Come back here and tap "Select Files"</p>
                <p className="text-xs text-slate-400 leading-relaxed">Pick the files from Downloads — we'll show them here for you to save.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why this limitation exists */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/15">
          <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-sky-300 font-medium mb-0.5">Why can't the app open the folder directly?</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Android browsers can't access hidden folders like <code className="bg-slate-800 px-1 rounded">.Statuses</code> for security reasons. Only native apps installed from the Play Store can do this.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep('permission')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
        >
          <FolderOpen className="w-4 h-4" />
          I've copied my files — Continue
        </button>
      </div>
    );
  }

  // ── Step 2: Permission ───────────────────────────────────────────────
  if (step === 'permission') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 overflow-hidden">
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-1">Allow file access?</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                VidSave needs permission to read the files you select. Files are processed locally on your device — nothing is uploaded to any server.
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-900/50 rounded-xl p-3.5 border border-slate-700/30">
              {[
                { icon: '✓', text: 'Files stay on your device', color: 'text-green-400' },
                { icon: '✓', text: 'No upload or server processing', color: 'text-green-400' },
                { icon: '✓', text: 'Only reads files you manually select', color: 'text-green-400' },
                { icon: '✗', text: 'Cannot access other apps or folders', color: 'text-slate-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold ${item.color}`}>{item.icon}</span>
                  <span className="text-xs text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handlePermissionDeny}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-all active:scale-95"
              >
                Don't Allow
              </button>
              <button
                onClick={handlePermissionAllow}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-green-500/20"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Picker ───────────────────────────────────────────────────
  if (step === 'picker') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/15 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-1">Select your status files</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick the files you copied to your <span className="text-white font-medium">Downloads</span> folder. You can select multiple files at once.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleFilePick}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-lg shadow-sky-500/20"
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading files...</>
              : <><FolderOpen className="w-4 h-4" /> Open File Picker</>
            }
          </button>

          <button
            onClick={() => setStep('guide')}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            ← Back to guide
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    );
  }

  // ── Step 4: Results ──────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {mediaFiles.length} status{mediaFiles.length !== 1 ? 'es' : ''} found
          </p>
          <div className="flex gap-3 mt-0.5">
            {videoCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Film className="w-3 h-3" /> {videoCount} video{videoCount !== 1 ? 's' : ''}
              </span>
            )}
            {imageCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Image className="w-3 h-3" /> {imageCount} photo{imageCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('picker')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Add more
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {mediaFiles.map((file, i) => {
          const isSaved = saved.has(file.name);
          return (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden bg-slate-800 border transition-all ${
                isSaved ? 'border-green-500/40' : 'border-slate-700/50'
              }`}
            >
              <div className="relative cursor-pointer" onClick={() => setPreview(file)}>
                {file.type === 'video' ? (
                  <video
                    src={file.url}
                    className="w-full h-32 object-cover"
                    muted playsInline preload="metadata"
                  />
                ) : (
                  <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">
                    {file.type === 'video' ? <Film className="w-2.5 h-2.5" /> : <Image className="w-2.5 h-2.5" />}
                    {file.type === 'video' ? 'VID' : 'IMG'}
                  </span>
                </div>

                {/* Saved badge */}
                {isSaved && (
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-500/80 text-white text-[10px] font-medium">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Saved
                    </span>
                  </div>
                )}

                {/* Video play icon */}
                {file.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2">
                <span className="text-[10px] text-slate-500 truncate flex-1">{file.size}</span>
                <button
                  onClick={() => saveFile(file)}
                  className={`ml-2 p-1.5 rounded-lg transition-all active:scale-90 ${
                    isSaved
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-400'
                  }`}
                >
                  {isSaved
                    ? <CheckCircle2 className="w-3.5 h-3.5" />
                    : <Download className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save all */}
      {mediaFiles.some(f => !saved.has(f.name)) && (
        <button
          onClick={saveAll}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
        >
          <Download className="w-4 h-4" />
          Save All ({mediaFiles.filter(f => !saved.has(f.name)).length} remaining)
        </button>
      )}

      {mediaFiles.length > 0 && mediaFiles.every(f => saved.has(f.name)) && (
        <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">All statuses saved!</span>
        </div>
      )}

      {/* Full screen preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {preview.type === 'video' ? (
              <video
                src={preview.url}
                controls autoPlay
                className="w-full rounded-2xl max-h-[70vh] object-contain"
              />
            ) : (
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full rounded-2xl max-h-[70vh] object-contain"
              />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => saveFile(preview)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all active:scale-95"
              >
                {saved.has(preview.name)
                  ? <><CheckCircle2 className="w-4 h-4" /> Saved</>
                  : <><Download className="w-4 h-4" /> Save to device</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/*,image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}