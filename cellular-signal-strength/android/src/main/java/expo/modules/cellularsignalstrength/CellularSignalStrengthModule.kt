package expo.modules.cellularsignalstrength

import android.content.Context
import android.telephony.SignalStrength
import android.telephony.TelephonyCallback
import android.telephony.TelephonyManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.Executors

class CellularSignalStrengthModule : Module() {

  private var telephonyCallback: MyTelephonyCallback = MyTelephonyCallback()
  private var signalStrength: Int? = null

  private fun setSignalStrength(newSignalStrength: Int) {
    signalStrength = newSignalStrength
  }

  override fun definition() = ModuleDefinition {

    Name("CellularSignalStrength")

    Function("startListeningToSignalStrength") {
          appContext.reactContext?.let {
            startTelephonyListener(it.applicationContext)
          }
    }

    Function("stopListeningToSignalStrength") {
      appContext.reactContext?.let { stopTelephonyListener(it.applicationContext, telephonyCallback) }
    }

    Property("signalStrength") {
      return@Property signalStrength
    }

  }

  inner class MyTelephonyCallback() : TelephonyCallback(), TelephonyCallback.SignalStrengthsListener {

    override fun onSignalStrengthsChanged(signalStrength: SignalStrength) {
      val signalStrengthDbm = signalStrength.cellSignalStrengths[0].dbm
      setSignalStrength(signalStrengthDbm)
    }

  }

  private fun startTelephonyListener(context: Context) {
    val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    val executor = Executors.newSingleThreadExecutor()
    try {
      telephonyManager.unregisterTelephonyCallback(telephonyCallback)
      telephonyManager.registerTelephonyCallback(executor, telephonyCallback)
    } catch (e: SecurityException) {
      println("Security exception: ${e.message}")
    }
  }

  private fun stopTelephonyListener(context: Context, callback: MyTelephonyCallback?) {
    if (callback != null) {
      val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
      telephonyManager.unregisterTelephonyCallback(callback)
    }
  }

}
