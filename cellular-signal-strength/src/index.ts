import CellularSignalStrengthModule from "./CellularSignalStrengthModule";

const UPDATE_INTERVAL = 1_000;

export class CellularSignalStrength {
  private _intervalId: number | null;
  private signalStrength?: number;

  /**
   * Creates a cellular signal strength object
   */
  constructor() {
    this._intervalId = null;
  }

  private set intervalId(id: number | null) {
    this._intervalId = id;
  }

  private get intervalId(): number | null {
    return this._intervalId;
  }

  /**
   * Gets the current signal strength in decibels (dB).
   * You must be monitoring the cell signal strength to get a relevant value.
   *
   * @returns {number | undefined}
   */
  public getSignalStrength = (): number | undefined => {
    return CellularSignalStrengthModule.signalStrength;
  };

  /**
   * Starts monitoring cellular signal strength. Checks for updates every second, by default, then calls the listener if there is an update.
   *
   * @param listener Callback that receives an updated celluler signal strength value in decibels (dB).
   * @param {number} updateInterval Amount of milliseconds to wait between checking for updates. Minimum value is 1000, as signal strength does not usually update fast enough for values lower than that to be effective.
   */
  public monitorCellularSignalStrength = (
    listener: (signalStrength: number) => void,
    updateInterval?: number
  ) => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    CellularSignalStrengthModule.startListeningToSignalStrength();
    this.intervalId = setInterval(
      () => {
        const newSignalStrength = this.getSignalStrength();
        if (!newSignalStrength) return;
        if (this.signalStrength !== newSignalStrength) {
          this.signalStrength = newSignalStrength;
          listener(newSignalStrength);
        }
      },
      !updateInterval || updateInterval < UPDATE_INTERVAL
        ? UPDATE_INTERVAL
        : updateInterval
    );
  };

  /**
   * Stop monitoring cellular signal strength.
   */
  public stopMonitoringCellularSignalStrength = () => {
    if (!this.intervalId) return;
    CellularSignalStrengthModule.stopListeningToSignalStrength();
    clearInterval(this.intervalId);
    this.intervalId = null;
  };
}
