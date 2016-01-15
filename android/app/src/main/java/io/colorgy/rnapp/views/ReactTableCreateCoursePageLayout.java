package io.colorgy.rnapp.views;
import io.colorgy.rnapp.R;

import android.content.Context;
import android.support.design.widget.CollapsingToolbarLayout;
import android.support.design.widget.TextInputLayout;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.Space;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ReactTableCreateCoursePageLayout extends FrameLayout {
    public View mView;
    public LinearLayout mContent;
    public Toolbar mToolbar;
    public CollapsingToolbarLayout mCollapsingToolbarLayout;
    public EditText mPrimaryEditText;
    public EditText mSecondaryEditText;
    public TextInputLayout mPrimaryTextInputLayout;
    public TextInputLayout mSecondaryTextInputLayout;
    public Space mInputsSpaceTop;

    public Integer toolbarIndex;
    public int toolbarHeight = 0;
    public int toolbarPaddingTop = 0;

    public boolean primaryInputInitialized = false;
    public boolean secondaryInputInitialized = false;

    public ReactTableCreateCoursePageLayout(Context context) {
        super(context);
        LayoutInflater layoutInflater = LayoutInflater.from(context);
        View view = layoutInflater.inflate(R.layout.table_create_course_page_layout, this, false);
        this.addView(view);

        mView = view;

        mContent = (LinearLayout) findViewById(R.id.table_create_course_page_layout_main_content);
        mCollapsingToolbarLayout = (CollapsingToolbarLayout) findViewById(R.id.table_create_course_page_layout_collapsing_toolbar_layout);
        mPrimaryEditText = (EditText) findViewById(R.id.table_create_course_page_layout_primary_edittext);
        mSecondaryEditText = (EditText) findViewById(R.id.table_create_course_page_layout_secondary_edittext);
        mPrimaryTextInputLayout = (TextInputLayout) findViewById(R.id.table_create_course_page_layout_primary_inputlayout);
        mSecondaryTextInputLayout = (TextInputLayout) findViewById(R.id.table_create_course_page_layout_secondary_inputlayout);
        mInputsSpaceTop = (Space) findViewById(R.id.table_create_course_page_layout_inputs_space_top);

        mPrimaryEditText.addTextChangedListener(new TextWatcher() {
            public void afterTextChanged(Editable s) {}
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                onReceiveNativeEvent("primaryInputChange", String.valueOf(s));
            }
        });

        mSecondaryEditText.addTextChangedListener(new TextWatcher() {
            public void afterTextChanged(Editable s) {}
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                onReceiveNativeEvent("secondaryInputChange", String.valueOf(s));
            }
        });

        setup();
    }

    public void setup() {
        setupUI(this);
    }

    private void setupUI(View view) {
        // Set up touch listener for non-text box views to hide keyboard.
        if(!(view instanceof EditText)) {
            // view.setFocusable(true);
            // view.setFocusableInTouchMode(true);
            view.setOnTouchListener(new OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    hideSoftKeyboard();
                    mView.requestFocus();
                    return false;
                }
            });
        }

        // If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                setupUI(innerView);
            }
        }
    }

    private void onReceiveNativeEvent(String eventType, String eventString) {
        WritableMap event = Arguments.createMap();
        event.putString("type", eventType);
        event.putString("string", eventString);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            "topChange",
            event
        );
    }

    private void hideSoftKeyboard() {
        ReactContext reactContext = (ReactContext) getContext();
        InputMethodManager inputMethodManager = (InputMethodManager) reactContext.getSystemService(Context.INPUT_METHOD_SERVICE);
        inputMethodManager.hideSoftInputFromWindow(getWindowToken(), 0);
    }
}
