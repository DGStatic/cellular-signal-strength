import ExpoModulesCore

public class CellularSignalStrengthModule: Module {
  public func definition() -> ModuleDefinition {

    Name("CellularSignalStrength")

    Property("signalStrength") {
      return 0
    }

    Function("startListeningToSignalStrength") {}

    Function("stopListenningToSignalStrength") {}

  }
}
