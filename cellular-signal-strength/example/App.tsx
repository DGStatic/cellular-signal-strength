import { CellularSignalStrength } from "cellular-signal-strength";
import { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";

export default function App() {
  const [signalStrengthDb, setSignalStrengthDb] = useState<
    number | undefined
  >();
  const SignalStrength = useRef<CellularSignalStrength>(
    new CellularSignalStrength()
  );

  const requestPhoneStatePermission = async () => {
    try {
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
    } catch (err) {
      console.warn(err);
    }
  };

  const startReadingSignalStrength = () => {
    try {
      SignalStrength.current.monitorCellularSignalStrength(setSignalStrengthDb);
    } catch (err) {
      ToastAndroid.show((err as Error).message, ToastAndroid.LONG);
    }
  };

  const stopReadingSignalStrength = () => {
    SignalStrength.current.stopMonitoringCellularSignalStrength();
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      requestPhoneStatePermission();
    }

    return () => {
      SignalStrength.current.stopMonitoringCellularSignalStrength();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableHighlight
          style={styles.button}
          onPress={startReadingSignalStrength}
        >
          <Text>Start Reading</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={stopReadingSignalStrength}
        >
          <Text>Stop Reading</Text>
        </TouchableHighlight>
        <Text>Signal Strength:</Text>
        <Text>{signalStrengthDb ? `${signalStrengthDb} dB` : `Unknown`}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  content: {},
  button: {
    padding: 8,
    backgroundColor: "white",
    borderWidth: 2,
  },
};
