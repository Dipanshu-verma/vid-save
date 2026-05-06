//////package com.vidsave.app;
//////
//////import com.getcapacitor.BridgeActivity;
//////
//////public class MainActivity extends BridgeActivity {}
////
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

package com.vidsave.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {

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
        getBridge().getWebView().setWebViewClient(
                new BridgeWebViewClient(getBridge()) {

                    // Block Monetag SCRIPT LOADING
                    @Override
                    public android.webkit.WebResourceResponse shouldInterceptRequest(
                            WebView view, WebResourceRequest request) {

                        String host = request.getUrl().getHost() != null
                                ? request.getUrl().getHost() : "";

                        // Block Monetag ad scripts from loading at all
                        if (host.contains("quge5.com") ||
                                host.contains("al5sm.com") ||
                                host.contains("nap5k.com") ||        // ← new
                                host.contains("n6wxm.com") ||        // ← new
                                host.contains("monetag") ||
                                host.contains("ppopo.com") ||
                                host.contains("puckseychavish") ||
                                host.contains("myvcc")) {

                            android.util.Log.d("WebView", "Blocked: " + host);
                            // Return empty response — script never executes
                            return new android.webkit.WebResourceResponse(
                                    "text/javascript", "UTF-8",
                                    new java.io.ByteArrayInputStream("".getBytes())
                            );
                        }

                        return super.shouldInterceptRequest(view, request);
                    }

                    // Block Monetag NAVIGATION
                    @Override
                    public boolean shouldOverrideUrlLoading(
                            WebView view, WebResourceRequest request) {

                        String url = request.getUrl().toString();

                        if (url.startsWith("intent://")) {
                            try {
                                Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                                if (getPackageManager().resolveActivity(intent, 0) != null) {
                                    startActivity(intent);
                                } else {
                                    String fallback = intent.getStringExtra("browser_fallback_url");
                                    if (fallback != null) {
                                        startActivity(new Intent(
                                                Intent.ACTION_VIEW, Uri.parse(fallback)));
                                    }
                                }
                            } catch (Exception e) {
                                android.util.Log.e("WebView", "intent:// error: " + e.getMessage());
                            }
                            return true;
                        }

                        return super.shouldOverrideUrlLoading(view, request);
                    }
                }
        );
    }
}