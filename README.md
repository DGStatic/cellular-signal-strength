# cellular-signal-strength

A React Native module for monitoring cellular signal strength.

## Compatbility

This module is for **Android** only, and it requires minimum SDK level of **31**. It won't crash your iOS app by existing, but it will throw errors when you use its features.

## Installation

```sh
npm install cellular-signal-strength
```

## Usage

Importing the CellularSignalStrength class

```js
import { CellularSignalStrength } from "cellular-signal-strength";
```

Creating a CellularSignalStrength instance

```js
const SignalStrength = new CellularSignalStrength();
```

Monitoring signal strength

```js
try {
  SignalStrength.monitorCellularSignalStrength((signalStrength) =>
    // do something with the signal strength
  );
} catch (err) {
  // handle an error
}

// ...
SignalStrength.stopMonitoringSignalStrength(); // Use a try-catch if you use it on iOS
```

Make sure to stop monitoring when your app closes

```js
useEffect(() => {
  // ...

  return () => {
    SignalStrength.stopMonitoringSignalStrength();
  };
}, []);
```

## Permissions

You must add ACCESS_NETWORK_STATE and READ_PHONE_STATE permissions to your Android Manifest.

### Using Expo

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.READ_PHONE_STATE"
      ]
    }
  }
}
```

### Manual

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

### Requesting Permission

A permission request for READ_PHONE_STATE is required for the module to function.

```js
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  {
    title: "Phone State Permission",
    message:
      "This app needs access to your phone state in order to monitor your cellular connection.",
    buttonPositive: "OK",
  }
);
if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  console.log("READ_PHONE_STATE permission granted");
} else {
  console.log("READ_PHONE_STATE permission denied");
}
```

## License

[MIT](./LICENSE)

---

Made with [create-expo-module](https://www.npmjs.com/package/create-expo-module)
