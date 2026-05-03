import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import Downloader from './pages/Downloader';
import WhatsAppPage from './pages/WhatsAppPage';
import DownloadHistory from './components/DownloadHistory';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import FAQ from './pages/FAQ';
import BlogListing from './pages/BlogListing';
import BlogPost from './pages/BlogPost';
import { useHistory } from './hooks/useHistory';
import { useDownload } from './hooks/useDownload';
import { ToastProvider } from './components/Toast';
import { Capacitor } from '@capacitor/core';
import AdMob from './plugins/AdMob';

async function wakeUpServer() {
  try {
    const API = import.meta.env.VITE_API_URL || 'https://vid-backend-pr0o.onrender.com';
    await fetch(`${API}/health`, { signal: AbortSignal.timeout(60000) });
    console.log('[server] warmed up');
  } catch {
    console.log('[server] wake up failed');
  }
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

registerSW();

export default function App() {
  const navigate = useNavigate();
  const { records, loading, refetch } = useHistory();
  const downloadState = useDownload();

  useEffect(() => {
    wakeUpServer();
  }, []);

  // Keep onNavigate for any page that still uses it as a prop
  const handleNavigate = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <main className="max-w-2xl mx-auto px-4 pt-5 pb-36">
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/downloader" element={<Downloader downloadState={downloadState} />} />
            <Route path="/whatsapp" element={<WhatsAppPage />} />
            <Route path="/history" element={
              <DownloadHistory
                records={records}
                loading={loading}
                onRefresh={refetch}
              />
            } />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<BlogListing />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<Home onNavigate={handleNavigate} />} />
          </Routes>
        </main>
        <BottomNav />
        <InstallPrompt />
      </div>
    </ToastProvider>
  );
}