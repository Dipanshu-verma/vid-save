////package com.vidsave.app;
////
////import com.getcapacitor.BridgeActivity;
////
////public class MainActivity extends BridgeActivity {}
//
//package com.vidsave.app;
//
//import android.os.Bundle;
//import com.getcapacitor.BridgeActivity;
//import java.util.ArrayList;
//import com.google.android.gms.ads.MobileAds;
//
//public class MainActivity extends BridgeActivity {
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        registerPlugin(DownloadPlugin.class);
//        registerPlugin(AdMobPlugin.class);
//        super.onCreate(savedInstanceState);
//        MobileAds.initialize(this, initializationStatus -> {});
//    }
//}


////package com.vidsave.app;
////
////import com.getcapacitor.BridgeActivity;
////
////public class MainActivity extends BridgeActivity {}
//
//package com.vidsave.app;
//
//import android.content.Intent;
//import android.net.Uri;
//import android.os.Bundle;
//import android.webkit.WebResourceRequest;
//import android.webkit.WebView;
//import com.getcapacitor.BridgeActivity;
//import com.getcapacitor.BridgeWebViewClient;
//import com.google.android.gms.ads.MobileAds;
//
//public class MainActivity extends BridgeActivity {
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        registerPlugin(DownloadPlugin.class);
//        registerPlugin(AdMobPlugin.class);
//        super.onCreate(savedInstanceState);
//        MobileAds.initialize(this, initializationStatus -> {});
//    }
//
//    @Override
//    public void onStart() {
//        super.onStart();
//
//        // Extend Capacitor's own WebViewClient instead of replacing it
//        WebView webView = getBridge().getWebView();
//        webView.setWebViewClient(new BridgeWebViewClient(getBridge()) {
//            @Override
//            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
//                String url = request.getUrl().toString();
//
//                if (url.startsWith("intent://")) {
//                    try {
//                        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
//                        if (getPackageManager().resolveActivity(intent, 0) != null) {
//                            startActivity(intent);
//                        } else {
//                            String fallbackUrl = intent.getStringExtra("browser_fallback_url");
//                            if (fallbackUrl != null) {
//                                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl)));
//                            }
//                        }
//                    } catch (Exception e) {
//                        android.util.Log.e("WebView", "intent:// error: " + e.getMessage());
//                    }
//                    return true;
//                }
//
//                return super.shouldOverrideUrlLoading(view, request);
//            }
//        });
//    }
//}

package com.vidsave.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {

    private WebView monetagBannerView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        registerPlugin(AdMobPlugin.class);
        super.onCreate(savedInstanceState);
        MobileAds.initialize(this, initializationStatus -> {});
    }

    @Override
    public void onStart() {
        super.onStart();

        // Fix intent:// URL scheme for Capacitor WebView
        WebView webView = getBridge().getWebView();
        webView.setWebViewClient(new BridgeWebViewClient(getBridge()) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("intent://")) {
                    try {
                        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                        if (getPackageManager().resolveActivity(intent, 0) != null) {
                            startActivity(intent);
                        } else {
                            String fallbackUrl = intent.getStringExtra("browser_fallback_url");
                            if (fallbackUrl != null) {
                                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl)));
                            }
                        }
                    } catch (Exception e) {
                        android.util.Log.e("WebView", "intent:// error: " + e.getMessage());
                    }
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, request);
            }
        });

        // Create banner once but keep hidden initially
        createMonatagBanner();
    }

    private void createMonatagBanner() {
        runOnUiThread(() -> {
            if (monetagBannerView != null) return;

            monetagBannerView = new WebView(this);

            WebSettings settings = monetagBannerView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

            monetagBannerView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    String url = request.getUrl().toString();
                    if (url.startsWith("intent://")) {
                        try {
                            Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                            if (getPackageManager().resolveActivity(intent, 0) != null) {
                                startActivity(intent);
                            } else {
                                String fallback = intent.getStringExtra("browser_fallback_url");
                                if (fallback != null) {
                                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fallback)));
                                }
                            }
                        } catch (Exception e) {
                            android.util.Log.e("BannerWebView", e.getMessage());
                        }
                        return true;
                    }
                    startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl()));
                    return true;
                }
            });

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    (int) (50 * getResources().getDisplayMetrics().density)
            );
            params.gravity = android.view.Gravity.BOTTOM;

            android.view.ViewGroup rootLayout = findViewById(android.R.id.content);
            rootLayout.addView(monetagBannerView, params);

            // Load Monetag banner
            monetagBannerView.loadUrl("file:///android_asset/monetag_banner.html");

            // Hidden by default
            monetagBannerView.setVisibility(android.view.View.GONE);

            android.util.Log.d("Monetag", "Banner created and hidden");
        });
    }

    public void showMonatagBanner() {
        runOnUiThread(() -> {
            if (monetagBannerView != null) {
                monetagBannerView.setVisibility(android.view.View.VISIBLE);
                android.util.Log.d("Monetag", "Banner shown");
            }
        });
    }

    public void hideMonatagBanner() {
        runOnUiThread(() -> {
            if (monetagBannerView != null) {
                monetagBannerView.setVisibility(android.view.View.GONE);
                android.util.Log.d("Monetag", "Banner hidden");
            }
        });
    }

    @Override
    public void onDestroy() {
        if (monetagBannerView != null) {
            monetagBannerView.destroy();
        }
        super.onDestroy();
    }
}