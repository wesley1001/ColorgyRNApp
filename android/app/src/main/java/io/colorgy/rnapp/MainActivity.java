package io.colorgy.rnapp;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.learnium.RNDeviceInfo.*;
import org.pgsqlite.SQLitePluginPackage;
import com.reactnativega.GoogleAnalyticsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.oney.gcm.GcmPackage;
import io.neson.react.notification.NotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativeandroiddesignsupport.DesignSupportPackage;
import me.neo.react.StatusBarPackage;
import com.imagepicker.ImagePickerPackage;
import com.heng.wheel.WheelPackage;
import com.reactImageWand.*;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
    private ImagePickerPackage mImagePicker;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ColorgyRNApp";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

   /**
   * A list of packages used by the app. If the app uses additional views
   * or modules besides the default ones, add more packages here.
   */
    @Override
    protected List<ReactPackage> getPackages() {
        // mImagePicker = new ImagePickerPackage(this);

        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNDeviceInfo(),
            new SQLitePluginPackage(this),
            new GoogleAnalyticsPackage(this),
            new FacebookLoginPackage(),
            new GcmPackage(),
            new NotificationPackage(this),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new DesignSupportPackage(this),
            new StatusBarPackage(this),
            new WheelPackage(),
            new ImagePickerPackage(),
            new AppNativePackage(this),
            new RNImageWandPackage()
        );
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }
}
