import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import Downloader from './pages/Downloader';
import WhatsAppPage from './pages/WhatsAppPage';
import DownloadHistory from './components/DownloadHistory';
import { useHistory } from './hooks/useHistory';
import { useDownload } from './hooks/useDownload';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';

function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

registerSW();

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
  });

  const { records, loading, refetch } = useHistory();

  // Lifted up — persists across tab switches
  const downloadState = useDownload();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', tab === 'home' ? '/' : `/?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleTabChange} />;
      case 'downloader':
        return <Downloader downloadState={downloadState} />;
      case 'whatsapp':
        return <WhatsAppPage />;
      case 'history':
        return (
          <DownloadHistory
            records={records}
            loading={loading}
            onRefresh={refetch}
          />
        );
    case 'privacy':
      return <PrivacyPolicy />;
    case 'about':
      return <About />;
      default:
        return <Home onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-5 pb-28">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      <InstallPrompt />
    </div>
  );
}