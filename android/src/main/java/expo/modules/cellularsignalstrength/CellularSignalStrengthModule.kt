package expo.modules.cellularsignalstrength

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.telephony.SignalStrength
import android.telephony.TelephonyCallback
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.Executors

const val TAG = "CellularSignalStrengthModule"

class CellularSignalStrengthModule : Module() {
  private var telephonyManager: TelephonyManager? = null
  private val telephonyCallback: MyTelephonyCallback = MyTelephonyCallback()
  private var networkMonitor: NetworkMonitor? = null
  private val _signalStrength = MutableLiveData<Int?>(null)
  val signalStrength: LiveData<Int?> = _signalStrength

  override fun definition() = ModuleDefinition {

    Name("CellularSignalStrength")

    Function("startListeningToSignalStrength") {
          super.appContext.reactContext?.let {
            telephonyManager = it.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            networkMonitor = NetworkMonitor(it)
            networkMonitor!!.startMonitoringNetwork()
            startTelephonyListener(it)
          }
    }

    Function("stopListeningToSignalStrength") {
      appContext.reactContext?.let { stopTelephonyListener(it, telephonyCallback) }
    }

    Property("signalStrength") {
      return@Property signalStrength.value
    }

  }

  inner class NetworkMonitor(private val context: Context) {
    private val _isCellularAvailable = MutableLiveData<Boolean>(false)
    val isCellularAvailable: LiveData<Boolean> = _isCellularAvailable

    private val connectivityManager =
      context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    private val networkCallback = object : ConnectivityManager.NetworkCallback() {

      override fun onAvailable(network: Network) {
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        if (capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true) {
          Log.i(TAG, "Cellular connection found.")
          checkCellularAvailability()
        }
      }

      override fun onLost(network: Network) {
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        if (capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true) {
          Log.w(TAG, "Cellular connection has been lost.")
          checkCellularAvailability()
        }
      }
    }

    @SuppressLint("MissingPermission")
    private fun checkCellularAvailability() {
      fun checkAvailable(network: Network): Boolean {
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        return capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
      }
      _isCellularAvailable.postValue(telephonyManager!!.isDataEnabled && connectivityManager.allNetworks.any { network ->
        checkAvailable(network)
      })
    }

    fun startMonitoringNetwork() {
      checkCellularAvailability()

      val request = NetworkRequest.Builder()
        .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
        .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        .build()
      connectivityManager.registerNetworkCallback(request, networkCallback)

    }

    fun stopMonitoringNetwork() {
      connectivityManager.unregisterNetworkCallback(networkCallback)
    }
  }

  inner class MyTelephonyCallback() : TelephonyCallback(), TelephonyCallback.SignalStrengthsListener {

    @SuppressLint("MissingPermission")
    override fun onSignalStrengthsChanged(newSignalStrength: SignalStrength) {
      if (!telephonyManager!!.isDataEnabled || networkMonitor!!.isCellularAvailable.value != true) {
        if (signalStrength.value != null) {
          _signalStrength.postValue(null)
        }
      } else {
        val signalStrengthDbm = newSignalStrength.cellSignalStrengths[0].dbm
        _signalStrength.postValue(signalStrengthDbm)
      }
    }
  }

  private fun startTelephonyListener(context: Context) {
    if (ActivityCompat.checkSelfPermission(
        context,
        Manifest.permission.READ_PHONE_STATE
      ) != PackageManager.PERMISSION_GRANTED
    ) {
      throw Exception("Phone state permission denied.")
    }
    if (networkMonitor!!.isCellularAvailable.value != true) {
      throw Exception("No cellular service detected.")
    }
    val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
    val executor = Executors.newSingleThreadExecutor()
    telephonyManager.unregisterTelephonyCallback(telephonyCallback)
    telephonyManager.registerTelephonyCallback(executor, telephonyCallback)
  }

  private fun stopTelephonyListener(context: Context, callback: MyTelephonyCallback?) {
    if (callback != null) {
      val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
      telephonyManager.unregisterTelephonyCallback(callback)
      networkMonitor!!.stopMonitoringNetwork()
    }
  }

}