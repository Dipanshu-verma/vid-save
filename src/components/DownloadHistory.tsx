import { Clock, Download, RefreshCw, Play, CheckCircle2, XCircle } from 'lucide-react';
import PlatformBadge from './PlatformBadge';
import type { DownloadRecord } from '../types';

interface DownloadHistoryProps {
  records: DownloadRecord[];
  loading: boolean;
  onRefresh: () => void;
}

function HistoryItem({ record }: { record: DownloadRecord }) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleDownload = () => {
    if (!record.download_url) return;
    const a = document.createElement('a');
    a.href = record.download_url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-slate-700 transition-all">
      {record.thumbnail_url ? (
        <img
          src={record.thumbnail_url}
          alt={record.title}
          className="w-16 h-11 rounded-lg object-cover flex-shrink-0 bg-slate-700"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-16 h-11 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Play className="w-5 h-5 text-slate-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate leading-tight">
          {record.title || 'Untitled Video'}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <PlatformBadge platform={record.platform} />
          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(record.created_at)}
          </span>
          {record.quality && (
            <span className="text-[10px] text-slate-500">{record.quality}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {record.status === 'completed' ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 hidden sm:block" />
            <button
              onClick={handleDownload}
              disabled={!record.download_url}
              className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
      </div>
    </div>
  );
}

export default function DownloadHistory({ records, loading, onRefresh }: DownloadHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Download History</h2>
          <p className="text-xs text-slate-400">{records.length} completed download{records.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No downloads yet</p>
          <p className="text-sm text-slate-500 mt-1">Your download history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <HistoryItem key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
