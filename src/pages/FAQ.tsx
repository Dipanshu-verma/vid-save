// src/pages/FAQ.tsx
export default function FAQ() {
  const faqs = [
    {
      q: 'How do I download Instagram Reels?',
      a: 'Copy the Instagram Reel URL, paste it in Save It Pro, click Download Video, and choose your preferred quality.'
    },
    {
      q: 'Can I download YouTube videos for free?',
      a: 'Yes! Save It Pro is completely free. Just paste the YouTube URL and download in HD quality.'
    },
    {
      q: 'How do I save WhatsApp Status videos?',
      a: 'Open WhatsApp, view the status, then use our Android app to save it directly to your Downloads folder.'
    },
    {
      q: 'Is Save It Pro safe to use?',
      a: 'Yes. We do not store any personal data. All downloads happen directly to your device.'
    },
    {
      q: 'What video quality can I download?',
      a: 'Save It Pro supports up to 1080p HD quality for Instagram and Facebook, and up to 4K for YouTube.'
    },
    {
      q: 'Does Save It Pro work on iPhone?',
      a: 'Currently Save It Pro is available as an Android app and web app. iOS support is coming soon.'
    },
    {
      q: 'How do I install the Android app?',
      a: 'Download the APK from our GitHub releases page, enable "Install from unknown sources" in Android settings, and install.'
    },
    {
      q: 'Why is my download taking long?',
      a: 'Download time depends on video length and quality. HD videos may take 30-60 seconds to process before downloading.'
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        <p className="text-sm text-slate-400 mt-0.5">Everything you need to know about Save It Pro</p>
      </div>

      <div className="space-y-3">
        {faqs.map(({ q, a }, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
            <p className="text-sm font-semibold text-white">{q}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}