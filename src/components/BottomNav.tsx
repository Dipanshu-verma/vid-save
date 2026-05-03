import { NavLink } from 'react-router-dom';
import { Download, MessageCircle, History, Home } from 'lucide-react';

const tabs = [
  { path: '/',           icon: Home,          label: 'Home'     },
  { path: '/downloader', icon: Download,       label: 'Download' },
  { path: '/whatsapp',   icon: MessageCircle,  label: 'WA Saver' },
  { path: '/history',    icon: History,        label: 'History'  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
      <div className="max-w-2xl mx-auto px-2 flex items-center">
        {tabs.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                isActive ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-400 rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-sky-400' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}