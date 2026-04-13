import { useState, useCallback, useRef } from 'react';
import { MessageCircle, FolderOpen, Download, Image, Film, AlertCircle, CheckCircle2, Info } from 'lucide-react';

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

export default function WhatsAppSaver() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [picked, setPicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilePick = useCallback(async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as Window & typeof globalThis & {
          showDirectoryPicker: (opts?: { id?: string, mode?: string }) => Promise<FileSystemDirectoryHandle>
        }).showDirectoryPicker({ id: 'whatsapp-status', mode: 'read' });

        const files: MediaFile[] = [];
        for await (const entry of (dirHandle as unknown as AsyncIterable<FileSystemHandle>)) {
          if (entry.kind !== 'file') continue;
          const fileHandle = entry as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          const isVideo = file.type.startsWith('video/');
          const isImage = file.type.startsWith('image/');
          if (!isVideo && !isImage) continue;
          const url = URL.createObjectURL(file);
          files.push({
            name: file.name,
            url,
            type: isVideo ? 'video' : 'image',
            size: formatSize(file.size),
          });
        }
        setMediaFiles(files);
        setPicked(true);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Could not access folder. Please try the manual file picker below.');
        }
      }
    } else {
      inputRef.current?.click();
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const media: MediaFile[] = files
      .filter((f) => f.type.startsWith('video/') || f.type.startsWith('image/'))
      .map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video/') ? 'video' : 'image',
        size: formatSize(f.size),
      }));
    setMediaFiles(media);
    setPicked(true);
    setError(null);
  }, []);

  const saveFile = useCallback((file: MediaFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
    setSaved((prev) => new Set(prev).add(file.name));
  }, []);

  const videoCount = mediaFiles.filter((f) => f.type === 'video').length;
  const imageCount = mediaFiles.filter((f) => f.type === 'image').length;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
        <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-300">WhatsApp Status Saver</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Save photos and videos from WhatsApp statuses before they disappear in 24 hours.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p className="font-medium text-sky-300">How to access WhatsApp statuses:</p>
            <ol className="space-y-1.5 list-none">
              <li className="flex gap-2"><span className="text-sky-400 font-bold">1.</span>Open WhatsApp and view the statuses you want to save</li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold">2.</span>On Android: Navigate to <span className="font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Internal Storage / WhatsApp / Media / .Statuses</span></li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold">3.</span>Click "Open Status Folder" below and select that folder</li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold">4.</span>Or use the file picker to manually select status files</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleFilePick}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-xs font-semibold text-white text-center">Open Status Folder</span>
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Film className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-xs font-semibold text-white text-center">Pick Files</span>
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

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {picked && mediaFiles.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-10 h-10 text-slate-700 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No media files found in selected location</p>
          <p className="text-xs text-slate-500 mt-1">Make sure you selected the correct folder</p>
        </div>
      )}

      {mediaFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              {mediaFiles.length} Status{mediaFiles.length !== 1 ? 'es' : ''} Found
            </p>
            <div className="flex gap-2 text-xs text-slate-400">
              {videoCount > 0 && (
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3" /> {videoCount}
                </span>
              )}
              {imageCount > 0 && (
                <span className="flex items-center gap-1">
                  <Image className="w-3 h-3" /> {imageCount}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mediaFiles.map((file, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 group">
                {file.type === 'video' ? (
                  <video
                    src={file.url}
                    className="w-full h-28 object-cover"
                    muted
                    playsInline
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img src={file.url} alt={file.name} className="w-full h-28 object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => saveFile(file)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    {saved.has(file.name) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    ) : (
                      <Download className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  {file.type === 'video' ? (
                    <span className="p-1 rounded-md bg-black/60 text-white">
                      <Film className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-md bg-black/60 text-white">
                      <Image className="w-3 h-3" />
                    </span>
                  )}
                </div>
                {saved.has(file.name) && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="p-1 rounded-md bg-green-500/80 text-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[10px] text-slate-400 truncate">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => mediaFiles.forEach(saveFile)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            <Download className="w-4 h-4" />
            Save All ({mediaFiles.length})
          </button>
        </div>
      )}
    </div>
  );
}
