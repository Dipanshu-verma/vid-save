import WhatsAppSaver from '../components/WhatsAppSaver';
import { AdPlaceholder } from '../components/AdBanner';
import { Smartphone, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export default function WhatsAppPage() {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    return (
      <div className="space-y-5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">WhatsApp Status Saver</h2>
          <p className="text-sm text-slate-400 mt-0.5">Save photos and videos before they expire</p>
        </div>

        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto">
            <Smartphone className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-1">Android App Required</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              WhatsApp status saving requires our Android app. Browsers cannot access WhatsApp status folder due to Android security restrictions.
            </p>
          </div>
          <a
            href="https://github.com/Dipanshu-verma/vid-save/releases/latest/download/Save.It.Pro.apk"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
          >
            <Download className="w-4 h-4" />
            Download Android App
          </a>
          <p className="text-[11px] text-slate-500">Free. No Play Store required. Direct install.</p>
        </div>

        {/* Info content before ad */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">How it works</p>
          <div className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
            <p>1. Install our free Android app</p>
            <p>2. Open WhatsApp and view statuses you want to save</p>
            <p>3. Use Save It Pro to save them to your Downloads folder</p>
            <p>4. Access saved statuses anytime in your gallery</p>
          </div>
        </div>

        <AdPlaceholder label="Advertisement" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">WhatsApp Status Saver</h2>
        <p className="text-sm text-slate-400 mt-0.5">Save photos and videos before they expire</p>
      </div>
      <WhatsAppSaver />
      <AdPlaceholder label="Advertisement" />
    </div>
  );
}