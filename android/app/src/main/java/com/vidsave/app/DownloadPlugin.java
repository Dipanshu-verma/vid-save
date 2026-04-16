//package com.vidsave.app;
//
//import android.app.DownloadManager;
//import android.content.Context;
//import android.net.Uri;
//import android.os.Environment;
//import com.getcapacitor.Plugin;
//import com.getcapacitor.PluginCall;
//import com.getcapacitor.PluginMethod;
//import com.getcapacitor.annotation.CapacitorPlugin;
//
//@CapacitorPlugin(name = "Downloader")
//public class DownloadPlugin extends Plugin {
//
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
//        try {
//            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
//            request.setTitle(filename);
//            request.setDescription("Downloading via VidSave");
//            request.setNotificationVisibility(
//                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
//            );
//            request.setDestinationInExternalPublicDir(
//                    Environment.DIRECTORY_DOWNLOADS, filename
//            );
//            request.allowScanningByMediaScanner();
//            request.setAllowedOverMetered(true);
//            request.setAllowedOverRoaming(true);
//
//            DownloadManager dm = (DownloadManager) getContext()
//                    .getSystemService(Context.DOWNLOAD_SERVICE);
//            dm.enqueue(request);
//
//            call.resolve();
//        } catch (Exception e) {
//            call.reject("Download failed: " + e.getMessage());
//        }
//    }
//}

package com.vidsave.app;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.media.MediaScannerConnection;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

@CapacitorPlugin(name = "Downloader")
public class DownloadPlugin extends Plugin {

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String filename = call.getString("filename", "video.mp4");

        if (url == null) {
            call.reject("URL is required");
            return;
        }

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle(filename);
            request.setDescription("Downloading via VidSave");
            request.setNotificationVisibility(
                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            );
            request.setDestinationInExternalPublicDir(
                    Environment.DIRECTORY_DOWNLOADS, filename
            );
            request.setAllowedOverMetered(true);
            request.setAllowedOverRoaming(true);
            request.setMimeType("video/mp4");

            DownloadManager dm = (DownloadManager) getContext()
                    .getSystemService(Context.DOWNLOAD_SERVICE);

            long downloadId = dm.enqueue(request);

            // Start a thread to wait for download and trigger media scan
            new Thread(() -> {
                boolean downloading = true;
                while (downloading) {
                    DownloadManager.Query q = new DownloadManager.Query();
                    q.setFilterById(downloadId);
                    android.database.Cursor cursor = dm.query(q);
                    if (cursor != null && cursor.moveToFirst()) {
                        int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                        int status = cursor.getInt(statusIndex);
                        if (status == DownloadManager.STATUS_SUCCESSFUL) {
                            downloading = false;
                            // Trigger media scan so file shows correct duration
                            File file = new File(
                                    Environment.getExternalStoragePublicDirectory(
                                            Environment.DIRECTORY_DOWNLOADS), filename
                            );
                            MediaScannerConnection.scanFile(
                                    getContext(),
                                    new String[]{ file.getAbsolutePath() },
                                    new String[]{ "video/mp4" },
                                    (path, uri) -> {
                                        // Media scan complete — file now shows correct duration
                                    }
                            );
                        } else if (status == DownloadManager.STATUS_FAILED) {
                            downloading = false;
                        }
                        cursor.close();
                    } else {
                        downloading = false;
                    }
                    try { Thread.sleep(1000); } catch (InterruptedException e) { break; }
                }
            }).start();

            call.resolve();
        } catch (Exception e) {
            call.reject("Download failed: " + e.getMessage());
        }
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
                new String[]{ "video/mp4" },
                (scannedPath, uri) -> call.resolve()
        );
    }
}