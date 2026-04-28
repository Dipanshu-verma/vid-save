// import { Youtube, Instagram, Facebook, MessageCircle, ArrowRight, Shield, Zap, Smartphone } from 'lucide-react';
// import { AdPlaceholder } from '../components/AdBanner';
//
// interface HomeProps {
//   onNavigate: (tab: string) => void;
// }
//
// const platforms = [
//   { name: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', desc: 'HD, FHD & 4K' },
//   { name: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', desc: 'Reels & Posts' },
//   { name: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', desc: 'Videos & Stories' },
//   { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', desc: 'Status Videos' },
// ];
//
// const features = [
//   { icon: Zap, title: 'Lightning Fast', desc: 'Get download links in seconds' },
//   { icon: Shield, title: '100% Safe', desc: 'No login or permissions needed' },
//   { icon: Smartphone, title: 'Works Offline', desc: 'Installable PWA for quick access' },
// ];
//
// export default function Home({ onNavigate }: HomeProps) {
//   return (
//     <div className="space-y-6 pb-4">
//       <div className="rounded-2xl bg-gradient-to-br from-sky-600/20 via-slate-800/50 to-slate-800/80 border border-sky-500/20 p-6 text-center">
//         <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/30">
//           <Youtube className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-2xl font-bold text-white mb-2">Save It Pro</h1>
//         <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
//           Download videos from YouTube, Instagram, Facebook and save WhatsApp statuses — fast and free.
//         </p>
//         <button
//           onClick={() => onNavigate('downloader')}
//           className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-sky-500/25"
//         >
//           Start Downloading
//           <ArrowRight className="w-4 h-4" />
//         </button>
//       </div>
//
//       <AdPlaceholder label="Advertisement" />
//
//       <div>
//         <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Supported Platforms</p>
//         <div className="grid grid-cols-2 gap-2.5">
//           {platforms.map(({ name, icon: Icon, color, bg, border, desc }) => (
//             <button
//               key={name}
//               onClick={() => onNavigate(name === 'WhatsApp' ? 'whatsapp' : 'downloader')}
//               className={`flex items-center gap-3 p-3.5 rounded-xl ${bg} border ${border} hover:opacity-80 transition-all active:scale-95 text-left`}
//             >
//               <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
//               <div>
//                 <p className="text-sm font-semibold text-white">{name}</p>
//                 <p className={`text-[11px] ${color} opacity-80`}>{desc}</p>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//
//       <div>
//         <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Why Save It Pro?</p>
//         <div className="space-y-2.5">
//           {features.map(({ icon: Icon, title, desc }) => (
//             <div key={title} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30">
//               <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
//                 <Icon className="w-4.5 h-4.5 text-sky-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-white">{title}</p>
//                 <p className="text-xs text-slate-400">{desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//
//       <AdPlaceholder label="Advertisement" type="rectangle" />
//
//    <div className="text-center pt-2 space-y-3">
//      <p className="text-[11px] text-slate-600">
//        Save It Pro respects copyright. Download only content you own or have permission to download.
//      </p>
//      <div className="flex items-center justify-center gap-4">
//        <button
//          onClick={() => onNavigate('about')}
//          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
//        >
//          About
//        </button>
//        <span className="text-slate-700">•</span>
//        <button
//          onClick={() => onNavigate('privacy')}
//          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
//        >
//          Privacy Policy
//        </button>
//        <button onClick={() => onNavigate('faq')} className="text-xs text-slate-500 hover:text-slate-300">
//          FAQ
//        </button>
//      </div>
//    </div>
//     </div>
//   );
// }

import { Youtube, Instagram, Facebook, MessageCircle, ArrowRight, Shield, Zap, Smartphone, Download, Star, HelpCircle } from 'lucide-react';
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

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-6 pb-4">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-600/20 via-slate-800/50 to-slate-800/80 border border-sky-500/20 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/30">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Save It Pro</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
          The best free video downloader for YouTube, Instagram, Facebook and WhatsApp. Download HD videos instantly — no login required.
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

      {/* Platforms */}
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

      {/* How it works */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">How It Works</p>
        <div className="space-y-2.5">
          {[
            { step: '1', title: 'Copy the video URL', desc: 'Go to YouTube, Instagram or Facebook and copy the video link from your browser or share menu.' },
            { step: '2', title: 'Paste & click download', desc: 'Paste the URL into Save It Pro and tap the Download Video button to fetch video details.' },
            { step: '3', title: 'Choose quality & save', desc: 'Select your preferred video quality (720p, 1080p or 4K) and save it directly to your Downloads folder.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-sky-400">{step}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdPlaceholder label="Advertisement" />

      {/* Features */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Why Choose Save It Pro?</p>
        <div className="space-y-2.5">
          {[
            { icon: Zap, title: 'Lightning Fast Downloads', desc: 'Get your videos in seconds with our optimized servers. No waiting, no queues.' },
            { icon: Shield, title: '100% Safe & Private', desc: 'No login required. No personal data collected. Your downloads stay on your device.' },
            { icon: Smartphone, title: 'Android App Available', desc: 'Download our free Android app for the best experience including WhatsApp Status saver.' },
            { icon: Star, title: 'High Quality Video', desc: 'Download videos in original quality up to 4K Ultra HD. No watermarks, no compression.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Preview */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Common Questions</p>
        <div className="space-y-2.5">
          {[
            { q: 'Is Save It Pro free?', a: 'Yes, Save It Pro is completely free to use with no hidden charges.' },
            { q: 'Which platforms are supported?', a: 'YouTube, Instagram, Facebook and WhatsApp Status saver are all supported.' },
            { q: 'Do I need to create an account?', a: 'No account needed. Just paste the URL and download instantly.' },
          ].map(({ q, a }) => (
            <div key={q} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                {q}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed pl-5">{a}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate('faq')}
          className="w-full mt-2 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
        >
          View all FAQs →
        </button>
      </div>

      <AdPlaceholder label="Advertisement" />

      {/* Footer */}
      <div className="text-center pt-2 space-y-3">
        <p className="text-[11px] text-slate-600">
          Save It Pro respects copyright. Download only content you own or have permission to download.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => onNavigate('about')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">About</button>
          <span className="text-slate-700">•</span>
          <button onClick={() => onNavigate('privacy')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</button>
          <span className="text-slate-700">•</span>
          <button onClick={() => onNavigate('faq')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">FAQ</button>
        </div>
      </div>
    </div>
  );
}