package io.colorgy.rnapp;

import android.app.Activity;
import android.content.Context;
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

public class SystemWindowModule extends ReactContextBaseJavaModule {
    public Activity mActivity = null;
    public Context mContext = null;

    @Override
    public String getName() {
        return "SystemWindowAndroid";
    }

    public SystemWindowModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        this.mContext = reactContext;
        this.mActivity = activity;
    }

    @ReactMethod
    public void isTranslucentStatusBar(Callback errorCallback, Callback successCallback) {
        try {
            Window w = mActivity.getWindow();
            WindowManager.LayoutParams lp = w.getAttributes();
            int flags = lp.flags;

            if ((flags & WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS) == WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS) {
                successCallback.invoke(true);
            } else {
                successCallback.invoke(false);
            }

        } catch (Exception e) {
            e.printStackTrace();
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void isTranslucentActionBar(Callback errorCallback, Callback successCallback) {
        try {
            Window w = mActivity.getWindow();
            WindowManager.LayoutParams lp = w.getAttributes();
            int flags = lp.flags;

            if ((flags & WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION) == WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION) {
                successCallback.invoke(true);
            } else {
                successCallback.invoke(false);
            }

        } catch (Exception e) {
            e.printStackTrace();
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void getStatusBarHeight(Callback errorCallback, Callback successCallback) {
        try {
            Class<?> c = null;
            Object obj = null;
            Field field = null;
            int x = 0, statusBarHeight = 0;

            c = Class.forName("com.android.internal.R$dimen");
            obj = c.newInstance();
            field = c.getField("status_bar_height");
            x = Integer.parseInt(field.get(obj).toString());
            statusBarHeight = mContext.getResources().getDimensionPixelSize(x);

            successCallback.invoke(statusBarHeight);

        } catch (Exception e) {
            e.printStackTrace();
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void getActionBarHeight(Callback errorCallback, Callback successCallback) {
        try {
            TypedValue tv = new TypedValue();
            int actionBarHeight = 0;
            if (mContext.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
                actionBarHeight = TypedValue.complexToDimensionPixelSize(tv.data, mContext.getResources().getDisplayMetrics());
            }

            successCallback.invoke(actionBarHeight);

        } catch (Exception e) {
            e.printStackTrace();
            errorCallback.invoke(e.getMessage());
        }
    }
}
