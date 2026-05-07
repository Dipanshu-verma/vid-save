    import { useState, useCallback, useEffect } from 'react';
import { Download, Image, Film, CheckCircle2, X, Play, RefreshCw, Info, FolderOpen, ArrowUpDown } from 'lucide-react';    import { useToast } from './Toast';
    import { Capacitor } from '@capacitor/core';
    import AdMob from '../plugins/AdMob';
    import { MONETAG_WHATSAPP_SAVE } from '../lib/constants';
    import { Browser } from '@capacitor/browser';

    interface StatusFile {
      uri: string;
      name: string;
      type: 'video' | 'image';
      size: number;
      path?: string;
      thumbnail?: string;
    }

    const STORAGE_KEY = 'wa_status_uri';
    const STORAGE_DIRECT_KEY = 'wa_status_direct'; // ← for direct access phones

    export default function WhatsAppSaver() {
    const [statusUri, setStatusUri] = useState<string | null>(() =>
      localStorage.getItem(STORAGE_KEY)
    );
      const [files, setFiles] = useState<StatusFile[]>([]);
      const [saved, setSaved] = useState<Set<string>>(new Set());
      const [saving, setSaving] = useState<Set<string>>(new Set());
      const [loading, setLoading] = useState(false);
      const { showError, showSuccess } = useToast();
    const [needsPermission, setNeedsPermission] = useState(false); // ← add here
    const [permissionGranted, setPermissionGranted] = useState(() =>
      !!(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_DIRECT_KEY))
    );
