import { Download, Shield, Zap, Smartphone } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 pb-4">
      <div className="text-center space-y-3 pt-4">
        <img src="/icon.png" alt="Save It Pro" className="w-20 h-20 rounded-2xl mx-auto shadow-xl shadow-sky-500/20" />
        <div>
          <h2 className="text-xl font-bold text-white">Save It Pro</h2>
          <p className="text-xs text-slate-400">Version 1.0.3</p>
        </div>
        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
          Download videos from Instagram, Facebook and save WhatsApp statuses — fast and free.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { icon: Zap, title: 'Fast Downloads', desc: 'Get your videos quickly with our optimized servers' },
          { icon: Shield, title: 'Privacy First', desc: 'No personal data collected, history stored locally only' },
          { icon: Smartphone, title: 'Android App', desc: 'Full features available on our Android app' },
          { icon: Download, title: 'WhatsApp Saver', desc: 'Save WhatsApp statuses before they disappear' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}