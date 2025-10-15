'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bluetooth, Watch, Wifi } from 'lucide-react'

interface VitalSigns {
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
  stressLevel?: number
}

interface WearableConnectorProps {
  onConnect: () => void
  onDisconnect: () => void
  onVitalUpdate: (vitals: VitalSigns) => void
  isConnected: boolean
}

interface WearableDevice {
  name: string
  type: string
  battery: number
}

export default function WearableConnector({ 
  onConnect, 
  onDisconnect, 
  onVitalUpdate, 
  isConnected 
}: WearableConnectorProps) {
  const [availableDevices] = useState<WearableDevice[]>([
    { name: 'Garmin Fenix 7', type: 'smartwatch', battery: 85 },
    { name: 'Apple Watch Series 9', type: 'smartwatch', battery: 92 },
    { name: 'BioButton Sensor', type: 'patch', battery: 67 },
    { name: 'Hexoskin Smart Shirt', type: 'garment', battery: 78 }
  ])
  
  const [connecting, setConnecting] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState<string>('')
  const [bluetoothSupported, setBluetoothSupported] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      setBluetoothSupported(true)
    }

    if (isConnected) {
      const interval = setInterval(() => {
        const simulatedVitals: VitalSigns = {
          heartRate: Math.floor(Math.random() * 30) + 65,
          temperature: (Math.random() * 2) + 97.5,
          oxygenSaturation: Math.floor(Math.random() * 5) + 95,
          stressLevel: Math.floor(Math.random() * 8) + 1
        }
        onVitalUpdate(simulatedVitals)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isConnected, onVitalUpdate])

  const connectToDevice = async (deviceName: string) => {
    setConnecting(true)
    setConnectedDevice(deviceName)
    
    try {
      if (bluetoothSupported) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        onConnect()
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500))
        onConnect()
      }
    } catch (error) {
      console.error(`Connection to ${deviceName} failed:`, error)
      setConnectedDevice('')
    } finally {
      setConnecting(false)
    }
  }

  const disconnectDevice = () => {
    setConnectedDevice('')
    onDisconnect()
  }

  return (
    <div className="space-y-4">
      {!bluetoothSupported && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-yellow-400 text-sm">
            Web Bluetooth not supported. Using simulation mode.
          </p>
        </div>
      )}

      {isConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Connected</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={disconnectDevice}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-all"
            >
              Disconnect
            </motion.button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Watch className="text-blue-400" size={16} />
              <span className="text-sm">{connectedDevice || 'Connected Device'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Battery:</span>
              <span className="text-green-400">85%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Signal:</span>
              <div className="flex items-center gap-1">
                <Wifi className="text-green-400" size={14} />
                <span className="text-green-400">Strong</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Data Rate:</span>
              <span className="text-blue-400">Real-time</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Bluetooth className="text-blue-400" />
            <span className="font-semibold">Available Devices</span>
          </div>
          
          {availableDevices.map((device, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-gray-400 capitalize">{device.type}</div>
                  <div className="text-xs text-green-400">Battery: {device.battery}%</div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => connectToDevice(device.name)}
                  disabled={connecting}
                  className={`px-4 py-2 rounded transition-all ${
                    connecting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {connecting ? 'Connecting...' : 'Connect'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {connecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          <p className="text-sm text-gray-400 mt-2">
            Establishing connection to {connectedDevice}...
          </p>
        </motion.div>
      )}
    </div>
  )
}
