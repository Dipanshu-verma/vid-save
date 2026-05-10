import WhatsAppSaver from '../components/WhatsAppSaver';
import { AdPlaceholder } from '../components/AdBanner';
import { Smartphone, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

function WhatsAppContentSection() {
  return (
    <div className="space-y-6 pt-2">

      {/* About WhatsApp Status Saver */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-bold text-white">About WhatsApp Status Saver</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          WhatsApp Statuses are short photos and videos that your contacts share with you for a limited time. Similar to Stories on Instagram or Snapchat, WhatsApp Statuses are visible to your contacts for exactly 24 hours before they automatically disappear forever. Once that window closes, neither you nor the person who posted the status can retrieve it — it's gone for good unless it was saved beforehand.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          This temporary nature is by design: WhatsApp built statuses to encourage casual, in-the-moment sharing without the pressure of creating permanent content. However, it creates a problem when someone shares something you genuinely want to keep — a funny clip, a beautiful photo, an important announcement, or a touching memory from a friend or family member.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          That's exactly what our WhatsApp Status Saver solves. It gives you a simple, reliable way to view and save any status update before it expires — photos and videos alike — so you never miss a moment worth keeping. All saved files go directly to your device gallery and Downloads folder, ready to view, share, or back up at any time.
        </p>
      </div>

      {/* How to Save WhatsApp Status */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-bold text-white">How to Save WhatsApp Status</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">1</span>
            <div>
              <p className="text-sm font-semibold text-white">Download and install the Android app</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Tap the "Download Android App" button on this page to get the Save It Pro APK. Since it's a direct install (not from the Play Store), you'll need to allow installation from unknown sources in your device settings when prompted.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">2</span>
            <div>
              <p className="text-sm font-semibold text-white">Open WhatsApp and view statuses</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Open your WhatsApp app and navigate to the Status tab. Watch all the statuses you want to save — you must view them in WhatsApp first, as this moves them into the temporary WhatsApp status cache folder on your device.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">3</span>
            <div>
              <p className="text-sm font-semibold text-white">Open Save It Pro</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Launch the Save It Pro app on your Android device. The app will automatically detect and display all the statuses you have recently viewed in WhatsApp, including both photos and videos in a clean, organized grid.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">4</span>
            <div>
              <p className="text-sm font-semibold text-white">Select the statuses you want to keep</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Browse through the detected statuses and tap on any photo or video you want to save. You can select multiple items at once for a batch save, making it quick and easy to preserve everything you want in one go.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">5</span>
            <div>
              <p className="text-sm font-semibold text-white">Save to your gallery</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Tap the Save button to copy the selected files to your device's gallery and Downloads folder. Once saved, the files are permanently stored on your device and will remain there even after the original WhatsApp status expires after 24 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-5">
        <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-white">Why do WhatsApp statuses disappear after 24 hours?</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">WhatsApp designed the Status feature with a 24-hour expiry to encourage spontaneous, casual sharing without the permanence of a regular post or chat message. This temporary format is similar to Instagram Stories and Snapchat. Once 24 hours pass, WhatsApp automatically deletes the status from its servers and from the temporary cache on viewers' devices, making it impossible to recover without having saved it beforehand.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Will the person know if I save their status?</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">No, saving a WhatsApp status with Save It Pro does not send any notification to the person who posted it. WhatsApp only notifies status posters about who has viewed their status — it has no mechanism to detect or report whether a viewer saved the content to their device. Your privacy and the poster's notification experience remain completely unchanged.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Why does WhatsApp Status Saver require an Android app?</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">WhatsApp stores your viewed statuses in a hidden, protected folder on your Android device's internal storage. Web browsers are sandboxed for security reasons and cannot access files outside their own storage area, which means a website alone cannot read WhatsApp's status folder. A native Android app, however, can request the necessary file permissions to access that folder and copy the media to your gallery.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">What types of statuses can I save?</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Save It Pro supports saving both photo statuses (JPG/JPEG images) and video statuses (MP4 files) shared by your WhatsApp contacts. Text-only statuses are not media files and therefore cannot be saved as a file, but you can always take a screenshot of a text status if you need to keep a record of it.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Is it safe to install the APK directly?</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Yes, the Save It Pro APK is safe to install. The app is developed and maintained by our team and does not contain any malware, spyware, or harmful code. Because it's distributed outside the Google Play Store, Android will ask you to enable installation from unknown sources — this is a standard Android security prompt for any APK not installed via the Play Store. You can disable that permission again after installation if you prefer.</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-bold text-white">Tips for Saving Statuses</h2>
        <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
          <p><span className="text-green-400 font-semibold">View statuses in WhatsApp before opening Save It Pro.</span> The status saver works by reading the temporary files WhatsApp stores locally when you view a status. If you haven't opened a status in WhatsApp first, it won't appear in the saver — so always watch it in WhatsApp before trying to save it.</p>
          <p><span className="text-green-400 font-semibold">Save statuses before the 24-hour window closes.</span> WhatsApp clears the local status cache after 24 hours, so if you wait too long the file may no longer be available even to the saver. Make it a habit to open Save It Pro daily if you regularly want to preserve your contacts' statuses.</p>
          <p><span className="text-green-400 font-semibold">Use batch save to process multiple statuses at once.</span> Instead of saving statuses one by one, select all the photos and videos you want to keep in a single session and save them together. This is faster and ensures you don't accidentally miss anything before the files expire.</p>
          <p><span className="text-green-400 font-semibold">Back up saved statuses to cloud storage.</span> After saving statuses to your device, consider backing them up to Google Photos, Google Drive, or another cloud service. This protects your saved content from accidental deletion or device loss, ensuring those memorable moments are preserved for good.</p>
        </div>
      </div>

    </div>
  );
}

export default function WhatsAppPage() {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    return (
      <div className="space-y-5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">WhatsApp Status Saver</h2>
          <p className="text-sm text-slate-400 mt-0.5">Save photos and videos before they expire</p>
        </div>

        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto">
            <Smartphone className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-1">Android App Required</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              WhatsApp status saving requires our Android app. Browsers cannot access WhatsApp status folder due to Android security restrictions.
            </p>
          </div>
          <a
            href="https://github.com/Dipanshu-verma/vid-save/releases/latest/download/Save.It.Pro.apk"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20"
          >
            <Download className="w-4 h-4" />
            Download Android App
          </a>
          <p className="text-[11px] text-slate-500">Free. No Play Store required. Direct install.</p>
        </div>

        {/* Info content before ad */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">How it works</p>
          <div className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
            <p>1. Install our free Android app</p>
            <p>2. Open WhatsApp and view statuses you want to save</p>
            <p>3. Use Save It Pro to save them to your Downloads folder</p>
            <p>4. Access saved statuses anytime in your gallery</p>
          </div>
        </div>

        <AdPlaceholder label="Advertisement" />

        {/* Rich content for AdSense compliance */}
        <WhatsAppContentSection />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">WhatsApp Status Saver</h2>
        <p className="text-sm text-slate-400 mt-0.5">Save photos and videos before they expire</p>
      </div>
      <WhatsAppSaver />
      <WhatsAppContentSection />
      <AdPlaceholder label="Advertisement" />
    </div>
  );
}