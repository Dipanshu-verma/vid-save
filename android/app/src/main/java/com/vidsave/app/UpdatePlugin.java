package com.vidsave.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "Updater")
public class UpdatePlugin extends Plugin {

    @PluginMethod
    public void getAppVersion(PluginCall call) {
        try {
            String version = getContext().getPackageManager()
                    .getPackageInfo(getContext().getPackageName(), 0).versionName;
            JSObject result = new JSObject();
            result.put("version", version);
            call.resolve(result);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url");
        if (url == null) { call.reject("URL required"); return; }

        call.setKeepAlive(true);
        new Thread(() -> {
            try {
                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient.Builder()
                        .followRedirects(true)
                        .followSslRedirects(true)
                        .build();

                okhttp3.Request request = new okhttp3.Request.Builder()
                        .url(url)
                        .header("User-Agent", "Mozilla/5.0")
                        .build();

                okhttp3.Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    call.reject("Download failed: HTTP " + response.code());
                    return;
                }

                okhttp3.ResponseBody body = response.body();
                if (body == null) { call.reject("Empty response"); return; }

                long total = body.contentLength();
                java.io.File apkFile = new java.io.File(
                        getContext().getExternalCacheDir(), "update.apk");

                java.io.InputStream input = body.byteStream();
                java.io.FileOutputStream output = new java.io.FileOutputStream(apkFile);
                byte[] buffer = new byte[8192];
                long downloaded = 0;
                int read;
                int lastReportedPercent = -1;

                while ((read = input.read(buffer)) != -1) {
                    output.write(buffer, 0, read);
                    downloaded += read;

                    int percent = total > 0 ? (int)((downloaded * 100.0) / total) : 0;

                    // Only notify every 5% to avoid flooding
                    if (percent >= lastReportedPercent + 5 || percent == 100) {
                        lastReportedPercent = percent;
                        JSObject progress = new JSObject();
                        progress.put("downloaded", downloaded);
                        progress.put("total", total);
                        progress.put("percent", percent);
                        notifyListeners("updateProgress", progress);
                    }
                }
                output.close();
                input.close();
                response.close();

                // Install APK
                getActivity().runOnUiThread(() -> {
                    try {
                        android.util.Log.d("Updater", "APK file exists: " + apkFile.exists());
                        android.util.Log.d("Updater", "APK file size: " + apkFile.length());
                        android.util.Log.d("Updater", "APK path: " + apkFile.getAbsolutePath());

                        android.net.Uri apkUri = androidx.core.content.FileProvider
                                .getUriForFile(
                                        getContext(),
                                        getContext().getPackageName() + ".fileprovider",
                                        apkFile
                                );

                        android.util.Log.d("Updater", "APK URI: " + apkUri.toString());

                        android.content.Intent installIntent =
                                new android.content.Intent(
                                        android.content.Intent.ACTION_VIEW);
                        installIntent.setDataAndType(apkUri,
                                "application/vnd.android.package-archive");
                        installIntent.addFlags(
                                android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION |
                                        android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                        getContext().startActivity(installIntent);
                        call.resolve();
                    } catch (Exception e) {
                        android.util.Log.e("Updater", "Install failed: " + e.getMessage());
                        call.reject("Install failed: " + e.getMessage());
                    }
                });

            } catch (Exception e) {
                call.reject("Download failed: " + e.getMessage());
            }
        }).start();
    }
}