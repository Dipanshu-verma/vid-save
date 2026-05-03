// import { useState, useCallback, useRef } from 'react';
// import { Download, Image, Film, CheckCircle2, X, Play, RefreshCw, FolderOpen, Info } from 'lucide-react';
// import { useToast } from './Toast';
// import AdMob from '../plugins/AdMob';
//
// interface MediaFile {
//   name: string;
//   url: string;
//   type: 'video' | 'image';
//   size: string;
//   base64?: string;
// }
//
// function formatSize(bytes: number): string {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// }
//
// export default function WhatsAppSaver() {
//   const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
// const { showError, showSuccess } = useToast();
//   const [saved, setSaved] = useState<Set<string>>(new Set());
//   const [saving, setSaving] = useState<Set<string>>(new Set());
//   const [preview, setPreview] = useState<MediaFile | null>(null);
//   const [picked, setPicked] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//
//   const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     if (files.length === 0) return;
//
//     const readers = files
//       .filter(f => f.type.startsWith('video/') || f.type.startsWith('image/'))
//       .map(f => new Promise<MediaFile>((resolve) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const result = reader.result as string;
//           const base64 = result.split(',')[1];
//           resolve({
//             name: f.name,
//             url: URL.createObjectURL(f),
//             type: f.type.startsWith('video/') ? 'video' : 'image',
//             size: formatSize(f.size),
//             base64,
//           });
//         };
//         reader.readAsDataURL(f);
//       }));
//
//     Promise.all(readers).then(media => {
//       setMediaFiles(media);
//       setSaved(new Set());
//       setSaving(new Set());
//       setPicked(true);
//     });
//     e.target.value = '';
//   }, []);
//
//   const saveFile = useCallback(async (file: MediaFile) => {
//     if (saving.has(file.name) || saved.has(file.name)) return;
//     setSaving(prev => new Set(prev).add(file.name));
//
//     try {
//       const { Capacitor } = await import('@capacitor/core');
//       const ext = file.name.split('.').pop() || 'jpg';
//       const filename = `WA_Status_${Date.now()}.${ext}`;
//
//       if (Capacitor.isNativePlatform() && file.base64) {
//         const { Filesystem, Directory } = await import('@capacitor/filesystem');
//
//         await Filesystem.writeFile({
//           path: filename,
//           data: file.base64,
//           directory: Directory.Documents,
//           recursive: true,
//         });
//
//         try {
//           const uriResult = await Filesystem.getUri({
//             path: filename,
//             directory: Directory.Documents,
//           });
//           const sourcePath = uriResult.uri.replace('file://', '');
//           const Downloader = (await import('../plugins/Downloader')).default;
//           await Downloader.copyFile({ sourcePath, filename });
//           await Filesystem.deleteFile({ path: filename, directory: Directory.Documents });
//         } catch {}
//
//       } else {
//         const a = document.createElement('a');
//         a.href = file.url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       }
//
//       setSaved(prev => new Set(prev).add(file.name));
//       showSuccess('Status saved to Downloads!');
//       try {
//         await AdMob.loadInterstitial();
//         await AdMob.showInterstitial();
//       } catch {}
//     } catch (err: any) {
//       console.error('Save failed:', err);
// showError(`Failed to save: ${err?.message || 'Unknown error'}`);
//     } finally {
//       setSaving(prev => {
//         const next = new Set(prev);
//         next.delete(file.name);
//         return next;
//       });
//     }
//   }, [saving, saved]);
//
//   const saveAll = useCallback(() => {
//     const unsaved = mediaFiles.filter(f => !saved.has(f.name) && !saving.has(f.name));
//     unsaved.forEach((f, i) => setTimeout(() => saveFile(f), i * 500));
//   }, [mediaFiles, saved, saving, saveFile]);
//
//   const videoCount = mediaFiles.filter(f => f.type === 'video').length;
//   const imageCount = mediaFiles.filter(f => f.type === 'image').length;
//   const savingCount = saving.size;
//
//   return (
//     <div className="space-y-4">
//       {/* Instructions */}
//       <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-3">
//         <div className="flex items-center gap-2">
//           <Info className="w-4 h-4 text-green-400 flex-shrink-0" />
//           <p className="text-xs font-semibold text-green-300">How to save WhatsApp statuses</p>
//         </div>
//         <div className="space-y-2">
//           {[
//              { n: '1', text: 'Open WhatsApp → view the statuses you want to save' },
//              { n: '2', text: 'Tap Select Files → Files picker will open' },
//              { n: '3', text: 'Tap 3 dots (top right) → select "Browse..."' },
//              { n: '4', text: 'Go to Internal Storage → Android → media → com.whatsapp → WhatsApp → Media → .Statuses' },
//              { n: '5', text: 'Enable "Show hidden files" if .Statuses is not visible' },
//              { n: '6', text: 'Select files → Copy → Paste into Downloads folder' },
//              { n: '7', text: 'Come back → tap Select Files → pick from Downloads' },
//            ].map(item => (
//             <div key={item.n} className="flex gap-2.5">
//               <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
//                 {item.n}
//               </span>
//               <p className="text-[11px] text-slate-400 leading-relaxed">{item.text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//
//       {/* Pick button */}
//       <button
//         onClick={() => inputRef.current?.click()}
//         className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
//       >
//         <FolderOpen className="w-4 h-4" />
//         Select Status Files
//       </button>
//
//       <input
//         ref={inputRef}
//         type="file"
//         multiple
//         accept="video/*,image/*"
//         className="hidden"
//         onChange={handleFileInput}
//       />
//
//       {picked && mediaFiles.length === 0 && (
//         <div className="text-center py-8">
//           <p className="text-sm text-slate-400">No media files found in selection</p>
//         </div>
//       )}
//
//       {mediaFiles.length > 0 && (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-white">
//                 {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
//               </p>
//               <div className="flex gap-3 mt-0.5">
//                 {videoCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Film className="w-3 h-3" /> {videoCount} video{videoCount !== 1 ? 's' : ''}</span>}
//                 {imageCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Image className="w-3 h-3" /> {imageCount} photo{imageCount !== 1 ? 's' : ''}</span>}
//               </div>
//             </div>
//             <button
//               onClick={() => { setMediaFiles([]); setSaved(new Set()); setSaving(new Set()); setPicked(false); }}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
//             >
//               <X className="w-3 h-3" /> Clear
//             </button>
//           </div>
//
//           <div className="grid grid-cols-2 gap-2.5">
//             {mediaFiles.map((file, i) => {
//               const isSaved = saved.has(file.name);
//               const isSaving = saving.has(file.name);
//               return (
//                 <div key={i} className={`relative rounded-2xl overflow-hidden bg-slate-800 border transition-all ${isSaved ? 'border-green-500/40' : 'border-slate-700/50'}`}>
//                   <div className="relative cursor-pointer" onClick={() => setPreview(file)}>
//                     {file.type === 'video'
//                       ? <video src={file.url} className="w-full h-32 object-cover" muted playsInline preload="metadata" />
//                       : <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
//                     }
//                     {file.type === 'video' && (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
//                           <Play className="w-4 h-4 text-white fill-white ml-0.5" />
//                         </div>
//                       </div>
//                     )}
//                     {isSaved && !isSaving && (
//                       <div className="absolute top-2 right-2">
//                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-500/80 text-white text-[10px] font-medium">
//                           <CheckCircle2 className="w-2.5 h-2.5" /> Saved
//                         </span>
//                       </div>
//                     )}
//                     {isSaving && (
//                       <div className="absolute top-2 right-2">
//                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/80 text-white text-[10px] font-medium">
//                           <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex items-center justify-between px-2.5 py-2">
//                     <span className="text-[10px] text-slate-500 truncate flex-1">{file.size}</span>
//                     <button
//                       onClick={() => saveFile(file)}
//                       disabled={isSaving || isSaved}
//                       className={`ml-2 p-1.5 rounded-lg transition-all active:scale-90 disabled:opacity-60 ${
//                         isSaved ? 'bg-green-500/15 text-green-400'
//                         : isSaving ? 'bg-yellow-500/15 text-yellow-400'
//                         : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-400'
//                       }`}
//                     >
//                       {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" />
//                         : isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
//                         : <Download className="w-3.5 h-3.5" />
//                       }
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//
//           {mediaFiles.some(f => !saved.has(f.name)) && (
//             <button
//               onClick={saveAll}
//               disabled={savingCount > 0}
//               className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all shadow-lg ${
//                 savingCount > 0
//                   ? 'bg-yellow-500 shadow-yellow-500/20 cursor-not-allowed'
//                   : 'bg-green-500 hover:bg-green-400 active:scale-[0.98] shadow-green-500/20'
//               }`}
//             >
//               {savingCount > 0
//                 ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving {savingCount} file{savingCount !== 1 ? 's' : ''}...</>
//                 : <><Download className="w-4 h-4" /> Save All ({mediaFiles.filter(f => !saved.has(f.name)).length} remaining)</>
//               }
//             </button>
//           )}
//
//           {mediaFiles.length > 0 && mediaFiles.every(f => saved.has(f.name)) && (
//             <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500/10 border border-green-500/20">
//               <CheckCircle2 className="w-4 h-4 text-green-400" />
//               <span className="text-sm font-semibold text-green-400">All statuses saved to Downloads!</span>
//             </div>
//           )}
//         </div>
//       )}
//
//       {preview && (
//         <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
//           <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
//             <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white">
//               <X className="w-5 h-5" />
//             </button>
//             {preview.type === 'video'
//               ? <video src={preview.url} controls autoPlay className="w-full rounded-2xl max-h-[70vh] object-contain" />
//               : <img src={preview.url} alt={preview.name} className="w-full rounded-2xl max-h-[70vh] object-contain" />
//             }
//             <button
//               onClick={() => saveFile(preview)}
//               disabled={saving.has(preview.name) || saved.has(preview.name)}
//               className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60"
//             >
//               {saved.has(preview.name)
//                 ? <><CheckCircle2 className="w-4 h-4" /> Saved</>
//                 : saving.has(preview.name)
//                   ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
//                   : <><Download className="w-4 h-4" /> Save to Downloads</>
//               }
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useCallback, useRef } from 'react';
import { Download, Image, Film, CheckCircle2, X, Play, RefreshCw, FolderOpen, Info } from 'lucide-react';
import { useToast } from './Toast';
import AdMob from '../plugins/AdMob';

