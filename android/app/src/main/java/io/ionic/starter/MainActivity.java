package io.ionic.starter;

import android.os.Bundle;

import com.capacitorjs.plugins.clipboard.ClipboardPlugin;
import com.capacitorjs.plugins.keyboard.KeyboardPlugin;
import com.capacitorjs.plugins.statusbar.StatusBarPlugin;
import com.capacitorjs.plugins.storage.StoragePlugin;
import com.equimaps.capacitor_background_geolocation.BackgroundGeolocation;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(KeyboardPlugin.class);
    registerPlugin(StatusBarPlugin.class);
    registerPlugin(StoragePlugin.class);
    registerPlugin(ClipboardPlugin.class);
    //registerPlugin(BackgroundGeolocation.class);
  }
}
