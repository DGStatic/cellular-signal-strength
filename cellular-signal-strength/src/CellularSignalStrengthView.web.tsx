import * as React from 'react';

import { CellularSignalStrengthViewProps } from './CellularSignalStrength.types';

export default function CellularSignalStrengthView(props: CellularSignalStrengthViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
