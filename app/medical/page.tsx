'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MedicalScanner from '@/components/MedicalScanner'
import AdvancedHealthSimulator from '@/components/AdvancedHealthSimulator'
import { Activity, Heart, Thermometer, Zap, AlertTriangle, TrendingUp, Clock, Wifi } from 'lucide-react'

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
  
  const [alerts, setAlerts] = useState<string[]>([])
  const [missionDay, setMissionDay] = useState(45)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [vitalHistory, setVitalHistory] = useState<{time: Date, heartRate: number}[]>([])
  const [dataPoints, setDataPoints] = useState(0)

  // Real-time vital signs processor
  const handleVitalUpdate = (newVitals: Partial<VitalSigns>) => {
    setVitals(prev => {
      const updated = { ...prev, ...newVitals }
      
      // Update history for trends
      if (newVitals.heartRate) {
        setVitalHistory(prev => {
          const newHistory = [...prev, { time: new Date(), heartRate: newVitals.heartRate! }]
          return newHistory.slice(-50) // Keep last 50 readings
        })
      }
      
      return updated
    })
    
    setLastUpdate(new Date())
    setDataPoints(prev => prev + 1)
    
    // Enhanced real-time alert system
    const newAlerts: string[] = []
    
    if (newVitals.heartRate) {
      if (newVitals.heartRate > 100) {
        newAlerts.push(`🚨 Tachycardia detected: ${newVitals.heartRate} BPM`)
      } else if (newVitals.heartRate < 60) {
        newAlerts.push(`⚠️ Bradycardia detected: ${newVitals.heartRate} BPM`)
      } else if (newVitals.heartRate > 90) {
        newAlerts.push(`⚠️ Elevated heart rate: ${newVitals.heartRate} BPM`)
      }
    }
    
    if (newVitals.stressLevel && newVitals.stressLevel > 7) {
      newAlerts.push(`🔴 Critical stress level: ${newVitals.stressLevel}/10 - Immediate intervention required`)
    } else if (newVitals.stressLevel && newVitals.stressLevel > 5) {
      newAlerts.push(`🟡 Elevated stress detected: ${newVitals.stressLevel}/10`)
    }
    
    if (newVitals.oxygenSaturation && newVitals.oxygenSaturation < 95) {
      newAlerts.push(`🚨 Hypoxemia: SpO₂ ${newVitals.oxygenSaturation}% - Oxygen therapy recommended`)
    } else if (newVitals.oxygenSaturation && newVitals.oxygenSaturation < 97) {
      newAlerts.push(`⚠️ Low oxygen saturation: ${newVitals.oxygenSaturation}%`)
    }
    
    if (newVitals.temperature) {
      if (newVitals.temperature > 100.4) {
        newAlerts.push(`🌡️ Fever detected: ${newVitals.temperature.toFixed(1)}°F`)
      } else if (newVitals.temperature < 97.0) {
        newAlerts.push(`❄️ Hypothermia risk: ${newVitals.temperature.toFixed(1)}°F`)
      }
    }

    if (newVitals.bloodPressure) {
      const { systolic, diastolic } = newVitals.bloodPressure
      if (systolic > 140 || diastolic > 90) {
        newAlerts.push(`🩸 Hypertension: ${systolic}/${diastolic} mmHg`)
      } else if (systolic < 90 || diastolic < 60) {
        newAlerts.push(`📉 Hypotension: ${systolic}/${diastolic} mmHg`)
      }
    }
    
    setAlerts(newAlerts)
  }

  // Mission day counter with realistic progression
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionDay(prev => prev + (1 / (24 * 60 * 60))) // Increment by seconds
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

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
      case 'normal': return 'text-green-400 border-green-400 bg-green-900/20'
      case 'warning': return 'text-yellow-400 border-yellow-400 bg-yellow-900/20'
      case 'critical': return 'text-red-400 border-red-400 bg-red-900/20'
      default: return 'text-gray-400 border-gray-400 bg-gray-900/20'
    }
  }

  const getHeartRateTrend = (): 'up' | 'down' | 'stable' => {
    if (vitalHistory.length < 3) return 'stable'
    const recent = vitalHistory.slice(-3)
    const trend = recent[2].heartRate - recent[0].heartRate
    return trend > 5 ? 'up' : trend < -5 ? 'down' : 'stable'
  }

  const getOverallHealthScore = (): number => {
    let score = 100
    
    // Heart rate scoring
    if (vitals.heartRate < 60 || vitals.heartRate > 100) score -= 20
    else if (vitals.heartRate < 65 || vitals.heartRate > 90) score -= 10
    
    // Temperature scoring
    if (vitals.temperature < 97.0 || vitals.temperature > 100.4) score -= 15
    else if (vitals.temperature < 97.8 || vitals.temperature > 99.1) score -= 5
    
    // SpO2 scoring
    if (vitals.oxygenSaturation < 95) score -= 25
    else if (vitals.oxygenSaturation < 97) score -= 10
    
    // Stress level scoring
    score -= vitals.stressLevel * 3
    
    return Math.max(0, score)
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
            MAITRI Health Monitoring Dashboard
          </h1>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered biometric analysis and real-time medical assessment
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-400" size={16} />
              <span>Mission Day: {Math.floor(missionDay)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="text-green-400 animate-pulse" size={16} />
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="text-cyan-400" size={16} />
              <span>Health Score: {getOverallHealthScore()}%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Alert System */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-900/20 border border-red-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-400 animate-pulse" size={20} />
              <h3 className="text-lg font-semibold text-red-400">Medical Alerts - Immediate Attention Required</h3>
            </div>
            <div className="grid gap-2">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-red-300 text-sm bg-red-900/20 p-3 rounded border-l-4 border-red-400"
                >
                  <div className="flex items-center justify-between">
                    <span>{alert}</span>
                    <span className="text-xs text-gray-400">
                      {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Vital Signs Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="medical-interface rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Activity className="mr-2 text-blue-400" />
                  Live Vital Signs Monitoring
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Real-time</span>
                  </div>
                  <div className="text-gray-400">
                    Updates: {dataPoints}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Enhanced Heart Rate */}
                <motion.div 
                  animate={{ 
                    scale: vitals.heartRate > 90 ? [1, 1.02, 1] : 1,
                    borderColor: vitals.heartRate > 100 ? '#ef4444' : vitals.heartRate < 60 ? '#3b82f6' : '#10b981'
                  }}
                  transition={{ duration: 0.5 }}
                  className={`p-6 rounded-lg border-2 ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="text-red-400 animate-pulse" size={24} />
                      <span className="text-sm text-gray-400">Heart Rate</span>
                    </div>
                    <TrendingUp 
                      className={`w-5 h-5 ${
                        getHeartRateTrend() === 'up' ? 'text-red-400 rotate-0' :
                        getHeartRateTrend() === 'down' ? 'text-blue-400 rotate-180' : 'text-gray-400 rotate-90'
                      }`} 
                    />
                  </div>
                  <div className="text-4xl font-bold mb-1">{vitals.heartRate}</div>
                  <div className="text-sm text-gray-400 mb-2">BPM</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-red-400 h-2 rounded-full"
                      animate={{ width: `${Math.min(100, (vitals.heartRate / 120) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>

                {/* Enhanced Temperature */}
                <div className={`p-6 rounded-lg border-2 ${getStatusColor(getVitalStatus('temperature', vitals.temperature))}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="text-orange-400" size={24} />
                    <span className="text-sm text-gray-400">Body Temperature</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{vitals.temperature.toFixed(1)}</div>
                  <div className="text-sm text-gray-400 mb-2">°F</div>
                  <div className="text-xs text-gray-500">
                    {vitals.temperature > 99.1 ? 'Elevated' : vitals.temperature < 97.8 ? 'Below Normal' : 'Normal Range'}
                  </div>
                </div>

                {/* Enhanced SpO2 */}
                <div className={`p-6 rounded-lg border-2 ${getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="text-blue-400" size={24} />
                    <span className="text-sm text-gray-400">Oxygen Saturation</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{vitals.oxygenSaturation}</div>
                  <div className="text-sm text-gray-400 mb-2">% SpO₂</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-blue-400 h-2 rounded-full"
                      animate={{ width: `${vitals.oxygenSaturation}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Enhanced Stress Level */}
                <div className={`p-6 rounded-lg border-2 ${getStatusColor(getVitalStatus('stressLevel', vitals.stressLevel))}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="text-yellow-400" size={24} />
                    <span className="text-sm text-gray-400">Stress Level</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{vitals.stressLevel}</div>
                  <div className="text-sm text-gray-400 mb-2">/10</div>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded ${
                          i < vitals.stressLevel 
                            ? vitals.stressLevel > 7 ? 'bg-red-400' : vitals.stressLevel > 4 ? 'bg-yellow-400' : 'bg-green-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Blood Pressure */}
              <div className="mt-6 p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Blood Pressure</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90
                      ? 'bg-red-900/50 text-red-400'
                      : 'bg-green-900/50 text-green-400'
                  }`}>
                    {vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90 ? 'Hypertensive' : 'Normal'}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-purple-400">
                  {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                  <span className="text-sm text-gray-400 ml-2">mmHg</span>
                </div>
              </div>
            </div>

            {/* 3D Body Scanner */}
            <div className="medical-interface rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">3D Physiological Analysis</h2>
              <MedicalScanner vitals={vitals} />
            </div>
          </div>

          {/* Enhanced Health Monitoring & Summary */}
          <div className="space-y-6">
            {/* Advanced Health Simulator */}
            <div className="medical-interface rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Health Monitoring System</h2>
              <AdvancedHealthSimulator onVitalUpdate={handleVitalUpdate} />
            </div>

            {/* Comprehensive Health Summary */}
            <div className="medical-interface rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Mission Health Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Overall Health Score:</span>
                  <div className="text-right">
                    <span className={`font-bold text-lg ${
                      getOverallHealthScore() > 80 ? 'text-green-400' :
                      getOverallHealthScore() > 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {getOverallHealthScore()}%
                    </span>
                    <div className="text-xs text-gray-500">
                      {getOverallHealthScore() > 80 ? 'Excellent' :
                       getOverallHealthScore() > 60 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">System Status:</span>
                  <span className={`font-semibold ${alerts.length === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {alerts.length === 0 ? '✅ All Systems Normal' : `⚠️ ${alerts.length} Alert${alerts.length > 1 ? 's' : ''}`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Medical Update:</span>
                  <span className="text-gray-300 text-sm">
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mission Duration:</span>
                  <span className="text-gray-300">Day {Math.floor(missionDay)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Data Collection:</span>
                  <span className="text-blue-400">{dataPoints} readings</span>
                </div>

                {/* Enhanced Heart Rate Trend */}
                {vitalHistory.length > 0 && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg">
                    <div className="text-sm text-gray-400 mb-3 flex items-center justify-between">
                      <span>Heart Rate Trend Analysis</span>
                      <span className="text-xs">{vitalHistory.length} samples</span>
                    </div>
                    <div className="flex items-end gap-1 h-16 mb-2">
                      {vitalHistory.slice(-20).map((reading, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-t from-red-500 to-red-300 rounded-t flex-1"
                          animate={{ 
                            height: `${Math.max(20, Math.min(100, (reading.heartRate - 40) * 1.2))}%`
                          }}
                          transition={{ duration: 0.3 }}
                          style={{ minHeight: '4px' }}
                          title={`${reading.heartRate} BPM at ${reading.time.toLocaleTimeString()}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>40 BPM</span>
                      <span className="text-center">Heart Rate Variability</span>
                      <span>120 BPM</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
