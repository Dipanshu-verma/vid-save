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
//                File destDir = Environment.getExternalStoragePublicDirectory(
//                        Environment.DIRECTORY_DOWNLOADS
//                );
//                if (!destDir.exists()) destDir.mkdirs();
//
//                // Delete existing file if any
//                File destFile = new File(destDir, filename);
//                if (destFile.exists()) destFile.delete();
//
//                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
//                request.setTitle(filename.replace("_", " ").replace(".mp4", ""));
//                request.setDescription("Downloading...");
//                request.setNotificationVisibility(
//                        DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
//                );
//                request.setDestinationInExternalPublicDir(
//                        Environment.DIRECTORY_DOWNLOADS, filename
//                );
//                request.setAllowedOverMetered(true);
//                request.setAllowedOverRoaming(true);
//                request.setMimeType("video/mp4");
//                request.setAllowedNetworkTypes(
//                        DownloadManager.Request.NETWORK_WIFI |
//                                DownloadManager.Request.NETWORK_MOBILE
//                );
//                request.addRequestHeader("Accept", "video/mp4,video/*,*/*");
//                request.addRequestHeader("User-Agent", "Mozilla/5.0");
//
//                DownloadManager dm = (DownloadManager) getContext()
//                        .getSystemService(Context.DOWNLOAD_SERVICE);
//                long downloadId = dm.enqueue(request);
//
//                android.util.Log.d("Downloader", "Download started: " + filename + " id=" + downloadId);
//
//                // Poll until complete
//                boolean downloading = true;
//                int retries = 0;
//                int maxRetries = 3;
//                long currentId = downloadId;
//
//                while (downloading) {
//                    try { Thread.sleep(1000); } catch (InterruptedException e) { break; }
//
//                    DownloadManager.Query q = new DownloadManager.Query();
//                    q.setFilterById(currentId);
//                    android.database.Cursor cursor = dm.query(q);
//
//                    if (cursor == null || !cursor.moveToFirst()) {
//                        cursor.close();
//                        downloading = false;
//                        call.reject("Download lost");
//                        break;
//                    }
//
//                    int statusCol = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
//                    int reasonCol = cursor.getColumnIndex(DownloadManager.COLUMN_REASON);
//                    int bytesCol = cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
//                    int totalCol = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);
//
//                    int status = cursor.getInt(statusCol);
//                    int reason = cursor.getInt(reasonCol);
//                    long downloaded = cursor.getLong(bytesCol);
//                    long total = cursor.getLong(totalCol);
//                    cursor.close();
//
//                    android.util.Log.d("Downloader", "Status: " + status + " bytes: " + downloaded + "/" + total);
//
//                    if (status == DownloadManager.STATUS_SUCCESSFUL) {
//                        downloading = false;
//
//                        // Scan file so it appears in gallery
//                        File file = new File(destDir, filename);
//                        MediaScannerConnection.scanFile(
//                                getContext(),
//                                new String[]{ file.getAbsolutePath() },
//                                new String[]{ "video/mp4" },
//                                null
//                        );
//
//                        android.util.Log.d("Downloader", "Download complete: " + filename);
//                        call.resolve();
//
//                    } else if (status == DownloadManager.STATUS_FAILED) {
//                        android.util.Log.e("Downloader", "Download failed reason: " + reason + " retry: " + retries);
//                        dm.remove(currentId);
//
//                        if (retries < maxRetries) {
//                            retries++;
//                            try { Thread.sleep(2000); } catch (InterruptedException e) { break; }
//
//                            // Retry
//                            DownloadManager.Request retryReq = new DownloadManager.Request(Uri.parse(url));
//                            retryReq.setTitle(filename.replace("_", " ").replace(".mp4", ""));
//                            retryReq.setDescription("Retrying... (" + retries + "/" + maxRetries + ")");
//                            retryReq.setNotificationVisibility(
//                                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
//                            );
//                            retryReq.setDestinationInExternalPublicDir(
//                                    Environment.DIRECTORY_DOWNLOADS, filename
//                            );
//                            retryReq.setAllowedOverMetered(true);
//                            retryReq.setAllowedOverRoaming(true);
//                            retryReq.setMimeType("video/mp4");
//                            retryReq.setAllowedNetworkTypes(
//                                    DownloadManager.Request.NETWORK_WIFI |
//                                            DownloadManager.Request.NETWORK_MOBILE
//                            );
//                            retryReq.addRequestHeader("Accept", "video/mp4,video/*,*/*");
//                            retryReq.addRequestHeader("User-Agent", "Mozilla/5.0");
//
//                            currentId = dm.enqueue(retryReq);
//                            android.util.Log.d("Downloader", "Retry enqueued id=" + currentId);
//                        } else {
//                            downloading = false;
//                            call.reject("Download failed after " + maxRetries + " retries");
//                        }
//                    }
//                }
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

        if (url == null) {
            call.reject("URL is required");
            return;
        }

        call.setKeepAlive(true);

        new Thread(() -> {
            try {
                android.util.Log.d("Downloader", "Starting download: " + filename);

                okhttp3.OkHttpClient client = new okhttp3.OkHttpClient.Builder()
                        .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
                        .readTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
                        .writeTimeout(300, java.util.concurrent.TimeUnit.SECONDS)
                        .build();

                okhttp3.Request request = new okhttp3.Request.Builder()
                        .url(url)
                        .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36")
                        .addHeader("Accept", "video/mp4,video/*,*/*")
                        .build();

                okhttp3.Response response = client.newCall(request).execute();

                if (!response.isSuccessful()) {
                    call.reject("Download failed: HTTP " + response.code());
                    return;
                }

                okhttp3.ResponseBody body = response.body();
                if (body == null) {
                    call.reject("Empty response body");
                    return;
                }

                java.io.InputStream inputStream = body.byteStream();
                long downloaded = 0;

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                    // Android 10+ — use MediaStore
                    android.content.ContentValues values = new android.content.ContentValues();
                    values.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, filename);
                    values.put(android.provider.MediaStore.Downloads.MIME_TYPE, "video/mp4");
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 1);

                    android.content.ContentResolver resolver = getContext().getContentResolver();
                    android.net.Uri collection = android.provider.MediaStore.Downloads.getContentUri(
                            android.provider.MediaStore.VOLUME_EXTERNAL_PRIMARY
                    );
                    android.net.Uri itemUri = resolver.insert(collection, values);

                    if (itemUri == null) {
                        call.reject("Failed to create file in MediaStore");
                        return;
                    }

                    java.io.OutputStream outputStream = resolver.openOutputStream(itemUri);
                    if (outputStream == null) {
                        call.reject("Failed to open output stream");
                        return;
                    }

                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, read);
                        downloaded += read;
                    }

                    outputStream.flush();
                    outputStream.close();
                    inputStream.close();

                    // Mark as complete
                    values.clear();
                    values.put(android.provider.MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(itemUri, values, null, null);

                    android.util.Log.d("Downloader", "Download complete via MediaStore: " + filename + " size: " + downloaded);

                } else {
                    // Android 9 and below — use direct file
                    File destDir = Environment.getExternalStoragePublicDirectory(
                            Environment.DIRECTORY_DOWNLOADS
                    );
                    if (!destDir.exists()) destDir.mkdirs();
                    File destFile = new File(destDir, filename);
                    if (destFile.exists()) destFile.delete();

                    java.io.FileOutputStream outputStream = new java.io.FileOutputStream(destFile);
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, read);
                        downloaded += read;
                    }
                    outputStream.flush();
                    outputStream.close();
                    inputStream.close();

                    MediaScannerConnection.scanFile(
                            getContext(),
                            new String[]{ destFile.getAbsolutePath() },
                            new String[]{ "video/mp4" },
                            null
                    );

                    android.util.Log.d("Downloader", "Download complete via File: " + filename);
                }

                // Show download complete notification
                String notifTitle = filename.replace("_", " ").replace(".mp4", "");
                android.app.NotificationManager notificationManager =
                        (android.app.NotificationManager) getContext()
                                .getSystemService(android.content.Context.NOTIFICATION_SERVICE);

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    android.app.NotificationChannel channel = new android.app.NotificationChannel(
                            "download_channel",
                            "Downloads",
                            android.app.NotificationManager.IMPORTANCE_DEFAULT
                    );
                    channel.setDescription("Download notifications");
                    notificationManager.createNotificationChannel(channel);
                }

                android.app.Notification notification = new android.app.Notification.Builder(
                        getContext(), "download_channel")
                        .setContentTitle("Download Complete ✓")
                        .setContentText(notifTitle)
                        .setSmallIcon(android.R.drawable.stat_sys_download_done)
                        .setAutoCancel(true)
                        .build();

                notificationManager.notify((int) System.currentTimeMillis(), notification);

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
}