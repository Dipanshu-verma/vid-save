import { useEffect, useRef, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  label?: string;
}

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string ?? 'ca-pub-9557521405876162';
const SLOT_BANNER = import.meta.env.VITE_AD_SLOT_BANNER as string ?? '7576021114';
const SLOT_RECTANGLE = import.meta.env.VITE_AD_SLOT_RECTANGLE as string ?? '7376710569';
const SLOT_INTERSTITIAL = import.meta.env.VITE_AD_SLOT_INTERSTITIAL as string ?? '6083495563';

function AdBanner({
  slot = SLOT_BANNER,
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

  // ── Production: render real ad unit ──
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-1">
        {label}
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── AdPlaceholder ────────────────────────────────────────────────────────────

/**
 * Visual placeholder shown in dev mode or before AdSense approval.
 * Styled to match the app's design system.
 */
export function AdPlaceholder({ label = 'Advertisement', type = 'banner' }: { label?: string; type?: 'banner' | 'rectangle' }) {
  const slot = type === 'rectangle' ? SLOT_RECTANGLE : SLOT_BANNER;

  if (!Capacitor.isNativePlatform()) {
    return <AdBanner slot={slot} label={label} />;
  }

  return (
    <div
      aria-hidden="true"
      className="w-full bg-slate-800/40 border border-dashed border-slate-700/60 rounded-xl flex items-center justify-center py-5 px-3 select-none"
    >
      <div className="text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">
          {label}
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">Google AdSense</p>
      </div>
    </div>
  );
}

export default AdBanner;

// ─── InterstitialAd ───────────────────────────────────────────────────────────

/**
 * Full-screen overlay ad shown after a key user action (e.g. successful download).
 * - Shows a 5-second countdown before the close button appears
 * - Skipped entirely on native (Capacitor) platforms
 * - Calls onClose() when dismissed
 */
export function InterstitialAd({ onClose }: { onClose: () => void }) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [countdown, setCountdown] = useState(5);

  // Countdown timer — close button appears when it hits 0
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Push the ad unit once on mount
  useEffect(() => {
    if (Capacitor.isNativePlatform() || pushed.current) return;
    pushed.current = true;
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense interstitial error:', e);
    }
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Skip on native
  if (Capacitor.isNativePlatform()) {
    onClose();
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Header */}
      <div className="w-full max-w-sm px-4 flex items-center justify-between mb-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Advertisement</p>
        {countdown > 0 ? (
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
            Skip in {countdown}s
          </span>
        ) : (
          <button
            onClick={handleClose}
            className="text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 px-3 py-1 rounded-full transition-colors active:scale-95"
            aria-label="Close advertisement"
          >
            Close ✕
          </button>
        )}
      </div>

      {/* Ad unit */}
      <div className="w-full max-w-sm mx-4 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '250px' }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={SLOT_INTERSTITIAL}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Tap outside to close (only after countdown) */}
      {countdown === 0 && (
        <button
          onClick={handleClose}
          className="absolute inset-0 -z-10"
          aria-label="Close"
        />
      )}
    </div>
  );
}
