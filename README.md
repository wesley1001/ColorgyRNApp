# Colorgy App with React Native

Colorgy mobile app on Android, using [React Native](https://facebook.github.io/react-native/) and [Redux](https://github.com/rackt/redux).


## Development Setup

```bash
./bin/setup
```

## Build

Edit `~/.gradle/gradle.properties`, fill in the necessary properties:

```
ANDROID_APP_RELEASE_STORE_FILE=
ANDROID_APP_RELEASE_STORE_PASSWORD=
ANDROID_APP_RELEASE_KEY_ALIAS=
ANDROID_APP_RELEASE_KEY_PASSWORD=
```

then run:

```bash
cd android && ./gradlew assembleRelease
```

The signed apk will locate at `android/app/build/outputs/apk`.
