'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MedicalScanner from '@/components/MedicalScanner'
import WearableConnector from '@/components/WearableConnector'
import { Activity, Heart, Thermometer, Zap, AlertTriangle } from 'lucide-react'

interface VitalSigns {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  temperature: number
  oxygenSaturation: number
  stressLevel: number
}

export default function MedicalPage() {
  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    stressLevel: 3
  })
  
  const [isConnected, setIsConnected] = useState(false)
  const [alerts, setAlerts] = useState<string[]>([])

  const handleVitalUpdate = (newVitals: Partial<VitalSigns>) => {
    setVitals(prev => ({ ...prev, ...newVitals }))
    
    // Check for alerts
    const newAlerts: string[] = []
    if (newVitals.heartRate && (newVitals.heartRate > 100 || newVitals.heartRate < 60)) {
      newAlerts.push(`Heart rate ${newVitals.heartRate > 100 ? 'elevated' : 'low'}: ${newVitals.heartRate} BPM`)
    }
    if (newVitals.stressLevel && newVitals.stressLevel > 7) {
      newAlerts.push(`High stress level detected: ${newVitals.stressLevel}/10`)
    }
    if (newVitals.oxygenSaturation && newVitals.oxygenSaturation < 95) {
      newAlerts.push(`Low oxygen saturation: ${newVitals.oxygenSaturation}%`)
    }
    
    setAlerts(newAlerts)
  }

  const getVitalStatus = (vital: string, value: number): 'normal' | 'warning' | 'critical' => {
    switch (vital) {
      case 'heartRate':
        return value >= 60 && value <= 100 ? 'normal' : value > 100 ? 'warning' : 'critical'
      case 'temperature':
        return value >= 97.8 && value <= 99.1 ? 'normal' : 'warning'
      case 'oxygenSaturation':
        return value >= 95 ? 'normal' : value >= 90 ? 'warning' : 'critical'
      case 'stressLevel':
        return value <= 4 ? 'normal' : value <= 7 ? 'warning' : 'critical'
      default:
        return 'normal'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'normal': return 'text-green-400 border-green-400'
      case 'warning': return 'text-yellow-400 border-yellow-400'
      case 'critical': return 'text-red-400 border-red-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold holographic mb-4">
            Health Monitoring Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time biometric analysis and medical assessment
          </p>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-900/20 border border-red-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-400" size={20} />
              <h3 className="text-lg font-semibold text-red-400">Health Alerts</h3>
            </div>
            <ul className="space-y-1">
              {alerts.map((alert, index) => (
                <li key={index} className="text-red-300 text-sm">• {alert}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Signs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Vitals */}
            <div className="medical-interface rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="mr-2 text-blue-400" />
                Real-time Vital Signs
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="text-red-400" size={20} />
                    <span className="text-sm text-gray-400">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold">{vitals.heartRate}</div>
                  <div className="text-xs text-gray-400">BPM</div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('temperature', vitals.temperature))}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="text-orange-400" size={20} />
                    <span className="text-sm text-gray-400">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold">{vitals.temperature.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">°F</div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-blue-400" size={20} />
                    <span className="text-sm text-gray-400">SpO₂</span>
                  </div>
                  <div className="text-2xl font-bold">{vitals.oxygenSaturation}</div>
                  <div className="text-xs text-gray-400">%</div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('stressLevel', vitals.stressLevel))}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-yellow-400" size={20} />
                    <span className="text-sm text-gray-400">Stress Level</span>
                  </div>
                  <div className="text-2xl font-bold">{vitals.stressLevel}</div>
                  <div className="text-xs text-gray-400">/10</div>
                </div>
              </div>
            </div>

            {/* 3D Body Scanner */}
            <div className="medical-interface rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">3D Body Analysis</h2>
              <MedicalScanner vitals={vitals} />
            </div>
          </div>

          {/* Wearable Connection */}
          <div className="space-y-6">
            <div className="medical-interface rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Wearable Devices</h2>
              <WearableConnector 
                onConnect={() => setIsConnected(true)}
                onDisconnect={() => setIsConnected(false)}
                onVitalUpdate={handleVitalUpdate}
                isConnected={isConnected}
              />
            </div>

            {/* Health Summary */}
            <div className="medical-interface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Health Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Overall Status:</span>
                  <span className={alerts.length === 0 ? 'text-green-400' : 'text-yellow-400'}>
                    {alerts.length === 0 ? 'Stable' : 'Monitoring'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Mission Day:</span>
                  <span className="text-gray-300">Day 45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
