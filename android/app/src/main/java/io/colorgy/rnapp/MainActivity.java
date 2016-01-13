package io.colorgy.rnapp;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.content.Intent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.learnium.RNDeviceInfo.*;
import org.pgsqlite.SQLitePluginPackage;
import com.reactnativega.GoogleAnalyticsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativeandroiddesignsupport.DesignSupportPackage;
import me.neo.react.StatusBarPackage;
import com.heng.wheel.WheelPackage;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    private FacebookLoginPackage mFacebookLoginPackage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        mFacebookLoginPackage = new FacebookLoginPackage(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new RNDeviceInfo())
                .addPackage(new SQLitePluginPackage(this))
                .addPackage(new GoogleAnalyticsPackage(this))
                .addPackage(mFacebookLoginPackage)
                .addPackage(new LinearGradientPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new DesignSupportPackage(this))
                .addPackage(new StatusBarPackage(this))
                .addPackage(new WheelPackage())
                .addPackage(new AppNativePackage(this))
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "ColorgyRNApp", null);

        setContentView(mReactRootView);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        mFacebookLoginPackage.handleActivityResult(requestCode, resultCode, data);
    }
}
