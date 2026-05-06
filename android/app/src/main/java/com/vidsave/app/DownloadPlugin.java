package com.vidsave.app;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.media.MediaScannerConnection;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import org.json.JSONObject;
import org.json.JSONArray;
@CapacitorPlugin(name = "Downloader")
public class DownloadPlugin extends Plugin {

    private volatile boolean isPaused = false;
    private volatile boolean isCancelled = false;
    private long resumeFrom = 0;
    private String currentFilename = null;

    @PluginMethod
    public void pauseDownload(PluginCall call) {
        isPaused = true;
        call.resolve();
    }

    @PluginMethod
    public void resumeDownload(PluginCall call) {
        isPaused = false;
        call.resolve();
    }

    @PluginMethod
    public void cancelDownload(PluginCall call) {
        isCancelled = true;
        isPaused = false;
        call.resolve();
    }

//    @PluginMethod
//    public void download(PluginCall call) {
//        String url = call.getString("url");
//        String filename = call.getString("filename", "video.mp4");
//
//        if (url == null) {
//            call.reject("URL is required");
//            return;
//        }
//
//        call.setKeepAlive(true);
//
//        new Thread(() -> {
//            try {
//                android.util.Log.d("Downloader", "Starting download: " + filename);
//
//                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient.Builder()
//                        .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
//                        .readTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
//                        .writeTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
//                        .build();
//
//                okhttp3.Request request = new okhttp3.Request.Builder()
//                        .url(url)
//                        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36")
//                        .addHeader("Accept", "video/mp4,video/*,*/*")
//                        .build();
//
//                okhttp3.Response response = client.newCall(request).execute();
//
//                if (!response.isSuccessful()) {
//                    call.reject("Download failed: HTTP " + response.code());
//                    return;
//                }
//
//                okhttp3.ResponseBody body = response.body();
//                if (body == null) {
//                    call.reject("Empty response body");
//                    return;
//                }
//
//                java.io.InputStream inputStream = body.byteStream();
//                long downloaded = 0;
//
//                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
//                    // Android 10+ — use MediaStore
//                    android.content.ContentValues values = new android.content.ContentValues();
//                    values.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, filename);
//                    values.put(android.provider.MediaStore.Downloads.MIME_TYPE, "video/mp4");
//                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 1);
//
//                    android.content.ContentResolver resolver = getContext().getContentResolver();
//                    android.net.Uri collection = android.provider.MediaStore.Downloads.getContentUri(
//                            android.provider.MediaStore.VOLUME_EXTERNAL_PRIMARY
//                    );
//                    android.net.Uri itemUri = resolver.insert(collection, values);
//
//                    if (itemUri == null) {
//                        call.reject("Failed to create file in MediaStore");
//                        return;
//                    }
//
//                    java.io.OutputStream outputStream = resolver.openOutputStream(itemUri);
//                    if (outputStream == null) {
//                        call.reject("Failed to open output stream");
//                        return;
//                    }
//
//                    byte[] buffer = new byte[8192];
//                    int read;
//                    while ((read = inputStream.read(buffer)) != -1) {
//                        outputStream.write(buffer, 0, read);
//                        downloaded += read;
//                    }
//
//                    outputStream.flush();
//                    outputStream.close();
//                    inputStream.close();
//
//                    // Mark as complete
//                    values.clear();
//                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 0);
//                    resolver.update(itemUri, values, null, null);
//
//                    android.util.Log.d("Downloader", "Download complete via MediaStore: " + filename + " size: " + downloaded);
//
//                } else {
//                    // Android 9 and below — use direct file
//                    File destDir = Environment.getExternalStoragePublicDirectory(
//                            Environment.DIRECTORY_DOWNLOADS
//                    );
//                    if (!destDir.exists()) destDir.mkdirs();
//                    File destFile = new File(destDir, filename);
//                    if (destFile.exists()) destFile.delete();
//
//                    java.io.FileOutputStream outputStream = new java.io.FileOutputStream(destFile);
//                    byte[] buffer = new byte[8192];
//                    int read;
//                    while ((read = inputStream.read(buffer)) != -1) {
//                        outputStream.write(buffer, 0, read);
//                        downloaded += read;
//                    }
//                    outputStream.flush();
//                    outputStream.close();
//                    inputStream.close();
//
//                    MediaScannerConnection.scanFile(
//                            getContext(),
//                            new String[]{ destFile.getAbsolutePath() },
//                            new String[]{ "video/mp4" },
//                            null
//                    );
//
//                    android.util.Log.d("Downloader", "Download complete via File: " + filename);
//                }
//
//                // Show download complete notification
//                String notifTitle = filename.replace("_", " ").replace(".mp4", "");
//                android.app.NotificationManager notificationManager =
//                        (android.app.NotificationManager) getContext()
//                                .getSystemService(android.content.Context.NOTIFICATION_SERVICE);
//
//                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
//                    android.app.NotificationChannel channel = new android.app.NotificationChannel(
//                            "download_channel",
//                            "Downloads",
//                            android.app.NotificationManager.IMPORTANCE_DEFAULT
//                    );
//                    channel.setDescription("Download notifications");
//                    notificationManager.createNotificationChannel(channel);
//                }
//
//                android.app.Notification notification = new android.app.Notification.Builder(
//                        getContext(), "download_channel")
//                        .setContentTitle("Download Complete ✓")
//                        .setContentText(notifTitle)
//                        .setSmallIcon(android.R.drawable.stat_sys_download_done)
//                        .setAutoCancel(true)
//                        .build();
//
//                notificationManager.notify((int) System.currentTimeMillis(), notification);
//
//                call.resolve();
//
//            } catch (Exception e) {
//                android.util.Log.e("Downloader", "Error: " + e.getMessage());
//                call.reject("Download error: " + e.getMessage());
//            }
//        }).start();
//    }

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String filename = call.getString("filename", "video.mp4");
        String mimeType = call.getString("mimeType", "video/mp4");
        if (url == null) {
            call.reject("URL is required");
            return;
        }

