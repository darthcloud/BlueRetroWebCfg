export function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
      return false
    }
    return true
  }
export default isWebBluetoothEnabled