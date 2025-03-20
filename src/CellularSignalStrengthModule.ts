import { NativeModule, requireNativeModule } from 'expo';

declare class CellularSignalStrengthModule extends NativeModule{
  signalStrength?: number;
  startListeningToSignalStrength(): void;
  stopListeningToSignalStrength(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CellularSignalStrengthModule>('CellularSignalStrength');
