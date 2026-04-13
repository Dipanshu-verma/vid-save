import { Download, Play, Clock, User, ExternalLink } from 'lucide-react';
import type { DownloadResult, DownloadQuality } from '../types';
import PlatformBadge from './PlatformBadge';

interface DownloadResultProps {
  result: DownloadResult;
}

function QualityButton({ quality }: { quality: DownloadQuality }) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = quality.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = '';
    a.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all duration-150 active:scale-98 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
          <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{quality.label}</p>
          {quality.resolution && (
            <p className="text-xs text-slate-400">{quality.resolution}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {quality.size && (
          <span className="text-xs text-slate-400">{quality.size}</span>
        )}
        <span className="text-xs font-medium text-slate-500 uppercase">.{quality.ext}</span>
        <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300" />
      </div>
    </button>
  );
}

export default function DownloadResultCard({ result }: DownloadResultProps) {
  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative">
        {result.thumbnail ? (
          <img
            src={result.thumbnail}
            alt={result.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-slate-800 flex items-center justify-center">
            <Play className="w-12 h-12 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PlatformBadge platform={result.platform} />
            {result.duration && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium">
                <Clock className="w-2.5 h-2.5" />
                {result.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{result.title}</h3>
        {result.author && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <User className="w-3 h-3" />
            {result.author}
          </p>
        )}
      </div>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Choose Quality</p>
          <span className="text-xs text-slate-500">{result.qualities.length} option{result.qualities.length !== 1 ? 's' : ''}</span>
        </div>
        {result.qualities.map((q, i) => (
          <QualityButton key={i} quality={q} />
        ))}
        {result.qualities.length === 0 && (
          <div className="text-center py-4">
            <ExternalLink className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No downloadable formats found</p>
          </div>
        )}
      </div>
    </div>
  );
}
