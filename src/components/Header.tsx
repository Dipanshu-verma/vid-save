import { useState } from 'react';
import { Share2, X, Download, Globe } from 'lucide-react';
    import { useToast } from './Toast';

const APK_URL = 'https://github.com/Dipanshu-verma/vid-save/releases/latest/download/Save.It.Pro.apk';
const WEB_URL = 'https://vid-save.vercel.app';


export default function Header() {
  const { showSuccess } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);

  const shareWebLink = async () => {
    const shareData = {
      title: 'Save It Pro',
      text: 'Download videos from Instagram, Facebook & YouTube for free!',
      url: WEB_URL,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(WEB_URL);
      showSuccess('Web link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  const shareApkLink = async () => {
    const shareData = {
      title: 'Save It Pro - Android App',
      text: 'Download Save It Pro Android app for free!',
      url: APK_URL,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(APK_URL);
      showSuccess('APK link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Save It Pro" className="w-8 h-8 rounded-lg shadow-lg shadow-sky-500/30" />
            <span className="font-bold text-white text-lg tracking-tight">Save It Pro</span>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
       <div
         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center px-4 pb-20"
         onClick={() => setShowShareModal(false)}
       >
          <div
             className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300"
             onClick={e => e.stopPropagation()}
           >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-white">Share Save It Pro</p>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share options */}
            <div className="space-y-2">
              <button
                onClick={shareWebLink}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Share Web App</p>
                  <p className="text-xs text-slate-400">vid-save.vercel.app</p>
                </div>
              </button>

              <button
                onClick={shareApkLink}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Share Android APK</p>
                  <p className="text-xs text-slate-400">Direct download link</p>
                </div>
              </button>
            </div>

            <div className="border-t border-slate-700/50" />
          </div>
        </div>
      )}
    </>
  );
}