        call.setKeepAlive(true);
        isPaused = false;
        isCancelled = false;
        currentFilename = filename;

        new Thread(() -> {
            try {
                android.util.Log.d("Downloader", "Starting download: " + filename);

                // Check if partial file exists for resume
                java.io.File cacheDir = getContext().getCacheDir();
                java.io.File partialFile = new java.io.File(cacheDir, filename + ".part");
                resumeFrom = partialFile.exists() ? partialFile.length() : 0;

                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient.Builder()
                        .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
                        .readTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
                        .writeTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
                        .build();

                okhttp3.Request.Builder requestBuilder = new okhttp3.Request.Builder()
                        .url(url)
                        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36")
                        .addHeader("Accept", "video/mp4,video/*,*/*");

                if (resumeFrom > 0) {
                    requestBuilder.addHeader("Range", "bytes=" + resumeFrom + "-");
                    android.util.Log.d("Downloader", "Resuming from: " + resumeFrom + " bytes");
                }

                okhttp3.Response response = client.newCall(requestBuilder.build()).execute();

                if (!response.isSuccessful() && response.code() != 206) {
                    // 206 = Partial Content (resume)
                    call.reject("Download failed: HTTP " + response.code());
                    return;
                }

                okhttp3.ResponseBody body = response.body();
                if (body == null) {
                    call.reject("Empty response body");
                    return;
                }

                long totalBytes = body.contentLength();
                if (totalBytes > 0 && resumeFrom > 0) {
                    totalBytes += resumeFrom; // Adjust total for resume
                }

                java.io.InputStream inputStream = body.byteStream();
                long downloaded = resumeFrom;
                long lastNotified = resumeFrom;

                byte[] buffer = new byte[8192];
                int read;

                // Write to partial cache file first
                java.io.FileOutputStream partialOut = new java.io.FileOutputStream(partialFile, resumeFrom > 0);

                while ((read = inputStream.read(buffer)) != -1) {
                    // Check cancelled
                    if (isCancelled) {
                        partialOut.close();
                        inputStream.close();
                        // Keep partial file for potential resume
                        call.reject("Download cancelled");
                        return;
                    }

                    // Check paused — wait until resumed
                    while (isPaused) {
                        partialOut.flush();
                        try { Thread.sleep(500); } catch (InterruptedException e) { break; }
                        if (isCancelled) break;
                    }

                    if (isCancelled) break;

                    partialOut.write(buffer, 0, read);
                    downloaded += read;

                    // Emit progress every 200KB
                    if (downloaded - lastNotified > 204800) {
                        lastNotified = downloaded;
                        JSObject progress = new JSObject();
                        progress.put("downloaded", downloaded);
                        progress.put("total", totalBytes);
                        progress.put("percent", totalBytes > 0
                                ? (int)((downloaded * 100) / totalBytes) : -1);
                        progress.put("paused", false);
                        notifyListeners("downloadProgress", progress);
                    }
                }

                partialOut.flush();
                partialOut.close();
                inputStream.close();

                if (isCancelled) {
                    call.reject("Download cancelled");
                    return;
                }

                // Move partial file to Downloads
                java.io.FileInputStream finalIn = new java.io.FileInputStream(partialFile);

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                    android.content.ContentValues values = new android.content.ContentValues();
                    values.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, filename);
//                    values.put(android.provider.MediaStore.Downloads.MIME_TYPE, "video/mp4");
                    values.put(android.provider.MediaStore.Downloads.MIME_TYPE, mimeType);
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 1);

                    android.content.ContentResolver resolver = getContext().getContentResolver();
                    android.net.Uri collection = android.provider.MediaStore.Downloads
                            .getContentUri(android.provider.MediaStore.VOLUME_EXTERNAL_PRIMARY);
                    android.net.Uri itemUri = resolver.insert(collection, values);

                    java.io.OutputStream outputStream = resolver.openOutputStream(itemUri);
                    byte[] buf = new byte[8192];
                    int r;
                    while ((r = finalIn.read(buf)) != -1) outputStream.write(buf, 0, r);
                    outputStream.close();

                    values.clear();
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(itemUri, values, null, null);
                } else {
                    java.io.File destDir = android.os.Environment
                            .getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS);
                    java.io.File dest = new java.io.File(destDir, filename);
                    java.io.FileOutputStream out = new java.io.FileOutputStream(dest);
                    byte[] buf = new byte[8192];
                    int r;
                    while ((r = finalIn.read(buf)) != -1) out.write(buf, 0, r);
                    out.close();
                    MediaScannerConnection.scanFile(getContext(),
                            new String[]{ dest.getAbsolutePath() },
                            new String[]{ "video/mp4" }, null);
                }

                finalIn.close();
                partialFile.delete(); // Clean up partial file

                // Final progress
                JSObject done = new JSObject();
                done.put("downloaded", downloaded);
                done.put("total", downloaded);
                done.put("percent", 100);
                done.put("paused", false);
                notifyListeners("downloadProgress", done);

                // Notification
                String notifTitle = filename.replace("_", " ").replace(".mp4", "");
                android.app.NotificationManager nm = (android.app.NotificationManager)
                        getContext().getSystemService(android.content.Context.NOTIFICATION_SERVICE);
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    android.app.NotificationChannel ch = new android.app.NotificationChannel(
                            "download_channel", "Downloads",
                            android.app.NotificationManager.IMPORTANCE_DEFAULT);
                    nm.createNotificationChannel(ch);
                }
                nm.notify((int) System.currentTimeMillis(),
                        new android.app.Notification.Builder(getContext(), "download_channel")
                                .setContentTitle("Download Complete ✓")
                                .setContentText(notifTitle)
                                .setSmallIcon(android.R.drawable.stat_sys_download_done)
                                .setAutoCancel(true).build());

                call.resolve();

            } catch (Exception e) {
                android.util.Log.e("Downloader", "Error: " + e.getMessage());
                call.reject("Download error: " + e.getMessage());
            }
        }).start();
    }

    @PluginMethod
    public void scanFile(PluginCall call) {
        String path = call.getString("path");
        if (path == null) {
            call.reject("Path is required");
            return;
        }
        MediaScannerConnection.scanFile(
                getContext(),
                new String[]{ path },
                null,
                (scannedPath, uri) -> call.resolve()
        );
    }

    @PluginMethod
    public void copyFile(PluginCall call) {
        String sourcePath = call.getString("sourcePath");
        String filename = call.getString("filename", "status.mp4");

        if (sourcePath == null) {
            call.reject("sourcePath is required");
            return;
        }

        new Thread(() -> {
            try {
                File source = new File(sourcePath);
                File destDir = Environment.getExternalStoragePublicDirectory(
                        Environment.DIRECTORY_DOWNLOADS
                );
                File dest = new File(destDir, filename);

                FileInputStream in = new FileInputStream(source);
                FileOutputStream out = new FileOutputStream(dest);
                byte[] buffer = new byte[1024 * 1024];
                int len;
                while ((len = in.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
                in.close();
                out.close();

                MediaScannerConnection.scanFile(
                        getContext(),
                        new String[]{ dest.getAbsolutePath() },
                        null,
                        (path, uri) -> {
                            JSObject result = new JSObject();
                            result.put("path", path != null ? path : dest.getAbsolutePath());
                            call.resolve(result);
                        }
                );
            } catch (Exception e) {
                call.reject("Copy failed: " + e.getMessage());
            }
        }).start();
    }

    @PluginMethod
    public void getYoutubeInfo(PluginCall call) {
        String videoId = call.getString("videoId");
        if (videoId == null) {
            call.reject("videoId is required");
            return;
        }

        new Thread(() -> {
            try {
                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient.Builder()
                        .connectTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
                        .readTimeout(15, java.util.concurrent.TimeUnit.SECONDS)
                        .build();

                String[][] clients = {
                        {"ANDROID", "19.30.36", "3", "com.google.android.youtube/19.30.36 (Linux; U; Android 11) gzip", "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w"},
                        {"ANDROID_VR", "1.56.21", "28", "com.google.android.apps.youtube.vr.oculus/1.56.21 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip", "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"},
                        {"ANDROID_TESTSUITE", "1.9", "30", "com.google.android.youtube/1.9 (Linux; U; Android 11) gzip", "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"},
                };

                org.json.JSONObject json = null;
                String lastError = "All clients failed";

                for (String[] clientInfo : clients) {
                    try {
                        String clientName = clientInfo[0];
                        String clientVersion = clientInfo[1];
                        String clientNameInt = clientInfo[2];
                        String userAgent = clientInfo[3];
                        String apiKey = clientInfo[4];

                        String body = "{\"videoId\":\"" + videoId + "\","
                                + "\"context\":{\"client\":{"
                                + "\"clientName\":\"" + clientName + "\","
                                + "\"clientVersion\":\"" + clientVersion + "\","
                                + "\"androidSdkVersion\":30,"
                                + "\"hl\":\"en\","
                                + "\"gl\":\"US\","
                                + "\"utcOffsetMinutes\":0"
                                + "}}}";

                        okhttp3.RequestBody requestBody = okhttp3.RequestBody.create(
                                body.getBytes("UTF-8"),
                                okhttp3.MediaType.parse("application/json; charset=utf-8")
                        );

                        okhttp3.Request request = new okhttp3.Request.Builder()
                                .url("https://www.youtube.com/youtubei/v1/player?key=" + apiKey + "&prettyPrint=false")
                                .post(requestBody)
                                .addHeader("Content-Type", "application/json")
                                .addHeader("User-Agent", userAgent)
                                .addHeader("X-YouTube-Client-Name", clientNameInt)
                                .addHeader("X-YouTube-Client-Version", clientVersion)
                                .addHeader("X-Goog-Api-Key", apiKey)
                                .build();

                        okhttp3.Response response = client.newCall(request).execute();
                        String responseBody = response.body().string();

                        android.util.Log.d("YouTubeAPI", clientName + " code: " + response.code());

                        org.json.JSONObject candidate = new org.json.JSONObject(responseBody);

                        if (!candidate.has("videoDetails")) {
                            android.util.Log.d("YouTubeAPI", clientName + ": no videoDetails, skipping");
                            continue;
                        }

                        if (candidate.has("playabilityStatus")) {
                            String status = candidate.getJSONObject("playabilityStatus").optString("status", "");
                            if (status.equals("LOGIN_REQUIRED") || status.equals("UNPLAYABLE")) {
                                android.util.Log.d("YouTubeAPI", clientName + ": " + status + ", skipping");
                                continue;
                            }
                        }

                        if (!candidate.has("streamingData")) {
                            android.util.Log.d("YouTubeAPI", clientName + ": no streamingData, skipping");
                            continue;
                        }

                        json = candidate;
                        android.util.Log.d("YouTubeAPI", clientName + ": SUCCESS");
                        break;

                    } catch (Exception e) {
                        lastError = e.getMessage();
                        android.util.Log.e("YouTubeAPI", "Client error: " + e.getMessage());
                    }
                }

                if (json == null) {
                    call.reject("Failed: " + lastError);
                    return;
                }

                org.json.JSONObject videoDetails = json.getJSONObject("videoDetails");
                org.json.JSONObject streamingData = json.getJSONObject("streamingData");

                String title = videoDetails.optString("title", "video");
                String thumbnail = "";
                try {
                    org.json.JSONArray thumbs = videoDetails
                            .getJSONObject("thumbnail")
                            .getJSONArray("thumbnails");
                    thumbnail = thumbs.getJSONObject(thumbs.length() - 1).getString("url");
                } catch (Exception ignored) {}

                org.json.JSONArray formats = streamingData.optJSONArray("formats");
                org.json.JSONArray adaptiveFormats = streamingData.optJSONArray("adaptiveFormats");
                org.json.JSONArray qualities = new org.json.JSONArray();

                if (formats != null) {
                    for (int i = 0; i < formats.length(); i++) {
                        org.json.JSONObject fmt = formats.getJSONObject(i);
                        String streamUrl = fmt.optString("url", "");
                        if (streamUrl.isEmpty()) continue;
                        String mimeType = fmt.optString("mimeType", "");
                        if (!mimeType.contains("mp4")) continue;
                        int height = fmt.optInt("height", 0);
                        String quality = fmt.optString("qualityLabel", height + "p");
                        long filesize = fmt.optLong("contentLength", 0);

                        org.json.JSONObject q = new org.json.JSONObject();
                        q.put("label", quality);
                        q.put("url", streamUrl);
                        q.put("height", height);
                        q.put("size", filesize);
                        qualities.put(q);
                    }
                }

                if (qualities.length() == 0 && adaptiveFormats != null) {
                    for (int i = 0; i < adaptiveFormats.length(); i++) {
                        org.json.JSONObject fmt = adaptiveFormats.getJSONObject(i);
                        String streamUrl = fmt.optString("url", "");
                        if (streamUrl.isEmpty()) continue;
                        String mimeType = fmt.optString("mimeType", "");
                        if (!mimeType.contains("mp4")) continue;
                        if (fmt.has("audioQuality")) continue;
                        int height = fmt.optInt("height", 0);
                        if (height == 0) continue;
                        String quality = fmt.optString("qualityLabel", height + "p");

                        org.json.JSONObject q = new org.json.JSONObject();
                        q.put("label", quality);
                        q.put("url", streamUrl);
                        q.put("height", height);
                        q.put("size", 0);
                        qualities.put(q);
                    }
                }

                android.util.Log.d("YouTubeAPI", "Found " + qualities.length() + " qualities");

                JSObject result = new JSObject();
                result.put("title", title);
                result.put("thumbnail", thumbnail);
                result.put("qualities", qualities.toString());
                result.put("platform", "youtube");
                call.resolve(result);

            } catch (Exception e) {
                android.util.Log.e("YouTubeAPI", "Fatal: " + e.getMessage());
                call.reject("Failed: " + e.getMessage());
            }
        }).start();
    }

    // ─── WhatsApp Status Saver ────────────────────────────────────────────────

    private static final int REQUEST_STATUSES_DIR = 1001;
    private PluginCall pendingStatusCall;

    @PluginMethod
    public void requestStatusPermission(PluginCall call) {
        android.content.Intent intent = new android.content.Intent(
                android.content.Intent.ACTION_OPEN_DOCUMENT_TREE
        );
        intent.addFlags(
                android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION |
                        android.content.Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
        );
        startActivityForResult(call, intent, "statusPermissionResult");
    }

    @com.getcapacitor.annotation.ActivityCallback
    private void statusPermissionResult(PluginCall call, androidx.activity.result.ActivityResult result) {
        if (result.getResultCode() == android.app.Activity.RESULT_OK) {
            android.content.Intent data = result.getData();
            if (data != null) {
                android.net.Uri treeUri = data.getData();
                getContext().getContentResolver().takePersistableUriPermission(
                        treeUri,
                        android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION
                );
                JSObject res = new JSObject();
                res.put("uri", treeUri.toString());
                call.resolve(res);
            } else {
                call.reject("No data returned");
            }
        } else {
            call.reject("Permission denied");
        }
    }

    @PluginMethod
    public void getStatuses(PluginCall call) {
        String savedUri = call.getString("uri");
        if (savedUri == null) {
            call.reject("No URI provided");
            return;
        }
        try {
            android.net.Uri treeUri = android.net.Uri.parse(savedUri);
            androidx.documentfile.provider.DocumentFile dir =
                    androidx.documentfile.provider.DocumentFile.fromTreeUri(getContext(), treeUri);

            if (dir == null || !dir.exists()) {
                call.reject("Directory not found");
                return;
            }
            android.util.Log.d("StatusSaver", "Dir exists: " + dir.exists() + " files: " + dir.listFiles().length);

            org.json.JSONArray files = new org.json.JSONArray();
            for (androidx.documentfile.provider.DocumentFile file : dir.listFiles()) {
                if (!file.isFile()) continue;
                String type = file.getType() != null ? file.getType() : "";
                if (!type.startsWith("video/") && !type.startsWith("image/")) continue;

                org.json.JSONObject fileObj = new org.json.JSONObject();
                fileObj.put("uri", file.getUri().toString());
                fileObj.put("name", file.getName());
                fileObj.put("type", type.startsWith("video/") ? "video" : "image");
                fileObj.put("size", file.length());

                // Generate base64 thumbnail for images
                if (type.startsWith("image/")) {
                    try {
                        java.io.InputStream is = getContext().getContentResolver()
                                .openInputStream(file.getUri());
                        android.graphics.BitmapFactory.Options opts =
                                new android.graphics.BitmapFactory.Options();
                        opts.inSampleSize = 4; // Downsample for thumbnail
                        android.graphics.Bitmap bitmap =
                                android.graphics.BitmapFactory.decodeStream(is, null, opts);
                        if (bitmap != null) {
                            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                            bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 60, baos);
                            String b64 = android.util.Base64.encodeToString(
                                    baos.toByteArray(), android.util.Base64.NO_WRAP);
                            fileObj.put("thumbnail", "data:image/jpeg;base64," + b64);
                            bitmap.recycle();
                        }
                        is.close();
                    } catch (Exception ignored) {}
                }
// ← ADD VIDEO THUMBNAIL BLOCK HERE
                if (type.startsWith("video/")) {
                    try {
                        android.media.MediaMetadataRetriever retriever =
                                new android.media.MediaMetadataRetriever();
                        retriever.setDataSource(getContext(), file.getUri());
                        android.graphics.Bitmap frame =
                                retriever.getFrameAtTime(0,
                                        android.media.MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                        retriever.release();
                        if (frame != null) {
                            android.graphics.Bitmap scaled = android.graphics.Bitmap.createScaledBitmap(
                                    frame, 320, 180, true);
                            frame.recycle();
                            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                            scaled.compress(android.graphics.Bitmap.CompressFormat.JPEG, 60, baos);
                            String b64 = android.util.Base64.encodeToString(
                                    baos.toByteArray(), android.util.Base64.NO_WRAP);
                            fileObj.put("thumbnail", "data:image/jpeg;base64," + b64);
                            scaled.recycle();
                        }
                    } catch (Exception ignored) {}
                }

                files.put(fileObj);
            }
            JSObject result = new JSObject();
            result.put("files", files.toString());
            call.resolve(result);

        } catch (Exception e) {
            call.reject("Failed to read statuses: " + e.getMessage());
        }
    }

    @PluginMethod
    public void saveStatusFile(PluginCall call) {
        String fileUri = call.getString("uri");
        String filename = call.getString("filename", "WA_Status_" + System.currentTimeMillis() + ".mp4");

        if (fileUri == null) {
            call.reject("URI required");
            return;
        }

        call.setKeepAlive(true);
        new Thread(() -> {
            try {
                android.net.Uri uri = android.net.Uri.parse(fileUri);
                java.io.InputStream inputStream = getContext()
                        .getContentResolver().openInputStream(uri);

                if (inputStream == null) {
                    call.reject("Cannot open file");
                    return;
                }

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                    android.content.ContentValues values = new android.content.ContentValues();
                    values.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, filename);
                    values.put(android.provider.MediaStore.Downloads.MIME_TYPE, "video/mp4");
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 1);

                    android.content.ContentResolver resolver = getContext().getContentResolver();
                    android.net.Uri collection = android.provider.MediaStore.Downloads
                            .getContentUri(android.provider.MediaStore.VOLUME_EXTERNAL_PRIMARY);
                    android.net.Uri itemUri = resolver.insert(collection, values);

                    java.io.OutputStream outputStream = resolver.openOutputStream(itemUri);
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, read);
                    }
                    outputStream.close();
                    inputStream.close();

                    values.clear();
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(itemUri, values, null, null);

                } else {
                    java.io.File destDir = android.os.Environment
                            .getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS);
                    java.io.File dest = new java.io.File(destDir, filename);
                    java.io.FileOutputStream out = new java.io.FileOutputStream(dest);
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = inputStream.read(buffer)) != -1) {
                        out.write(buffer, 0, read);
                    }
                    out.close();
                    inputStream.close();
                    MediaScannerConnection.scanFile(getContext(),
                            new String[]{dest.getAbsolutePath()}, null, null);
                }

                call.resolve();

            } catch (Exception e) {
                call.reject("Save failed: " + e.getMessage());
            }
        }).start();
    }

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_STATUSES_DIR && pendingStatusCall != null) {
            if (resultCode == android.app.Activity.RESULT_OK && data != null) {
                android.net.Uri treeUri = data.getData();

                getContext().getContentResolver().takePersistableUriPermission(
                        treeUri,
                        android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION
                );

                JSObject result = new JSObject();
                result.put("uri", treeUri.toString());
                pendingStatusCall.resolve(result);
            } else {
                pendingStatusCall.reject("Permission denied");
            }
            pendingStatusCall = null;
        }
    }
    @PluginMethod
    public void openDownloadedFile(PluginCall call) {
        String filename = call.getString("filename");
        if (filename == null) {
            call.reject("filename required");
            return;
        }

        try {
            android.net.Uri fileUri = null;

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                android.content.ContentResolver resolver = getContext().getContentResolver();
                android.net.Uri collection = android.provider.MediaStore.Downloads
                        .getContentUri(android.provider.MediaStore.VOLUME_EXTERNAL_PRIMARY);

                String[] projection = {
                        android.provider.MediaStore.Downloads._ID,
                        android.provider.MediaStore.Downloads.DISPLAY_NAME
                };

                // Try exact match first
                String selection = android.provider.MediaStore.Downloads.DISPLAY_NAME + " = ?";
                String[] selectionArgs = { filename };

                try (android.database.Cursor cursor = resolver.query(
                        collection, projection, selection, selectionArgs, null)) {
                    if (cursor != null && cursor.moveToFirst()) {
                        long id = cursor.getLong(
                                cursor.getColumnIndexOrThrow(android.provider.MediaStore.Downloads._ID));
                        fileUri = android.content.ContentUris.withAppendedId(collection, id);
                    }
                }

                // Fallback — search by first 30 chars using LIKE
                if (fileUri == null) {
                    String partial = filename.length() > 30 ? filename.substring(0, 30) : filename;
                    String selectionLike = android.provider.MediaStore.Downloads.DISPLAY_NAME + " LIKE ?";
                    String[] argsLike = { partial + "%" };

                    android.util.Log.d("Downloader", "Trying LIKE search: " + partial + "%");

                    try (android.database.Cursor cursor = resolver.query(
                            collection, projection, selectionLike, argsLike, null)) {
                        if (cursor != null && cursor.moveToFirst()) {
                            long id = cursor.getLong(
                                    cursor.getColumnIndexOrThrow(android.provider.MediaStore.Downloads._ID));
                            fileUri = android.content.ContentUris.withAppendedId(collection, id);
                            android.util.Log.d("Downloader", "Found via LIKE search");
                        }
                    }
                }

            } else {
                java.io.File file = new java.io.File(
                        android.os.Environment.getExternalStoragePublicDirectory(
                                android.os.Environment.DIRECTORY_DOWNLOADS), filename);
                if (file.exists()) {
                    fileUri = androidx.core.content.FileProvider.getUriForFile(
                            getContext(),
                            getContext().getPackageName() + ".fileprovider",
                            file
                    );
                }
            }

            if (fileUri == null) {
                call.reject("File not found in Downloads");
                return;
            }

            android.content.Intent intent = new android.content.Intent(
                    android.content.Intent.ACTION_VIEW);
            intent.setDataAndType(fileUri, "video/*");
            intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();

        } catch (Exception e) {
            call.reject("Failed to open file: " + e.getMessage());
        }
    }

}