const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    //   const loadStatuses = useCallback(async (uri: string) => {
    //     setLoading(true);
    //     try {
    //       const Downloader = (await import('../plugins/Downloader')).default;
    //       const result = await Downloader.getStatuses({ uri });
    //       const parsed: StatusFile[] = JSON.parse(result.files);
    //       setFiles(parsed.reverse()); // newest first
    //     } catch (e: any) {
    //       showError('Failed to load statuses: ' + e.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   }, [showError]);

    const loadStatuses = useCallback(async (uri?: string) => {
      setLoading(true);
      try {
        const Downloader = (await import('../plugins/Downloader')).default;
        const isDirect = localStorage.getItem(STORAGE_DIRECT_KEY);

        if (isDirect || !uri) {
          const result = await Downloader.getStatusesDirect();
          const parsed: StatusFile[] = JSON.parse(result.files);
          setFiles(parsed.reverse());
        } else {
          const result = await Downloader.getStatuses({ uri });
          const parsed: StatusFile[] = JSON.parse(result.files);
          setFiles(parsed.reverse());
        }
      } catch (e: any) {
        showError('Failed to load statuses: ' + e.message);
      } finally {
        setLoading(false);
      }
    }, [showError]);

    const tryDirectAccess = useCallback(async () => {
      setLoading(true);
      try {
        const Downloader = (await import('../plugins/Downloader')).default;
        const { granted } = await Downloader.checkStoragePermission();

        if (!granted) {
          setLoading(false);
          setNeedsPermission(true);
          return;
        }

        // Permission granted — mark it
        setPermissionGranted(true);
        localStorage.setItem(STORAGE_DIRECT_KEY, 'true');

        const result = await Downloader.getStatusesDirect();
        const parsed: StatusFile[] = JSON.parse(result.files);
        setFiles(parsed.reverse());
        setStatusUri('direct');

      } catch (e) {
        // Even if scan fails, mark permission as granted
        setPermissionGranted(true);
        setStatusUri('direct');
      } finally {
        setLoading(false);
      }
    }, []);

      // Auto-load if permission already granted
    //   useEffect(() => {
    //     if (statusUri && Capacitor.isNativePlatform()) {
    //       loadStatuses(statusUri);
    //     }
    //   }, [statusUri, loadStatuses]);

    useEffect(() => {
      if (statusUri && Capacitor.isNativePlatform()) {
        loadStatuses(statusUri);
      }
    }, []);

    // const requestPermission = useCallback(async () => {
    //   try {
    //     const Downloader = (await import('../plugins/Downloader')).default;
    //     const { uri } = await Downloader.requestStatusPermission();
    //     localStorage.setItem(STORAGE_KEY, uri);
    //     setStatusUri(uri);
    //     showSuccess('Permission granted!');
    //     // Immediately load after permission
    //     await loadStatuses(uri);
    //   } catch (e: any) {
    //     showError('Permission denied. Please select the .Statuses folder.');
    //   }
    // }, [showError, showSuccess, loadStatuses]);

    const requestPermission = useCallback(async () => {
      try {
        const Downloader = (await import('../plugins/Downloader')).default;
        try {
          const { uri } = await Downloader.requestStatusPermission();
          localStorage.setItem(STORAGE_KEY, uri);
          localStorage.removeItem(STORAGE_DIRECT_KEY);
          setStatusUri(uri);
          setPermissionGranted(true);
          showSuccess('Permission granted!');
          await loadStatuses(uri);
        } catch {
          try {
            const result = await Downloader.getStatusesDirect();
            const parsed: StatusFile[] = JSON.parse(result.files);
            localStorage.setItem(STORAGE_DIRECT_KEY, 'true');
            setPermissionGranted(true);
            setStatusUri('direct');
            setFiles(parsed.reverse());
            showSuccess(`Found ${parsed.length} statuses!`);
          } catch (e: any) {
            showError(e.message || 'Could not access WhatsApp statuses');
          }
        }
      } catch {
        showError('Permission denied');
      }
    }, [showError, showSuccess, loadStatuses]);

    // Auto-load on mount
    // useEffect(() => {
    //   if (!Capacitor.isNativePlatform()) return;
    //
    //   const isDirect = localStorage.getItem(STORAGE_DIRECT_KEY);
    //   const uri = localStorage.getItem(STORAGE_KEY);
    //
    //   if (isDirect) {
    //     // Direct access phone — scan files directly
    //     import('../plugins/Downloader').then(({ default: Downloader }) => {
    //       Downloader.getStatusesDirect()
    //         .then(result => {
    //           const parsed: StatusFile[] = JSON.parse(result.files);
    //           setFiles(parsed.reverse());
    //         })
    //         .catch(() => {});
    //     });
    //   } else if (uri) {
    //     setStatusUri(uri);
    //     loadStatuses(uri);
    //   }
    // }, []);

    useEffect(() => {
      if (!Capacitor.isNativePlatform()) return;
      const isDirect = localStorage.getItem(STORAGE_DIRECT_KEY);
      const uri = localStorage.getItem(STORAGE_KEY);
      if (isDirect) {
        tryDirectAccess(); // ← use this instead of direct call
      } else if (uri) {
        setStatusUri(uri);
        loadStatuses(uri);
      } else {
        tryDirectAccess(); // ← try direct on first open too
      }
    }, []);

    // Listen for thumbnails loading in background
//     useEffect(() => {
//       if (!Capacitor.isNativePlatform() || files.length === 0) return;
//       let listener: { remove: () => void } | null = null;
//
//       import('../plugins/Downloader').then(({ default: Downloader }) => {
//         Downloader.addListener('statusThumbnail', (data: {
//           uri: string; thumbnail: string
//         }) => {
//           setFiles(prev => prev.map(f =>
//             f.uri === data.uri ? { ...f, thumbnail: data.thumbnail } : f
//           ));
//         }).then(l => { listener = l; });
//       });
//
//       return () => { listener?.remove(); };
//     }, [files.length]);

