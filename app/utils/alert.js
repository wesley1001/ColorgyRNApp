import { ToastAndroid } from 'react-native';

const alert = function(message, duration = 'long') {
  if (duration === 'long') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

export default alert;
