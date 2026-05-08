import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import Updater from '../plugins/Updater';

const GITHUB_REPO = 'Dipanshu-verma/vid-save'; // ← update this

export default function UpdateChecker() {
  const [update, setUpdate] = useState<{
    version: string; url: string;
  } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    checkForUpdate();
  }, []);

const checkForUpdate = async () => {
  try {
    const { version: current } = await Updater.getAppVersion();
    console.log('Current version:', current);

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
    );
    const data = await res.json();
    const latest = data.tag_name?.replace('v', '');
    console.log('Latest release:', latest);
    console.log('Assets:', JSON.stringify(data.assets?.map((a: any) => a.name)));

    if (latest && latest !== current) {
      const assets = data.assets || [];
      const apkAsset = assets.find((a: any) =>
        a.name.toLowerCase().endsWith('.apk')
      );

      console.log('APK asset:', JSON.stringify(apkAsset));

      if (apkAsset) {
        setUpdate({
          version: latest,
          url: apkAsset.browser_download_url,
        });
      }
    }
  } catch (err) {
    console.error('Update check failed:', err);
  }
};

  const handleUpdate = async () => {
    if (!update || downloading) return;
    setDownloading(true);
    setPercent(0);

    let listener: { remove: () => void } | null = null;

    try {
      listener = await Updater.addListener('updateProgress', (data) => {
        console.log('Progress:', data.percent + '%', data.downloaded, '/', data.total);
        setPercent(data.percent); // ← always update, no throttle
      });

      await Updater.downloadAndInstall({ url: update.url });

    } catch (err: any) {
      console.error('Update failed:', err);
      alert('Update failed: ' + (err?.message || JSON.stringify(err)));
      setDownloading(false);
      setPercent(0);
    } finally {
      listener?.remove();
    }
  };

  if (!update || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl bg-slate-800 border border-sky-500/30 shadow-xl shadow-black/40 overflow-hidden">
        {/* Progress bar */}
        {downloading && (
          <div className="h-1 bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}

        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              Update Available
            </p>
            <p className="text-xs text-slate-400">
              {downloading
                ? `Downloading... ${percent}%`
                : `Version ${update.version} is ready`}
            </p>
          </div>

          <div className="flex gap-2">
            {!downloading && (
              <button
                onClick={() => setDismissed(true)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
              >
                Later
              </button>
            )}
            <button
              onClick={handleUpdate}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all disabled:opacity-60 min-w-[52px]"
            >
              {downloading ? `${percent}%` : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}