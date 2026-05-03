import { Download, Shield, Zap, Smartphone, Globe, Users, Star, CheckCircle, Youtube, Instagram, Facebook } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 pb-8 px-1">

      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <img src="/icon.png" alt="Save It Pro" className="w-20 h-20 rounded-2xl mx-auto shadow-xl shadow-sky-500/20" />
        <div>
          <h1 className="text-2xl font-bold text-white">Save It Pro</h1>
          <p className="text-xs text-slate-400 mt-1">Version 1.0.7 · Free Video Downloader</p>
        </div>
        <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
          Save It Pro is a free, fast, and privacy-friendly tool to download videos from Instagram, Facebook, YouTube, and save WhatsApp statuses — directly to your device with no login required.
        </p>
      </div>

      {/* What is Save It Pro */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">What is Save It Pro?</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Save It Pro is a multi-platform video downloader designed for Android users and web browsers. It lets you download videos and reels from popular social media platforms including Instagram, Facebook, and YouTube — all without needing to create an account or install any bloatware.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Whether you want to save a funny reel, a tutorial video, or a motivational clip for offline viewing, Save It Pro makes the process simple: paste the link, pick your quality, and download. No redirects, no fake buttons, no hidden charges.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">Key Features</h2>
        <div className="space-y-3">
          {[
            { icon: Zap, title: 'Lightning Fast Downloads', desc: 'Our optimized servers fetch video links in seconds, so you spend less time waiting and more time watching.' },
            { icon: Shield, title: 'Privacy First, Always', desc: 'We do not collect any personal data. No login required. Your download history stays locally on your device.' },
            { icon: Smartphone, title: 'Native Android App', desc: 'Install our APK for the full experience — background downloads, WhatsApp status access, and AdMob-free browsing.' },
            { icon: Download, title: 'WhatsApp Status Saver', desc: 'View and save WhatsApp statuses before they disappear after 24 hours. Works for both photos and videos.' },
            { icon: Globe, title: 'Works on Any Browser', desc: 'No app installation needed for the web version. Works on Chrome, Firefox, Safari — any modern browser.' },
            { icon: Star, title: 'Multiple Quality Options', desc: 'Choose from 360p, 720p HD, or 1080p Full HD depending on your storage and data preferences.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">Supported Platforms</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Youtube, name: 'YouTube', desc: 'Videos & Shorts', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Instagram, name: 'Instagram', desc: 'Reels & Posts', color: 'text-pink-400', bg: 'bg-pink-500/10' },
            { icon: Facebook, name: 'Facebook', desc: 'Videos & Reels', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map(({ icon: Icon, name, desc, color, bg }) => (
            <div key={name} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${bg} border border-slate-700/30 text-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
              <div>
                <p className="text-xs font-bold text-white">{name}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          We are actively working to add support for more platforms including Twitter/X, Pinterest, and Dailymotion. Stay tuned for updates.
        </p>
      </section>

      {/* How It Works */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">How It Works</h2>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Copy the video link from Instagram, Facebook, or YouTube.' },
            { step: '2', text: 'Paste the link into the Save It Pro search bar.' },
            { step: '3', text: 'Select your preferred video quality (360p, 720p, 1080p).' },
            { step: '4', text: 'Tap Download — video saves directly to your device.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
              <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">Why Choose Save It Pro?</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          There are many video downloader tools available online, but most of them are cluttered with misleading ads, fake download buttons, and privacy risks. Save It Pro was built with a simple goal: give users a clean, honest, and fast way to save videos they love.
        </p>
        <div className="space-y-2 pt-1">
          {[
            'No account or sign-up required',
            'No fake download buttons or redirects',
            'No personal data collected or sold',
            'Free to use — web and Android APK',
            'Works offline after download',
            'Regularly updated for platform changes',
          ].map(item => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <p className="text-sm text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal / Disclaimer */}
      <section className="space-y-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <h2 className="text-sm font-bold text-white">Important Disclaimer</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Save It Pro is intended for personal, offline use only. Please only download content that you have permission to download, or content licensed under Creative Commons. Downloading copyrighted content without permission may violate the terms of service of the respective platforms. Always respect content creators and their rights.
        </p>
      </section>

      {/* Contact */}
     {/* Contact */}
<section className="space-y-2">
  <h2 className="text-base font-bold text-white border-b border-slate-700/50 pb-2">Contact & Support</h2>
  <p className="text-sm text-slate-400 leading-relaxed">
    Have a question, found a bug, or want to suggest a new platform? We'd love to hear from you. Reach out via email and we'll get back to you as soon as possible.
  </p>
  <a
    href="mailto:dhruvvermanhr@gmail.com"
    className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
  >
    <Globe className="w-4 h-4" />
    dhruvvermanhr@gmail.com
  </a>
</section>

    </div>
  );
}