# Colorgy App with React Native

Colorgy mobile app on Android, using [React Native](https://facebook.github.io/react-native/) and [Redux](https://github.com/rackt/redux).


## Development Setup

```bash
./bin/setup
```

Then edit `config.js` (automatically copied from `sample.config.js` if not exists) to set the configurations.

### Run on Android

```bash
react-native run-android
```


## Build

### Android

Edit `~/.gradle/gradle.properties`, fill in the necessary properties:

```
ANDROID_APP_RELEASE_STORE_FILE=
ANDROID_APP_RELEASE_STORE_PASSWORD=
ANDROID_APP_RELEASE_KEY_ALIAS=
ANDROID_APP_RELEASE_KEY_PASSWORD=
```

then run:

```bash
bin/build-android
```

The signed apk will locate at `android/app/build/outputs/apk`.
