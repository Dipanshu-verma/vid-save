import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const APK_URL = 'https://github.com/Dipanshu-verma/vid-save/releases/latest/download/Save.It.Pro.apk';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Don't show in native APK
    if (Capacitor.isNativePlatform()) return;

    const android = /android/i.test(navigator.userAgent);
    setIsAndroid(android);

    const isDismissed = localStorage.getItem('pwa_install_dismissed');
    if (isDismissed) return;

    if (android) {
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isAndroid) {
      window.open(APK_URL, '_blank');
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', '1');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-800 border border-sky-500/30 rounded-2xl p-4 shadow-2xl shadow-slate-900/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/30">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">
            {isAndroid ? 'Get the Android App' : 'Install Save It Pro'}
          </p>
          <p className="text-xs text-slate-400">
            {isAndroid ? 'Download APK for better experience' : 'Add to home screen for quick access'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleDismiss} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <button onClick={handleInstall} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors">
            <Download className="w-3.5 h-3.5" />
            {isAndroid ? 'Download APK' : 'Install'}
          </button>
        </div>
      </div>
    </div>
  );
}