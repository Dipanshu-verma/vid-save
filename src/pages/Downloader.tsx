import { AlertCircle } from 'lucide-react';
import DownloadForm from '../components/DownloadForm';
import DownloadResultCard from '../components/DownloadResult';
import { AdPlaceholder, InterstitialAd } from '../components/AdBanner';
import type { UseDownloadReturn } from '../hooks/useDownload';
import { useState, useEffect } from 'react';

interface DownloaderProps {
  downloadState: UseDownloadReturn;
}

export default function Downloader({ downloadState }: DownloaderProps) {
  const { status, result, error, fetchDownload, reset } = downloadState;
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    if (status === 'success' && result) {
      setShowInterstitial(true);
    }
  }, [status, result]);

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Video Downloader</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Download HD videos from YouTube, Instagram and Facebook — free, fast, no login required.
        </p>
      </div>

      <DownloadForm onSubmit={fetchDownload} status={status} onReset={reset} />

      {status === 'error' && error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Download Failed</p>
            <p className="text-xs text-red-400/80 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="h-48 rounded-2xl bg-slate-800 animate-pulse" />
          <div className="h-4 rounded-lg bg-slate-800 animate-pulse w-3/4" />
          <div className="space-y-2">
            <div className="h-14 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-14 rounded-xl bg-slate-800 animate-pulse" />
          </div>
        </div>
      )}

      {result && status === 'success' && (
        <>
          <DownloadResultCard result={result} />
          <AdPlaceholder label="Advertisement" type="rectangle" />
        </>
      )}

      {/* Supported links content — always visible */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">How to Download</p>
        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>1. Copy the video link from YouTube, Instagram or Facebook</p>
          <p>2. Paste the URL above and tap Download Video</p>
          <p>3. Select quality and save to your Downloads folder</p>
        </div>
        <div className="border-t border-slate-700/30 pt-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Supported Links</p>
          <div className="space-y-1.5 text-xs text-slate-400">
            <p>• <span className="text-red-400 font-medium">YouTube</span> — youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...</p>
            <p>• <span className="text-pink-400 font-medium">Instagram</span> — instagram.com/p/..., instagram.com/reel/...</p>
            <p>• <span className="text-blue-400 font-medium">Facebook</span> — facebook.com/..., fb.watch/...</p>
          </div>
        </div>
      </div>

      {/* Ad only after content */}
      {status === 'idle' && <AdPlaceholder label="Advertisement" />}

      {showInterstitial && (
        <InterstitialAd onClose={() => setShowInterstitial(false)} />
      )}

      {/* Rich content for AdSense compliance */}
      <div className="space-y-6 pt-2">

        {/* How to Download Videos */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">How to Download Videos</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Downloading videos from social media platforms has never been easier. Our free online video downloader supports multiple platforms and lets you save videos directly to your device in just a few clicks — no account, no software installation, and no limits on how many videos you can download.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-semibold text-white">Copy the video URL</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Open YouTube, Instagram, or Facebook and navigate to the video you want to save. Tap the Share button inside the app and select "Copy Link" to copy the video URL to your clipboard.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-semibold text-white">Paste the link in the input field</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Tap the input field at the top of this page and paste the URL you just copied. The downloader will automatically recognize the platform based on the link format.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-semibold text-white">Tap "Download Video"</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Press the download button and wait a few seconds while we fetch the video information from the platform. Available quality options will appear on screen once processing is complete.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-semibold text-white">Select quality and save the file</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Choose your preferred video quality — 1080p Full HD, 720p HD, 480p, or audio-only MP3 — and tap the download button next to it. The file will save directly to your device's Downloads folder.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">Supported Platforms</h2>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1.5">YouTube</p>
              <p className="text-xs text-slate-400 leading-relaxed">YouTube is the world's largest video-sharing platform, with over 500 hours of video uploaded every minute. Our downloader supports standard YouTube watch links (youtube.com/watch?v=…), shortened youtu.be links, YouTube Shorts, and videos from public playlists. You can download in multiple resolutions up to 1080p Full HD, or extract just the audio as an MP3 — perfect for saving music, podcasts, lectures, and tutorials for offline listening.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-pink-400 mb-1.5">Instagram</p>
              <p className="text-xs text-slate-400 leading-relaxed">Instagram is one of the world's most popular visual platforms, with billions of Reels and video posts shared every day. Our tool makes it easy to save Instagram Reels and video posts without needing an Instagram account. Simply copy the post link from the app, paste it here, and your video will be ready to download within seconds. Saved videos retain their original quality as uploaded by the creator.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-400 mb-1.5">Facebook</p>
              <p className="text-xs text-slate-400 leading-relaxed">Facebook hosts billions of public videos spanning news clips, personal uploads, live stream recordings, and viral content. Our Facebook video downloader supports both standard facebook.com video links and the shortened fb.watch links. You can download Facebook videos in standard or HD quality, making it simple to save educational content, funny clips, or meaningful moments for offline viewing — no Facebook login required.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-5">
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-white">Is this video downloader completely free?</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Yes, VidSave is 100% free to use with no hidden fees, subscriptions, or account registration of any kind. You can download as many videos as you need without any limits. The service is supported by non-intrusive advertising, which allows us to keep all features free for everyone around the world.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">What video quality options are available for download?</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">The quality options available depend on what resolution the original video was uploaded in. For YouTube, we typically offer 1080p Full HD, 720p HD, 480p, and 360p video formats, along with an MP3 audio-only option. For Instagram and Facebook, the available quality reflects the original upload. Higher quality means better picture but a larger file size, so choose based on your storage and needs.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Why is my video link not working?</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Private videos, age-restricted content, members-only videos, and region-locked uploads cannot be downloaded because our tool only fetches publicly accessible content. Always make sure you are copying the link correctly using the Share button rather than just the browser address bar. If the video is public and the link looks correct but still fails, try refreshing the page and pasting again — it may be a temporary server-side delay.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Is it legal to download videos from YouTube or Instagram?</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Downloading videos for personal, offline, private viewing is generally considered acceptable in most regions, but re-uploading, redistributing, or commercially using someone else's video without their explicit permission can violate copyright laws and each platform's terms of service. We strongly recommend using downloaded content for personal use only and always crediting the original creator when sharing or referencing their work.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Do I need to install any app or browser extension?</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">No installation is required at all. VidSave works entirely within your browser — just paste a link and download. There are no browser extensions, desktop applications, or plugins needed. The tool is fully compatible with all major browsers including Chrome, Firefox, Safari, and Edge, and works seamlessly on both Android and iOS mobile devices as well as Windows, Mac, and Linux desktops.</p>
            </div>
          </div>
        </div>

        {/* Download Tips */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">Download Tips</h2>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p><span className="text-violet-400 font-semibold">Always use the Share button, not the address bar.</span> On mobile apps like YouTube and Instagram, always use the in-app Share button to copy the link. Address bar URLs on some browsers open a login page or redirect URL that the downloader cannot process correctly.</p>
            <p><span className="text-violet-400 font-semibold">Pick the right quality for your storage space.</span> Full HD 1080p video files can be quite large — sometimes multiple gigabytes for longer videos. If you are saving several videos or have limited storage, 720p or 480p offers a great balance of quality and file size without sacrificing too much visual detail.</p>
            <p><span className="text-violet-400 font-semibold">Download over Wi-Fi to avoid mobile data charges.</span> Video files are significantly larger than photos or audio. Always connect to a Wi-Fi network before downloading, especially for HD videos, to avoid using up your mobile data allowance and to ensure a faster, more reliable download experience.</p>
            <p><span className="text-violet-400 font-semibold">Find your videos in the Downloads folder.</span> Downloaded files are saved to your browser's default download location — usually the Downloads folder on your device. On Android, open the Files or My Files app to locate them. On iOS, check the Files app or your browser's designated download section.</p>
            <p><span className="text-violet-400 font-semibold">Use MP3 mode for music and spoken-word content.</span> If you only need the audio — such as a music track, podcast, meditation session, or lecture — select the MP3 option instead of a video format. Audio files are far smaller and are compatible with every music player, making them ideal for offline listening on the go.</p>
          </div>
        </div>

      </div>
    </div>
  );
}