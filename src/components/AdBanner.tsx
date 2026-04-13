import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_e) {
      // AdSense not loaded yet
    }
  }, []);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdPlaceholder({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center py-4 px-3">
      <div className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{label}</p>
        <p className="text-xs text-slate-600 mt-0.5">Google AdSense</p>
      </div>
    </div>
  );
}
