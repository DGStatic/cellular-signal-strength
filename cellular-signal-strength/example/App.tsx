import { CellularSignalStrength } from "cellular-signal-strength";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, TouchableHighlight, View } from "react-native";

export default function App() {
  const [signalStrengthDb, setSignalStrengthDb] = useState<number | null>(null);
  const SignalStrength = useRef<CellularSignalStrength>(
    new CellularSignalStrength()
  );

  const startReadingSignalStrength = () => {
    SignalStrength.current.monitorCellularSignalStrength(setSignalStrengthDb);
  };

  const stopReadingSignalStrength = () => {
    SignalStrength.current.stopMonitoringCellularSignalStrength();
  };

  useEffect(() => {
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
        <Text>{signalStrengthDb} dB</Text>
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
