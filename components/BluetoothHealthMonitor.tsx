'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Bluetooth, Wifi, AlertTriangle } from 'lucide-react'

interface BiometricData {
  heartRate: number
  timestamp: number
  batteryLevel?: number
  deviceName?: string
}

interface VitalSigns {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  temperature: number
  oxygenSaturation: number
  stressLevel: number
}

interface BluetoothHealthMonitorProps {
  onVitalUpdate: (vitals: Partial<VitalSigns>) => void
}

export default function BluetoothHealthMonitor({ onVitalUpdate }: BluetoothHealthMonitorProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [heartRateData, setHeartRateData] = useState<BiometricData | null>(null)
  const [error, setError] = useState<string>('')
  const [bluetoothSupported, setBluetoothSupported] = useState(false)

  useEffect(() => {
    // Check Web Bluetooth support
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      setBluetoothSupported(true)
    }
  }, [])

  // Real-time heart rate processing
  const processHeartRateData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    
    if (value) {
      // Parse heart rate data according to Bluetooth Heart Rate specification
      const flags = value.getUint8(0)
      let heartRate: number
      
      if (flags & 0x01) {
        // 16-bit heart rate value
        heartRate = value.getUint16(1, true)
      } else {
        // 8-bit heart rate value
        heartRate = value.getUint8(1)
      }
      
      const biometricData: BiometricData = {
        heartRate,
        timestamp: Date.now(),
        deviceName: device?.name
      }
      
      setHeartRateData(biometricData)
      
      // Update vital signs with real heart rate
      onVitalUpdate({
        heartRate,
        stressLevel: heartRate > 100 ? 8 : heartRate < 60 ? 2 : 3,
        oxygenSaturation: Math.max(95, 100 - Math.floor((heartRate - 70) / 10))
      })
    }
  }, [device, onVitalUpdate])

  // Connect to Bluetooth heart rate monitor
  const connectToHeartRateMonitor = async () => {
    if (!bluetoothSupported) {
      setError('Web Bluetooth not supported in this browser')
      return
    }

    setConnecting(true)
    setError('')

    try {
      // Request heart rate monitor device
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { namePrefix: 'Polar' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Fitbit' }
        ],
        optionalServices: ['battery_service', 'device_information']
      })

      setDevice(selectedDevice)

      // Connect to GATT server
      const server = await selectedDevice.gatt?.connect()
      if (!server) throw new Error('Failed to connect to GATT server')

      // Get heart rate service
      const heartRateService = await server.getPrimaryService('heart_rate')
      
      // Get heart rate measurement characteristic
      const heartRateCharacteristic = await heartRateService.getCharacteristic('heart_rate_measurement')
      
      // Start notifications for real-time data
      await heartRateCharacteristic.startNotifications()
      
      // Add event listener for heart rate updates
      heartRateCharacteristic.addEventListener('characteristicvaluechanged', processHeartRateData)
      
      setIsConnected(true)
      setConnecting(false)

      // Handle device disconnection
      selectedDevice.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false)
        setDevice(null)
        setHeartRateData(null)
      })

    } catch (err) {
      console.error('Bluetooth connection failed:', err)
      setError(`Connection failed: ${(err as Error).message}`)
      setConnecting(false)
    }
  }

  // Disconnect from device
  const disconnect = () => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect()
    }
    setIsConnected(false)
    setDevice(null)
    setHeartRateData(null)
  }

  // Simulate realistic vital signs when not connected to real device
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        const baseHeartRate = 72
        const variation = Math.sin(Date.now() / 10000) * 10
        const heartRate = Math.floor(baseHeartRate + variation + (Math.random() - 0.5) * 8)
        
        const simulatedData: BiometricData = {
          heartRate,
          timestamp: Date.now(),
          deviceName: 'Simulation Mode'
        }
        
        setHeartRateData(simulatedData)
        
        onVitalUpdate({
          heartRate,
          temperature: 98.6 + (Math.random() - 0.5) * 1.2,
          oxygenSaturation: 98 + Math.floor((Math.random() - 0.5) * 4),
          stressLevel: Math.floor(Math.random() * 3) + 2,
          bloodPressure: {
            systolic: 120 + Math.floor((Math.random() - 0.5) * 20),
            diastolic: 80 + Math.floor((Math.random() - 0.5) * 10)
          }
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isConnected, onVitalUpdate])

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className={`p-4 rounded-lg border-2 ${
        isConnected 
          ? 'bg-green-900/20 border-green-500/50' 
          : 'bg-gray-800/20 border-gray-600/50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${
              isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
            }`} />
            <div>
              <h3 className="font-semibold text-lg">
                {isConnected ? 'Connected' : 'Disconnected'}
              </h3>
              <p className="text-sm text-gray-400">
                {device?.name || 'No device connected'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {bluetoothSupported ? (
              <Bluetooth className="text-blue-400" size={24} />
            ) : (
              <AlertTriangle className="text-yellow-400" size={24} />
            )}
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectToHeartRateMonitor}
              disabled={connecting || !bluetoothSupported}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                connecting || !bluetoothSupported
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {connecting ? 'Connecting...' : 'Connect Heart Rate Monitor'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={disconnect}
              className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Disconnect
            </motion.button>
          )}
        </div>
      </div>

      {/* Real-time Heart Rate Display */}
      {heartRateData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="text-red-400 animate-pulse" size={20} />
              <span className="font-semibold">Live Heart Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="text-green-400" size={16} />
              <span className="text-xs text-green-400">
                {isConnected ? 'Bluetooth' : 'Simulation'}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400 mb-1">
              {heartRateData.heartRate}
            </div>
            <div className="text-sm text-gray-400">BPM</div>
            <div className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(heartRateData.timestamp).toLocaleTimeString()}
            </div>
            {heartRateData.deviceName && (
              <div className="text-xs text-blue-400 mt-1">
                Source: {heartRateData.deviceName}
              </div>
            )}
          </div>

          {/* Heart rate trend indicator */}
          <div className="mt-3 flex justify-center">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [
                      `${Math.max(12, Math.min(32, heartRateData.heartRate / 3))}px`,
                      `${Math.max(8, Math.min(28, (heartRateData.heartRate - 5) / 3))}px`,
                      `${Math.max(12, Math.min(32, heartRateData.heartRate / 3))}px`
                    ]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className={`w-2 rounded-full ${
                    heartRateData.heartRate > 80 
                      ? 'bg-red-400' 
                      : heartRateData.heartRate < 65 
                        ? 'bg-blue-400' 
                        : 'bg-green-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Browser Compatibility Info */}
      {!bluetoothSupported && (
        <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-400" size={16} />
            <span className="text-yellow-400 font-semibold">Browser Compatibility</span>
          </div>
          <p className="text-sm text-gray-400">
            Web Bluetooth requires Chrome, Edge, or Opera. Currently using simulation mode for demonstration.
          </p>
          <div className="mt-2 text-xs text-gray-500">
            To test real Bluetooth: Use supported browser → Enable bluetooth → Connect heart rate monitor
          </div>
        </div>
      )}

      {/* Connection Instructions */}
      {bluetoothSupported && !isConnected && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-400 font-semibold mb-2">
            💡 Bluetooth Connection Tips
          </div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Ensure your heart rate monitor is in pairing mode</li>
            <li>• Supported devices: Polar, Garmin, Fitbit, generic BLE monitors</li>
            <li>• Grant permission when browser requests device access</li>
            <li>• For testing: Use nRF Connect app to simulate heart rate service</li>
          </ul>
        </div>
      )}
    </div>
  )
}
