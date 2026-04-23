import { Youtube, Instagram, Facebook, MessageCircle, ArrowRight, Shield, Zap, Smartphone } from 'lucide-react';
import { AdPlaceholder } from '../components/AdBanner';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', desc: 'HD, FHD & 4K' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', desc: 'Reels & Posts' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', desc: 'Videos & Stories' },
  { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', desc: 'Status Videos' },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Get download links in seconds' },
  { icon: Shield, title: '100% Safe', desc: 'No login or permissions needed' },
  { icon: Smartphone, title: 'Works Offline', desc: 'Installable PWA for quick access' },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-6 pb-4">
      <div className="rounded-2xl bg-gradient-to-br from-sky-600/20 via-slate-800/50 to-slate-800/80 border border-sky-500/20 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/30">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Save It Pro</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
          Download videos from YouTube, Instagram, Facebook and save WhatsApp statuses — fast and free.
        </p>
        <button
          onClick={() => onNavigate('downloader')}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-sky-500/25"
        >
          Start Downloading
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <AdPlaceholder label="Advertisement" />

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Supported Platforms</p>
        <div className="grid grid-cols-2 gap-2.5">
          {platforms.map(({ name, icon: Icon, color, bg, border, desc }) => (
            <button
              key={name}
              onClick={() => onNavigate(name === 'WhatsApp' ? 'whatsapp' : 'downloader')}
              className={`flex items-center gap-3 p-3.5 rounded-xl ${bg} border ${border} hover:opacity-80 transition-all active:scale-95 text-left`}
            >
              <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className={`text-[11px] ${color} opacity-80`}>{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Why Save It Pro?</p>
        <div className="space-y-2.5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdPlaceholder label="Advertisement" />

   <div className="text-center pt-2 space-y-3">
     <p className="text-[11px] text-slate-600">
       Save It Pro respects copyright. Download only content you own or have permission to download.
     </p>
     <div className="flex items-center justify-center gap-4">
       <button
         onClick={() => onNavigate('about')}
         className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
       >
         About
       </button>
       <span className="text-slate-700">•</span>
       <button
         onClick={() => onNavigate('privacy')}
         className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
       >
         Privacy Policy
       </button>
     </div>
   </div>
    </div>
  );
}
