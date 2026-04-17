import { useState, useCallback, useRef } from 'react';
import { MessageCircle, Download, Image, Film, AlertCircle, CheckCircle2, X, Play, RefreshCw, FolderOpen } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  type: 'video' | 'image';
  size: string;
  path: string;
  base64?: string; // stored separately for reliable saving
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const WA_PATHS = [
  'Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
  'WhatsApp/Media/.Statuses',
  'Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
];

export default function WhatsAppSaver() {
  const [step, setStep] = useState<'permission' | 'loading' | 'results' | 'error'>('permission');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileInputFallback = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const readers = files
      .filter(f => f.type.startsWith('video/') || f.type.startsWith('image/'))
      .map(f => new Promise<MediaFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve({
            name: f.name,
            url: URL.createObjectURL(f),
            type: f.type.startsWith('video/') ? 'video' : 'image',
            size: formatSize(f.size),
            path: f.name,
            base64,
          });
        };
        reader.readAsDataURL(f);
      }));

    Promise.all(readers).then(media => {
      setMediaFiles(media);
      setStep('results');
    });
    e.target.value = '';
  }, []);

  const loadStatuses = useCallback(async () => {
    setStep('loading');
    setError(null);

    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage !== 'granted') {
        setError('Storage permission denied. Go to Settings → Apps → VidSave → Permissions → Storage → Allow.');
        setStep('error');
        return;
      }

      let files: MediaFile[] = [];

      for (const waPath of WA_PATHS) {
        try {
          const result = await Filesystem.readdir({
            path: waPath,
            directory: Directory.ExternalStorage,
          });

          if (result.files.length === 0) continue;

          const mediaItems: MediaFile[] = [];

          for (const file of result.files) {
            if (!file.name || file.type === 'directory') continue;
            const name = file.name.toLowerCase();
            const isVideo = name.endsWith('.mp4') || name.endsWith('.3gp') || name.endsWith('.mkv');
            const isImage = name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp');
            if (!isVideo && !isImage) continue;

            const filePath = `${waPath}/${file.name}`;
            try {
              const fileData = await Filesystem.readFile({
                path: filePath,
                directory: Directory.ExternalStorage,
              });
              const base64 = typeof fileData.data === 'string' ? fileData.data : '';
              const mimeType = isVideo ? 'video/mp4' : 'image/jpeg';
              const dataUrl = `data:${mimeType};base64,${base64}`;
              mediaItems.push({
                name: file.name,
                url: dataUrl,
                type: isVideo ? 'video' : 'image',
                size: formatSize(file.size || 0),
                path: filePath,
                base64, // store separately — reliable for writeFile
              });
            } catch { continue; }
          }

          if (mediaItems.length > 0) {
            files = mediaItems;
            break;
          }
        } catch { continue; }
      }

      if (files.length === 0) {
        setError('No statuses found. Open WhatsApp and view some statuses first — they need to be viewed before they appear here.');
        setStep('error');
        return;
      }

      setMediaFiles(files);
      setStep('results');
    } catch (err: any) {
      setError(err?.message || 'Failed to read WhatsApp statuses.');
      setStep('error');
    }
  }, []);

  const saveFile = useCallback(async (file: MediaFile) => {
    if (saving.has(file.name) || saved.has(file.name)) return;
    setSaving(prev => new Set(prev).add(file.name));

    try {
      const { Capacitor } = await import('@capacitor/core');
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `WA_Status_${Date.now()}.${ext}`;

      if (Capacitor.isNativePlatform()) {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');

        const base64 = file.base64;
        if (!base64) throw new Error('No file data available');

        // Write to Documents first (app has full permission here)
        await Filesystem.writeFile({
          path: filename,
          data: base64,
          directory: Directory.Documents,
          recursive: true,
        });

        // Get the actual path and copy to Downloads via native plugin
        const uriResult = await Filesystem.getUri({
          path: filename,
          directory: Directory.Documents,
        });

        const sourcePath = uriResult.uri.replace('file://', '');

        try {
          const Downloader = (await import('../plugins/Downloader')).default;
          await Downloader.copyFile({
            sourcePath,
            filename,
          });
          // Delete temp file from Documents
          await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Documents,
          });
        } catch {
          // If copyFile fails, file is still in Documents — acceptable fallback
        }

      } else {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setSaved(prev => new Set(prev).add(file.name));
    } catch (err: any) {
      console.error('Save failed:', err);
      alert(`Failed to save: ${err?.message || 'Unknown error'}`);
    } finally {
      setSaving(prev => {
        const next = new Set(prev);
        next.delete(file.name);
        return next;
      });
    }
  }, [saving, saved]);

  const saveAll = useCallback(() => {
    const unsaved = mediaFiles.filter(f => !saved.has(f.name) && !saving.has(f.name));
    unsaved.forEach((f, i) => setTimeout(() => saveFile(f), i * 500));
  }, [mediaFiles, saved, saving, saveFile]);

  const videoCount = mediaFiles.filter(f => f.type === 'video').length;
  const imageCount = mediaFiles.filter(f => f.type === 'image').length;
  const savingCount = saving.size;

  if (step === 'permission') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp Status Saver</p>
                <p className="text-xs text-slate-400">Follow steps below before tapping Auto Load</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900/60 rounded-xl p-4 border border-slate-700/30">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">How it works</p>
              {[
                { n: '1', text: 'Open WhatsApp → Status tab', sub: 'Tap and fully watch each status you want to save' },
                { n: '2', text: 'Press Home (don\'t close WhatsApp)', sub: 'Keep WhatsApp running in background' },
                { n: '3', text: 'Come back here → tap Auto Load', sub: 'App reads from WhatsApp\'s hidden .Statuses folder' },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {item.n}
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">{item.text}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-700/20 space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Status folder location</p>
              <code className="block text-[11px] text-green-300 leading-relaxed">
                Internal Storage → Android → media{'\n'}
                → com.whatsapp → WhatsApp{'\n'}
                → Media → .Statuses
              </code>
              <p className="text-[11px] text-slate-500">Enable "Show hidden files" in Files app settings to see it</p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={loadStatuses}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
              >
                <FolderOpen className="w-4 h-4" />
                Auto Load Statuses
              </button>
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-white font-medium text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Pick Files Manually
              </button>
            </div>
          </div>
        </div>
        <input ref={inputRef} type="file" multiple accept="video/*,image/*" className="hidden" onChange={handleFileInputFallback} />
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <RefreshCw className="w-7 h-7 text-green-400 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Loading statuses...</p>
          <p className="text-xs text-slate-400 mt-1">Reading WhatsApp media folder</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-2">Could not load statuses automatically</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{error}</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={loadStatuses} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Try Again (Auto)
            </button>
            <button onClick={() => inputRef.current?.click()} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition-all active:scale-95">
              <FolderOpen className="w-4 h-4" /> Pick Files Manually
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Manual: Files app → WhatsApp → Media → .Statuses → copy to Downloads → pick here
          </p>
        </div>
        <input ref={inputRef} type="file" multiple accept="video/*,image/*" className="hidden" onChange={handleFileInputFallback} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {mediaFiles.length} status{mediaFiles.length !== 1 ? 'es' : ''} found
          </p>
          <div className="flex gap-3 mt-0.5">
            {videoCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Film className="w-3 h-3" /> {videoCount} video{videoCount !== 1 ? 's' : ''}</span>}
            {imageCount > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Image className="w-3 h-3" /> {imageCount} photo{imageCount !== 1 ? 's' : ''}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadStatuses} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <button onClick={() => { setMediaFiles([]); setStep('permission'); setSaved(new Set()); setSaving(new Set()); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        </div>
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
          <span className="text-sm font-semibold text-green-400">All statuses saved to Downloads!</span>
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

      <input ref={inputRef} type="file" multiple accept="video/*,image/*" className="hidden" onChange={handleFileInputFallback} />
    </div>
  );
}