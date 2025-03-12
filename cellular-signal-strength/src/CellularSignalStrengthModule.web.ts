import { registerWebModule, NativeModule } from 'expo';

import { CellularSignalStrengthModuleEvents } from './CellularSignalStrength.types';

class CellularSignalStrengthModule extends NativeModule<CellularSignalStrengthModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(CellularSignalStrengthModule);
