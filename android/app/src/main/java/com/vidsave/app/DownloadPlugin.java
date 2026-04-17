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
                            File file = new File(
                                    Environment.getExternalStoragePublicDirectory(
                                            Environment.DIRECTORY_DOWNLOADS), filename
                            );
                            MediaScannerConnection.scanFile(
                                    getContext(),
                                    new String[]{ file.getAbsolutePath() },
                                    new String[]{ "video/mp4" },
                                    (path, uri) -> {}
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
}