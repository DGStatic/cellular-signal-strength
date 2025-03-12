import { requireNativeView } from 'expo';
import * as React from 'react';

import { CellularSignalStrengthViewProps } from './CellularSignalStrength.types';

const NativeView: React.ComponentType<CellularSignalStrengthViewProps> =
  requireNativeView('CellularSignalStrength');

export default function CellularSignalStrengthView(props: CellularSignalStrengthViewProps) {
  return <NativeView {...props} />;
}
