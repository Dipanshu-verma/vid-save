import { Download, Info } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Save It Pro" className="w-8 h-8 rounded-lg shadow-lg shadow-sky-500/30" />
          <span className="font-bold text-white text-lg tracking-tight">Save It Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/?tab=about" className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Info className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}