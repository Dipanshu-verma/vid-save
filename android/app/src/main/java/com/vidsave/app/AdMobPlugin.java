package com.vidsave.app;

import android.app.Activity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

@CapacitorPlugin(name = "AdMob")
public class AdMobPlugin extends Plugin {

    // Use test IDs during development
//    private static final String BANNER_ID = "ca-app-pub-3940256099942544/6300978111"; // Test banner
//    private static final String INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712"; // Test interstitial
    private static final String BANNER_ID = "ca-app-pub-9557521405876162/7993757854";
    private static final String INTERSTITIAL_ID = "ca-app-pub-9557521405876162/8185329540";

    private AdView adView;
    private InterstitialAd interstitialAd;

//    @PluginMethod
//    public void showBanner(PluginCall call) {
//        android.util.Log.d("AdMob", "showBanner called");
//
//        getActivity().runOnUiThread(() -> {
//            if (adView != null) {
//                adView.destroy();
//            }
//
//            adView = new AdView(getContext());
//            adView.setAdUnitId(BANNER_ID);
//            adView.setAdSize(AdSize.BANNER);
//
//            AdRequest adRequest = new AdRequest.Builder().build();
//            adView.loadAd(adRequest);
//
//            // Add banner to bottom of screen
//            RelativeLayout layout = new RelativeLayout(getContext());
//            RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
//                    RelativeLayout.LayoutParams.MATCH_PARENT,
//                    RelativeLayout.LayoutParams.WRAP_CONTENT
//            );
//            params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
//            layout.addView(adView, params);
//
//            getActivity().addContentView(layout, new RelativeLayout.LayoutParams(
//                    RelativeLayout.LayoutParams.MATCH_PARENT,
//                    RelativeLayout.LayoutParams.MATCH_PARENT
//            ));
//
//            call.resolve();
//        });
//    }

    @PluginMethod
    public void showBanner(PluginCall call) {
        android.util.Log.d("AdMob", "showBanner called");
        getActivity().runOnUiThread(() -> {
            if (adView != null) {
                adView.destroy();
            }

            adView = new AdView(getContext());
            adView.setAdUnitId(BANNER_ID);
            adView.setAdSize(AdSize.BANNER);

            AdRequest adRequest = new AdRequest.Builder().build();
            adView.loadAd(adRequest);

            // Get the root layout
            android.view.ViewGroup rootLayout = getActivity().findViewById(android.R.id.content);

            // Create container
            android.widget.FrameLayout bannerContainer = new android.widget.FrameLayout(getContext());
            android.widget.FrameLayout.LayoutParams params = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.MATCH_PARENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT
            );
            params.gravity = android.view.Gravity.BOTTOM;
            bannerContainer.setLayoutParams(params);
            bannerContainer.addView(adView);

            // Add to root — on top of WebView
            rootLayout.addView(bannerContainer, params);

            android.util.Log.d("AdMob", "Banner added to layout");
            call.resolve();
        });
    }

    @PluginMethod
    public void hideBanner(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (adView != null) {
                adView.setVisibility(View.GONE);
            }
            call.resolve();
        });
    }

    @PluginMethod
    public void loadInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            AdRequest adRequest = new AdRequest.Builder().build();
            InterstitialAd.load(getContext(), INTERSTITIAL_ID, adRequest,
                    new InterstitialAdLoadCallback() {
                        @Override
                        public void onAdLoaded(InterstitialAd ad) {
                            interstitialAd = ad;
                            call.resolve();
                        }
                        @Override
                        public void onAdFailedToLoad(LoadAdError error) {
                            interstitialAd = null;
                            call.reject("Failed to load interstitial: " + error.getMessage());
                        }
                    }
            );
        });
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (interstitialAd != null) {
                interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                    @Override
                    public void onAdDismissedFullScreenContent() {
                        interstitialAd = null;
                        // Auto reload for next time
                        AdRequest adRequest = new AdRequest.Builder().build();
                        InterstitialAd.load(getContext(), INTERSTITIAL_ID, adRequest,
                                new InterstitialAdLoadCallback() {
                                    @Override
                                    public void onAdLoaded(InterstitialAd ad) {
                                        interstitialAd = ad;
                                        android.util.Log.d("AdMob", "Interstitial reloaded");
                                    }
                                    @Override
                                    public void onAdFailedToLoad(LoadAdError error) {
                                        interstitialAd = null;
                                    }
                                }
                        );
                        call.resolve();
                    }
                });
                interstitialAd.show(getActivity());
            } else {
                call.reject("Interstitial not loaded");
            }
        });
    }

    @PluginMethod
    public void showMonatagInterstitial(PluginCall call) {
        String url = call.getString("url", "https://omg10.com/4/10957102");

        getActivity().runOnUiThread(() -> {
            // Fullscreen in-app WebView — no browser opens
            android.app.Dialog dialog = new android.app.Dialog(
                    getActivity(),
                    android.R.style.Theme_Black_NoTitleBar_Fullscreen
            );

            android.widget.FrameLayout layout = new android.widget.FrameLayout(getActivity());

            android.webkit.WebView webView = new android.webkit.WebView(getActivity());
            webView.getSettings().setJavaScriptEnabled(true);
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().setMixedContentMode(
                    android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

            webView.setWebViewClient(new android.webkit.WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(android.webkit.WebView view,
                                                        android.webkit.WebResourceRequest request) {
                    String reqUrl = request.getUrl().toString();
                    if (reqUrl.startsWith("intent://")) {
                        try {
                            android.content.Intent intent = android.content.Intent.parseUri(
                                    reqUrl, android.content.Intent.URI_INTENT_SCHEME);
                            if (getActivity().getPackageManager()
                                    .resolveActivity(intent, 0) != null) {
                                getActivity().startActivity(intent);
                            }
                        } catch (Exception ignored) {}
                        return true;
                    }
                    return false;
                }
            });

            webView.loadUrl(url);

            // Close button
            android.widget.Button closeBtn = new android.widget.Button(getActivity());
            closeBtn.setText("✕ Close");
            closeBtn.setTextColor(android.graphics.Color.WHITE);
            closeBtn.setBackgroundColor(android.graphics.Color.parseColor("#80000000"));
            closeBtn.setOnClickListener(v -> dialog.dismiss());

            android.widget.FrameLayout.LayoutParams webParams =
                    new android.widget.FrameLayout.LayoutParams(
                            android.widget.FrameLayout.LayoutParams.MATCH_PARENT,
                            android.widget.FrameLayout.LayoutParams.MATCH_PARENT);

            android.widget.FrameLayout.LayoutParams btnParams =
                    new android.widget.FrameLayout.LayoutParams(
                            android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                            android.widget.FrameLayout.LayoutParams.WRAP_CONTENT);
            btnParams.gravity = android.view.Gravity.TOP | android.view.Gravity.END;
            btnParams.setMargins(0, 40, 20, 0);

            layout.addView(webView, webParams);
            layout.addView(closeBtn, btnParams);

            dialog.setContentView(layout);
            dialog.show();

            // Auto close after 15 seconds
            new android.os.Handler(android.os.Looper.getMainLooper())
                    .postDelayed(dialog::dismiss, 15000);

            call.resolve();
        });
    }
}