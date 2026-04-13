import WhatsAppSaver from '../components/WhatsAppSaver';
import { AdPlaceholder } from '../components/AdBanner';

export default function WhatsAppPage() {
  return (
    <div className="space-y-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">WhatsApp Status Saver</h2>
        <p className="text-sm text-slate-400 mt-0.5">Save photos & videos before they expire</p>
      </div>
      <AdPlaceholder label="Advertisement" />
      <WhatsAppSaver />
      <AdPlaceholder label="Advertisement" />
    </div>
  );
}
