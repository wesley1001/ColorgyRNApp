import { SnackbarAndroid } from 'react-native-android-design-support';

const alert = function(message, duration = 'long') {
  if (duration === 'long') {
    SnackbarAndroid.show(message, SnackbarAndroid.LONG);
  } else {
    SnackbarAndroid.show(message, SnackbarAndroid.SHORT);
  }
}

export default alert;