interface MediaFile {
  name: string;
  url: string;
  type: 'video' | 'image';
  size: string;
  base64?: string;
}

interface WhatsAppSaverProps {
  isNative?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Browser steps — uses File System Access API (opens real file browser)
const BROWSER_STEPS = [
  { n: '1', text: 'Open WhatsApp → view the statuses you want to save' },
  { n: '2', text: 'Open your phone\'s Files app → go to Internal Storage → Android → media → com.whatsapp → WhatsApp → Media → .Statuses' },
  { n: '3', text: 'Enable "Show hidden files" if .Statuses folder is not visible' },
  { n: '4', text: 'Select the status files → Copy → Paste into your Downloads folder' },
  { n: '5', text: 'Come back here → tap "Select Status Files" → it will open your file browser directly' },
  { n: '6', text: 'Navigate to Downloads folder → select your files' },
  { n: '7', text: 'Tap download button on each file to save it' },
];

// Native APK steps — direct .Statuses access
const NATIVE_STEPS = [
  { n: '1', text: 'Open WhatsApp → view the statuses you want to save' },
  { n: '2', text: 'Tap Select Files → Files picker will open' },
  { n: '3', text: 'Tap 3 dots (top right) → select "Browse..."' },
  { n: '4', text: 'Go to Internal Storage → Android → media → com.whatsapp → WhatsApp → Media → .Statuses' },
  { n: '5', text: 'Enable "Show hidden files" if .Statuses is not visible' },
  { n: '6', text: 'Select files → Copy → Paste into Downloads folder' },
  { n: '7', text: 'Come back → tap Select Files → pick from Downloads' },
];

export default function WhatsAppSaver({ isNative = false }: WhatsAppSaverProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const { showError, showSuccess } = useToast();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [picked, setPicked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const steps = isNative ? NATIVE_STEPS : BROWSER_STEPS;

  // Convert File[] → MediaFile[] (shared by both picker paths)
  const processFiles = useCallback((files: File[]) => {
    const filtered = files.filter(f =>
      f.type.startsWith('video/') || f.type.startsWith('image/')
    );
    if (filtered.length === 0) {
      setPicked(true);
      setMediaFiles([]);
      return;
    }

    const readers = filtered.map(f => new Promise<MediaFile>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({
          name: f.name,
          url: URL.createObjectURL(f),
          type: f.type.startsWith('video/') ? 'video' : 'image',
          size: formatSize(f.size),
          base64,
        });
      };
      reader.readAsDataURL(f);
    }));

    Promise.all(readers).then(media => {
      setMediaFiles(media);
      setSaved(new Set());
      setSaving(new Set());
      setPicked(true);
    });
  }, []);

  // Main pick handler — uses File System Access API on browser (opens real file manager)
  // Falls back to regular <input> if API not supported
  const handlePickFiles = useCallback(async () => {
    const supportsFilePicker =
      typeof (window as any).showOpenFilePicker === 'function';

    // Use File System Access API on web — opens actual file browser not Google Photos
    if (!isNative && supportsFilePicker) {
      try {
        const fileHandles = await (window as any).showOpenFilePicker({
          multiple: true,
          // Start in Downloads folder — exactly where user copied their statuses
          startIn: 'downloads',
          excludeAcceptAllOption: false,
          types: [
            {
              description: 'Videos and Images',
              accept: {
                'video/mp4': ['.mp4'],
                'video/3gpp': ['.3gp'],
                'video/quicktime': ['.mov'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'image/webp': ['.webp'],
              },
            },
          ],
        });

        const files: File[] = await Promise.all(
          fileHandles.map((handle: any) => handle.getFile())
        );
        processFiles(files);
        return;
      } catch (err: any) {
        // User cancelled — do nothing
        if (err?.name === 'AbortError') return;
        // API failed (older Chrome) — fall through to input fallback
        console.warn('[FilePicker] showOpenFilePicker failed, using input fallback:', err?.message);
      }
    }

    // Fallback for native APK and older browsers
    inputRef.current?.click();
  }, [isNative, processFiles]);

  // Fallback for regular <input type="file">
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  const saveFile = useCallback(async (file: MediaFile) => {
    if (saving.has(file.name) || saved.has(file.name)) return;
    setSaving(prev => new Set(prev).add(file.name));

    try {
      const { Capacitor } = await import('@capacitor/core');
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `WA_Status_${Date.now()}.${ext}`;

      if (Capacitor.isNativePlatform() && file.base64) {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');

        await Filesystem.writeFile({
          path: filename,
          data: file.base64,
          directory: Directory.Documents,
          recursive: true,
        });

        try {
          const uriResult = await Filesystem.getUri({
            path: filename,
            directory: Directory.Documents,
          });
          const sourcePath = uriResult.uri.replace('file://', '');
          const Downloader = (await import('../plugins/Downloader')).default;
          await Downloader.copyFile({ sourcePath, filename });
          await Filesystem.deleteFile({ path: filename, directory: Directory.Documents });
          showSuccess('Status saved to Downloads!');
        } catch (copyErr: any) {
          console.warn('copyFile to Downloads failed:', copyErr?.message);
          showSuccess('Status saved to Documents folder!');
        }

        // Show interstitial after save (native only)
        try {
          await AdMob.loadInterstitial();
          await AdMob.showInterstitial();
        } catch {}

      } else {
        // Web browser — try File System Access API save first (best UX)
        // Falls back to anchor download
        const supportsFileSave =
          typeof (window as any).showSaveFilePicker === 'function';

        if (supportsFileSave) {
          try {
            const ext2 = file.type === 'video' ? 'mp4' : 'jpg';
            const fileHandle = await (window as any).showSaveFilePicker({
              suggestedName: filename,
              types: [
                {
                  description: file.type === 'video' ? 'Video file' : 'Image file',
                  accept: file.type === 'video'
                    ? { 'video/mp4': ['.mp4'] }
                    : { 'image/jpeg': ['.jpg'] },
                },
              ],
            });
            const writable = await fileHandle.createWritable();
            const response = await fetch(file.url);
            const blob = await response.blob();
            await writable.write(blob);
            await writable.close();
            showSuccess('Status saved!');
          } catch (saveErr: any) {
            if (saveErr?.name === 'AbortError') {
              setSaving(prev => { const n = new Set(prev); n.delete(file.name); return n; });
              return;
            }
            // Fall back to anchor download
            triggerAnchorDownload(file.url, filename);
            showSuccess('Status downloaded!');
          }
        } else {
          // Anchor download fallback
          triggerAnchorDownload(file.url, filename);
          showSuccess('Status downloaded!');
        }
      }

      setSaved(prev => new Set(prev).add(file.name));

    } catch (err: any) {
      console.error('Save failed:', err);
      showError(`Failed to save: ${err?.message || 'Unknown error'}`);
    } finally {
      setSaving(prev => {
        const next = new Set(prev);
        next.delete(file.name);
        return next;
      });
    }
  }, [saving, saved, showSuccess, showError]);

  const saveAll = useCallback(() => {
    const unsaved = mediaFiles.filter(f => !saved.has(f.name) && !saving.has(f.name));
    unsaved.forEach((f, i) => setTimeout(() => saveFile(f), i * 500));
  }, [mediaFiles, saved, saving, saveFile]);

  const videoCount = mediaFiles.filter(f => f.type === 'video').length;
  const imageCount = mediaFiles.filter(f => f.type === 'image').length;
  const savingCount = saving.size;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-green-300">
            {isNative ? 'How to save WhatsApp statuses' : 'How to save WhatsApp statuses on browser'}
          </p>
        </div>
        <div className="space-y-2">
          {steps.map(item => (
            <div key={item.n} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {item.n}
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pick button */}
      <button
        onClick={handlePickFiles}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
      >
        <FolderOpen className="w-4 h-4" />
        Select Status Files
      </button>

      {/* Hidden fallback input for native + older browsers */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/mp4,video/3gpp,video/quicktime,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
      />

      {picked && mediaFiles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">No media files found in selection</p>
        </div>
      )}

      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-3 mt-0.5">
                {videoCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Film className="w-3 h-3" /> {videoCount} video{videoCount !== 1 ? 's' : ''}</span>}
                {imageCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Image className="w-3 h-3" /> {imageCount} photo{imageCount !== 1 ? 's' : ''}</span>}
              </div>
            </div>
            <button
              onClick={() => { setMediaFiles([]); setSaved(new Set()); setSaving(new Set()); setPicked(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {mediaFiles.map((file, i) => {
              const isSaved = saved.has(file.name);
              const isSaving = saving.has(file.name);
              return (
                <div key={i} className={`relative rounded-2xl overflow-hidden bg-slate-800 border transition-all ${isSaved ? 'border-green-500/40' : 'border-slate-700/50'}`}>
                  <div className="relative cursor-pointer" onClick={() => setPreview(file)}>
                    {file.type === 'video'
                      ? <video src={file.url} className="w-full h-32 object-cover" muted playsInline preload="metadata" />
                      : <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
                    }
                    {file.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {isSaved && !isSaving && (
                      <div className="absolute top-2 right-2">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-500/80 text-white text-[10px] font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Saved
                        </span>
                      </div>
                    )}
                    {isSaving && (
                      <div className="absolute top-2 right-2">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/80 text-white text-[10px] font-medium">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <span className="text-[10px] text-slate-500 truncate flex-1">{file.size}</span>
                    <button
                      onClick={() => saveFile(file)}
                      disabled={isSaving || isSaved}
                      className={`ml-2 p-1.5 rounded-lg transition-all active:scale-90 disabled:opacity-60 ${
                        isSaved ? 'bg-green-500/15 text-green-400'
                        : isSaving ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-400'
                      }`}
                    >
                      {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <Download className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {mediaFiles.some(f => !saved.has(f.name)) && (
            <button
              onClick={saveAll}
              disabled={savingCount > 0}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all shadow-lg ${
                savingCount > 0
                  ? 'bg-yellow-500 shadow-yellow-500/20 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-400 active:scale-[0.98] shadow-green-500/20'
              }`}
            >
              {savingCount > 0
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving {savingCount} file{savingCount !== 1 ? 's' : ''}...</>
                : <><Download className="w-4 h-4" /> Save All ({mediaFiles.filter(f => !saved.has(f.name)).length} remaining)</>
              }
            </button>
          )}

          {mediaFiles.length > 0 && mediaFiles.every(f => saved.has(f.name)) && (
            <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">All statuses saved!</span>
            </div>
          )}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            {preview.type === 'video'
              ? <video src={preview.url} controls autoPlay className="w-full rounded-2xl max-h-[70vh] object-contain" />
              : <img src={preview.url} alt={preview.name} className="w-full rounded-2xl max-h-[70vh] object-contain" />
            }
            <button
              onClick={() => saveFile(preview)}
              disabled={saving.has(preview.name) || saved.has(preview.name)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60"
            >
              {saved.has(preview.name)
                ? <><CheckCircle2 className="w-4 h-4" /> Saved</>
                : saving.has(preview.name)
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><Download className="w-4 h-4" /> Save to Downloads</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper — anchor download fallback
function triggerAnchorDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}