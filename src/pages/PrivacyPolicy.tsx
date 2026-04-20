export default function PrivacyPolicy() {
  return (
    <div className="space-y-6 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
        <p className="text-xs text-slate-400 mt-0.5">Last updated: April 2026</p>
      </div>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">1. Information We Collect</h3>
          <p>Save It Pro does not collect any personal information. All download history is stored locally on your device and never sent to our servers.</p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">2. How We Use Information</h3>
          <p>The URLs you paste are sent to our server only to process the download request. We do not store, log, or share these URLs.</p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">3. Third Party Services</h3>
          <p>We use third-party APIs to process video downloads. These services may have their own privacy policies. We use Google AdSense for advertising which may use cookies.</p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">4. Data Storage</h3>
          <p>Download history is stored locally on your device using localStorage. You can clear it anytime from the History tab.</p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">5. Copyright</h3>
          <p>Save It Pro is intended for downloading content you own or have permission to download. Users are responsible for complying with applicable copyright laws.</p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <h3 className="font-semibold text-white">6. Contact</h3>
          <p>For any questions regarding this privacy policy, contact us at: <span className="text-sky-400">dhruvswaminhr@gmail.com</span></p>
        </section>
      </div>
    </div>
  );
}