// FIND and REPLACE entire thumbnail listener useEffect:
useEffect(() => {
  if (!Capacitor.isNativePlatform() || files.length === 0) return;
  let listener: { remove: () => void } | null = null;

  import('../plugins/Downloader').then(({ default: Downloader }) => {
    Downloader.addListener('statusThumbnailBatch', (data: { batch: string }) => {
      try {
        const items: { uri: string; thumbnail: string }[] = JSON.parse(data.batch);
        setFiles(prev => prev.map(f => {
          const match = items.find(item => item.uri === f.uri);
          return match ? { ...f, thumbnail: match.thumbnail } : f;
        }));
      } catch {}
    }).then(l => { listener = l; });
  });

  return () => { listener?.remove(); };
}, [files.length]);

      const saveFile = useCallback(async (file: StatusFile) => {
        if (saving.has(file.uri) || saved.has(file.uri)) return;
        setSaving(prev => new Set(prev).add(file.uri));

        try {
          const Downloader = (await import('../plugins/Downloader')).default;
          const ext = file.type === 'video' ? 'mp4' : 'jpg';
          const filename = `WA_Status_${Date.now()}.${ext}`;
          await Downloader.saveStatusFile({ uri: file.uri, filename });

          setSaved(prev => new Set(prev).add(file.uri));
          showSuccess('Status saved to Downloads!');

          try {
            await AdMob.loadInterstitial();
            await AdMob.showInterstitial();
    //       } catch {
    //         try {
    //           await Browser.open({ url: MONETAG_WHATSAPP_SAVE });
    //         } catch {}
    //       }
    } catch {
      try {
        await AdMob.showMonatagInterstitial({ url: MONETAG_WHATSAPP_SAVE });
      } catch {}
    }
        } catch (e: any) {
          showError('Failed to save: ' + e.message);
        } finally {
          setSaving(prev => {
            const next = new Set(prev);
            next.delete(file.uri);
            return next;
          });
        }
      }, [saving, saved, showError, showSuccess]);

      const saveAll = useCallback(() => {
        const unsaved = files.filter(f => !saved.has(f.uri) && !saving.has(f.uri));
        unsaved.forEach((f, i) => setTimeout(() => saveFile(f), i * 500));
      }, [files, saved, saving, saveFile]);

      const videoCount = files.filter(f => f.type === 'video').length;
      const imageCount = files.filter(f => f.type === 'image').length;
    if (needsPermission) {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs font-semibold text-amber-300">
                Storage Permission Required
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To automatically load WhatsApp statuses, allow "All Files Access"
              in the next screen. This is a one-time setup.
            </p>
          </div>

          <button
            onClick={async () => {
              const Downloader = (await import('../plugins/Downloader')).default;
              await Downloader.requestAllFilesAccess();
              setNeedsPermission(false);
              setTimeout(() => tryDirectAccess(), 2000);
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            Allow All Files Access
          </button>

          <button
            onClick={() => {
              setNeedsPermission(false);
              requestPermission();
            }}
            className="w-full py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400"
          >
            Use folder picker instead →
          </button>
        </div>
      );
    }
      // No permission yet
    //   if (!statusUri) {
    //     return (
    //       <div className="space-y-4">
    //         <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-3">
    //           <div className="flex items-center gap-2">
    //             <Info className="w-4 h-4 text-green-400 flex-shrink-0" />
    //             <p className="text-xs font-semibold text-green-300">How to save WhatsApp statuses</p>
    //           </div>
    //           <div className="space-y-2">
    //             {[
    //               { n: '1', text: 'Tap "Grant Permission" below' },
    //               { n: '2', text: 'A folder picker will open' },
    //               { n: '3', text: 'Navigate to: Android → media → com.whatsapp → WhatsApp → Media → .Statuses' },
    //               { n: '4', text: 'Tap "Use this folder" → Allow' },
    //               { n: '5', text: 'All statuses will appear automatically!' },
    //             ].map(item => (
    //               <div key={item.n} className="flex gap-2.5">
    //                 <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
    //                   {item.n}
    //                 </span>
    //                 <p className="text-[11px] text-slate-400 leading-relaxed">{item.text}</p>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //
    //         <button
    //           onClick={requestPermission}
    //           className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
    //         >
    //           <FolderOpen className="w-4 h-4" />
    //           Grant Permission
    //         </button>
    //       </div>
    //     );
    //   }
    // Show grant permission screen only if truly never granted
    if (!permissionGranted) {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-xs font-semibold text-green-300">
                How to save WhatsApp statuses
              </p>
            </div>
            <div className="space-y-2">
              {[
                { n: '1', text: 'Open WhatsApp and view statuses you want to save' },
                { n: '2', text: 'Come back to Save It Pro and tap "Load Statuses"' },
                { n: '3', text: 'All statuses will appear automatically!' },
              ].map(item => (
                <div key={item.n} className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {item.n}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={requestPermission}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-60"
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</>
              : <><FolderOpen className="w-4 h-4" /> Load Statuses</>
            }
          </button>
        </div>
      );
    }
return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {loading ? 'Loading...' : `${files.length} status${files.length !== 1 ? 'es' : ''}`}
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
            onClick={() => loadStatuses(statusUri ?? undefined)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(STORAGE_DIRECT_KEY);
              setStatusUri(null);
              setPermissionGranted(false);
              setFiles([]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Change Folder
          </button>
        </div>
      </div>

      {/* Tabs + Sort */}
      {!loading && files.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'video', label: 'Videos', count: videoCount },
              { id: 'image', label: 'Photos', count: imageCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {tab.id === 'video' && <Film className="w-3 h-3" />}
                {tab.id === 'image' && <Image className="w-3 h-3" />}
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-all flex-shrink-0"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-2.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && files.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 font-medium">No statuses found</p>
          <p className="text-xs text-slate-500 mt-1">View statuses in WhatsApp first, then refresh</p>
          <button
            onClick={() => loadStatuses(statusUri ?? undefined)}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && files.length > 0 && (() => {
       const filteredFiles = files
         .filter(f => f.type === activeTab)
         .sort((a, b) => sortOrder === 'newest'
           ? b.name.localeCompare(a.name)
           : a.name.localeCompare(b.name)
         );
        return (
          <>
            {/* Empty filtered */}
         {filteredFiles.length === 0 && (
           <div className="text-center py-12">
             <p className="text-slate-400 font-medium">
               No {activeTab === 'video' ? 'videos' : 'photos'} found
             </p>
             <p className="text-xs text-slate-500 mt-1">
               View some {activeTab === 'video' ? 'video' : 'photo'} statuses in WhatsApp first
             </p>
           </div>
         )}

            {filteredFiles.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredFiles.map((file, i) => {
                    const isSaved = saved.has(file.uri);
                    const isSaving = saving.has(file.uri);
                    return (
                      <div key={i} className={`relative rounded-2xl overflow-hidden bg-slate-800 border transition-all ${isSaved ? 'border-green-500/40' : 'border-slate-700/50'}`}>
                        <div className="relative h-32">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt="status"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                              {file.type === 'video' ? (
                                <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                </div>
                              ) : (
                                <Image className="w-8 h-8 text-slate-500" />
                              )}
                            </div>
                          )}

                          {file.type === 'video' && file.thumbnail && (
                            <div className="absolute bottom-2 left-2">
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
                                <Film className="w-2.5 h-2.5" /> Video
                              </span>
                            </div>
                          )}

                          {isSaved && (
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
                          <span className="text-[10px] text-slate-500 truncate flex-1 capitalize">{file.type}</span>
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

                {filteredFiles.some(f => !saved.has(f.uri)) && (
                  <button
                    onClick={() => {
                      const unsaved = filteredFiles.filter(
                        f => !saved.has(f.uri) && !saving.has(f.uri)
                      );
                      unsaved.forEach((f, idx) =>
                        setTimeout(() => saveFile(f), idx * 500)
                      );
                    }}
                    disabled={saving.size > 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    Save All ({filteredFiles.filter(f => !saved.has(f.uri)).length} remaining)
                  </button>
                )}
              </>
            )}
          </>
        );
      })()}
    </div>
  );
}