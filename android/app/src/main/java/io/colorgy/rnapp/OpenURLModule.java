package io.colorgy.rnapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.WindowManager;
import android.view.Window;
import android.util.TypedValue;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.lang.reflect.Field;

public class OpenURLModule extends ReactContextBaseJavaModule {
    public Activity mActivity = null;
    public Context mContext = null;

    @Override
    public String getName() {
        return "OpenURLAndroid";
    }

    public OpenURLModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        this.mContext = reactContext;
        this.mActivity = activity;
    }

    @ReactMethod
    public void openURL(String url, Callback errorCallback, Callback successCallback) {
        try {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

            browserIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            mContext.startActivity(browserIntent);

            successCallback.invoke();

        } catch (Exception e) {
            e.printStackTrace();
            errorCallback.invoke(e.getMessage());
        }
    }
}
