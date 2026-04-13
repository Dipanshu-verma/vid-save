import { Download, MessageCircle, History, Home } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'downloader', icon: Download, label: 'Download' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WA Saver' },
  { id: 'history', icon: History, label: 'History' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
      <div className="max-w-2xl mx-auto px-2 flex items-center">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                isActive ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`relative transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-sky-400' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
