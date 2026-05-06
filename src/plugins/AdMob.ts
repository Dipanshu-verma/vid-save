import { registerPlugin } from '@capacitor/core';

export interface AdMobPlugin {
  showBanner(): Promise<void>;
  hideBanner(): Promise<void>;
  loadInterstitial(): Promise<void>;
  showInterstitial(): Promise<void>;
  showMonatagInterstitial(options: { url: string }): Promise<void>;
}

const AdMob = registerPlugin<AdMobPlugin>('AdMob');
export default AdMob;
