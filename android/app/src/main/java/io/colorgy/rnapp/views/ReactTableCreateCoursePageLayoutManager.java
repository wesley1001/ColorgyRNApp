package io.colorgy.rnapp.views;

import javax.annotation.Nullable;

import android.support.v7.widget.Toolbar;
import android.view.View;
import android.support.design.widget.CollapsingToolbarLayout;
import android.widget.LinearLayout;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class ReactTableCreateCoursePageLayoutManager extends ViewGroupManager<ReactTableCreateCoursePageLayout> {

    @Override
    public String getName() {
        return "RCTTableCreateCoursePageLayoutAndroid";
    }

    @Override
    public ReactTableCreateCoursePageLayout createViewInstance(ThemedReactContext context) {
        return new ReactTableCreateCoursePageLayout(context);
    }

    @Override
    public void addView(ReactTableCreateCoursePageLayout view, View child, int index) {
        if (child instanceof Toolbar) {
            view.toolbarIndex = index;
            view.mToolbar = (Toolbar) child;

            CollapsingToolbarLayout.LayoutParams params = new CollapsingToolbarLayout.LayoutParams(CollapsingToolbarLayout.LayoutParams.MATCH_PARENT, view.toolbarHeight);
            params.setCollapseMode(CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN);
            child.setLayoutParams(params);
            child.setPadding(0, view.toolbarPaddingTop, 0, 0);

            view.mCollapsingToolbarLayout.addView(child);
        } else {
            view.mContent.addView(child, index);
        }

        view.setup();
    }

    @Override
    public int getChildCount(ReactTableCreateCoursePageLayout view) {
        int vChildrenCount = 0;
        if (view.toolbarIndex != null) vChildrenCount += 1;

        return view.mContent.getChildCount() + vChildrenCount;
    }

    @Override
    public View getChildAt(ReactTableCreateCoursePageLayout view, int index) {
        if (view.toolbarIndex == index) {
            return view.mToolbar;
        } else {
            return view.mContent.getChildAt(index);
        }
    }

    @Override
    public void removeViewAt(ReactTableCreateCoursePageLayout view, int index) {
        if (view.toolbarIndex == index) {
            view.mCollapsingToolbarLayout.removeView(view.mToolbar);
            view.toolbarIndex = null;
        } else {
            view.mContent.removeViewAt(index);
        }
    }

    @Override
    public void removeAllViews(ReactTableCreateCoursePageLayout view) {
        view.mContent.removeAllViews();
        view.mCollapsingToolbarLayout.removeAllViews();
    }

    @ReactProp(name = "toolbarTitle")
    public void setToolbarTitle(ReactTableCreateCoursePageLayout view, String title) {
        view.mCollapsingToolbarLayout.setTitle(title);
    }

    @ReactProp(name = "toolbarTitleColor", customType = "Color")
    public void setToolbarTitleColor(ReactTableCreateCoursePageLayout view, int color) {
        view.mCollapsingToolbarLayout.setCollapsedTitleTextColor(color);
    }

    @ReactProp(name = "toolbarExpandedTitleColor", customType = "Color")
    public void setToolbarExpandedTitleColor(ReactTableCreateCoursePageLayout view, int color) {
        view.mCollapsingToolbarLayout.setExpandedTitleColor(color);
    }

    @ReactProp(name = "toolbarHeight")
    public void setToolbarHeight(ReactTableCreateCoursePageLayout view, int height) {
        view.toolbarHeight = height;

        LinearLayout.LayoutParams sParams = (LinearLayout.LayoutParams) view.mInputsSpaceTop.getLayoutParams();
        sParams.height = height;

        if (null == view.mToolbar) return;
        CollapsingToolbarLayout.LayoutParams params = (CollapsingToolbarLayout.LayoutParams) view.mToolbar.getLayoutParams();
        params.height = height;
        view.mCollapsingToolbarLayout.setMinimumHeight(height);
    }

    @ReactProp(name = "toolbarPaddingTop")
    public void setToolbarPaddingTop(ReactTableCreateCoursePageLayout view, int paddingTop) {
        view.toolbarPaddingTop = paddingTop;
        if (null == view.mToolbar) return;
        view.mToolbar.setPadding(0, paddingTop, 0, 0);
    }

    @ReactProp(name = "contentScrimColor", customType = "Color")
    public void setContentScrimColor(ReactTableCreateCoursePageLayout view, int color) {
        view.mCollapsingToolbarLayout.setContentScrimColor(color);
        view.mCollapsingToolbarLayout.setBackgroundColor(color);
    }

    @ReactProp(name = "primaryInputInitialValue")
    public void setPrimaryInputInitialValue(ReactTableCreateCoursePageLayout view, String value) {
        if (view.primaryInputInitialized) return;
        view.mPrimaryEditText.setText(value);
        view.primaryInputInitialized = true;
    }

    @ReactProp(name = "secondaryInputInitialValue")
    public void setSecondaryInputInitialValue(ReactTableCreateCoursePageLayout view, String value) {
        if (view.secondaryInputInitialized) return;
        view.mSecondaryEditText.setText(value);
        view.secondaryInputInitialized = true;
    }

    @ReactProp(name = "primaryInputLabel")
    public void setPrimaryInputLabel(ReactTableCreateCoursePageLayout view, String value) {
        view.mPrimaryTextInputLayout.setHint(value);
    }

    @ReactProp(name = "secondaryInputLabel")
    public void setSecondaryInputLabel(ReactTableCreateCoursePageLayout view, String value) {
        view.mSecondaryTextInputLayout.setHint(value);
    }

    @ReactProp(name = "primaryInputHint")
    public void setPrimaryInputHint(ReactTableCreateCoursePageLayout view, String value) {
        view.mPrimaryEditText.setHint(value);
    }

    @ReactProp(name = "secondaryInputHint")
    public void setSecondaryInputHint(ReactTableCreateCoursePageLayout view, String value) {
        view.mSecondaryEditText.setHint(value);
    }

    public static final int COMMAND_SET_LAYOUT = 1;

    @Override
    public Map<String,Integer> getCommandsMap() {
        return MapBuilder.of(
            "setLayout",
            COMMAND_SET_LAYOUT
        );
    }

    @Override
    public void receiveCommand(ReactTableCreateCoursePageLayout view, int commandType, @Nullable ReadableArray args) {
        switch (commandType) {
            case COMMAND_SET_LAYOUT: {
                if (null != view.mToolbar) {
                    CollapsingToolbarLayout.LayoutParams params = new CollapsingToolbarLayout.LayoutParams(CollapsingToolbarLayout.LayoutParams.MATCH_PARENT, view.toolbarHeight);
                        params.setCollapseMode(CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN);
                        view.mToolbar.setLayoutParams(params);
                        view.mToolbar.setPadding(0, view.toolbarPaddingTop, 0, 0);
                }
                view.postInvalidate();
                return;
            }
            default:
                throw new JSApplicationIllegalArgumentException(String.format(
                    "Unsupported command %d received by %s.",
                    commandType,
                    getClass().getSimpleName()));
        }
    }
}
