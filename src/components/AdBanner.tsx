import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  label?: string;
}

function AdBanner({
  slot = '1045903250',
  format = 'auto',
  label = 'Advertisement'
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  if (Capacitor.isNativePlatform()) return null;

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-1">
        {label}
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9557521405876162"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdPlaceholder({ label = 'Advertisement' }: { label?: string }) {
  if (!Capacitor.isNativePlatform()) {
    return <AdBanner label={label} />;
  }

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center py-4 px-3">
      <div className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{label}</p>
        <p className="text-xs text-slate-600 mt-0.5">Google AdSense</p>
      </div>
    </div>
  );
}

export default AdBanner;