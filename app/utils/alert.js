import { ToastAndroid } from 'react-native';

const alert = function(message, duration = 'short') {
  if (duration === 'short') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    ToastAndroid.show(message, ToastAndroid.LOGN);
  }
}

export default alert;
