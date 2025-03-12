import { NativeModule, requireNativeModule } from 'expo';

import { CellularSignalStrengthModuleEvents } from './CellularSignalStrength.types';

declare class CellularSignalStrengthModule extends NativeModule<CellularSignalStrengthModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CellularSignalStrengthModule>('CellularSignalStrength');
