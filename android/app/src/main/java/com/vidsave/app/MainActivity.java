//package com.vidsave.app;
//
//import com.getcapacitor.BridgeActivity;
//
//public class MainActivity extends BridgeActivity {}

package com.vidsave.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DownloadPlugin.class);
        super.onCreate(savedInstanceState);
    }
}