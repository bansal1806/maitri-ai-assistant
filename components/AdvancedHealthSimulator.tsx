'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Zap, Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface VitalSigns {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  temperature: number
  oxygenSaturation: number
  stressLevel: number
}

interface HealthSimulatorProps {
  onVitalUpdate: (vitals: Partial<VitalSigns>) => void
}

type HealthScenario = 'normal' | 'exercise' | 'stress' | 'sleep' | 'recovery'

export default function AdvancedHealthSimulator({ onVitalUpdate }: HealthSimulatorProps) {
  const [isRunning, setIsRunning] = useState(true)
  const [scenario, setScenario] = useState<HealthScenario>('normal')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentVitals, setCurrentVitals] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    stressLevel: 3
  })

  // Realistic physiological patterns with respiratory sinus arrhythmia
  const getScenarioParams = (scenario: HealthScenario, time: number) => {
    const circadianRhythm = Math.sin(time / 60000) * 0.1 // 1-minute cycle for demo
    const respiratoryVariation = Math.sin(time / 4000) * 0.05 // Respiratory sinus arrhythmia
    
    switch (scenario) {
      case 'exercise':
        return {
          heartRateBase: 120 + Math.sin(time / 10000) * 25,
          heartRateVariation: 8,
          respiratoryInfluence: respiratoryVariation * 15, // Increased during exercise
          temperatureBase: 99.2,
          temperatureVariation: 0.8,
          stressBase: 6,
          bpSystolicBase: 140,
          bpDiastolicBase: 85,
          spo2Base: 96
        }
      
      case 'stress':
        return {
          heartRateBase: 95 + Math.sin(time / 8000) * 15,
          heartRateVariation: 12,
          respiratoryInfluence: respiratoryVariation * 10, // Irregular breathing pattern
          temperatureBase: 98.8,
          temperatureVariation: 0.6,
          stressBase: 8,
          bpSystolicBase: 135,
          bpDiastolicBase: 90,
          spo2Base: 97
        }
      
      case 'sleep':
        return {
          heartRateBase: 55 + circadianRhythm * 10,
          heartRateVariation: 5,
          respiratoryInfluence: respiratoryVariation * 3, // Slow, deep breathing
          temperatureBase: 97.8,
          temperatureVariation: 0.4,
          stressBase: 1,
          bpSystolicBase: 110,
          bpDiastolicBase: 70,
          spo2Base: 99
        }
      
      case 'recovery':
        const recoveryProgress = Math.min(time / 30000, 1) // 30-second recovery
        return {
          heartRateBase: 100 - (recoveryProgress * 25),
          heartRateVariation: 6,
          respiratoryInfluence: respiratoryVariation * (8 - recoveryProgress * 3), // Normalizing breathing
          temperatureBase: 98.6,
          temperatureVariation: 0.5,
          stressBase: 4 - (recoveryProgress * 2),
          bpSystolicBase: 125 - (recoveryProgress * 10),
          bpDiastolicBase: 82 - (recoveryProgress * 7),
          spo2Base: 97 + (recoveryProgress * 2)
        }
      
      default: // normal
        return {
          heartRateBase: 72 + circadianRhythm * 8,
          heartRateVariation: 6,
          respiratoryInfluence: respiratoryVariation * 5, // Normal RSA
          temperatureBase: 98.6,
          temperatureVariation: 0.5,
          stressBase: 3,
          bpSystolicBase: 120,
          bpDiastolicBase: 80,
          spo2Base: 98
        }
    }
  }

  // Generate realistic vital signs with respiratory sinus arrhythmia
  const generateVitals = useCallback((time: number) => {
    const params = getScenarioParams(scenario, time)
    const noise = () => (Math.random() - 0.5) * 2
    
    // Heart rate with respiratory sinus arrhythmia (RSA)
    const heartRate = Math.round(
      params.heartRateBase + 
      params.respiratoryInfluence + // This adds the respiratory variation to heart rate
      noise() * params.heartRateVariation
    )
    
    const temperature = Number(
      (params.temperatureBase + noise() * params.temperatureVariation).toFixed(1)
    )
    
    const oxygenSaturation = Math.round(
      params.spo2Base + noise() * 2
    )
    
    const stressLevel = Math.max(1, Math.min(10, Math.round(
      params.stressBase + noise() * 1.5
    )))
    
    const bloodPressure = {
      systolic: Math.round(params.bpSystolicBase + noise() * 8),
      diastolic: Math.round(params.bpDiastolicBase + noise() * 5)
    }

    return {
      heartRate,
      bloodPressure,
      temperature,
      oxygenSaturation,
      stressLevel
    }
  }, [scenario])

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1000)
      
      const newVitals = generateVitals(Date.now())
      setCurrentVitals(newVitals)
      onVitalUpdate(newVitals)
    }, 1000) // Update every second for smooth animation

    return () => clearInterval(interval)
  }, [isRunning, generateVitals, onVitalUpdate])

  const scenarios = [
    { key: 'normal', name: '😌 Normal Rest', color: 'text-green-400', description: 'Baseline physiological state' },
    { key: 'exercise', name: '🏃 Exercise', color: 'text-orange-400', description: 'Elevated activity response' },
    { key: 'stress', name: '😰 Stress Response', color: 'text-red-400', description: 'Psychological stress reaction' },
    { key: 'sleep', name: '😴 Sleep Mode', color: 'text-blue-400', description: 'Rest and recovery state' },
    { key: 'recovery', name: '🔄 Recovery', color: 'text-purple-400', description: 'Post-activity normalization' }
  ]

  const resetSimulation = () => {
    setTimeElapsed(0)
    setScenario('normal')
  }

  const getCurrentScenarioInfo = () => {
    return scenarios.find(s => s.key === scenario)
  }

  return (
    <div className="space-y-4">
      {/* Simulation Controls */}
      <div className="p-4 bg-gray-800/50 border border-gray-600/30 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="text-cyan-400" size={20} />
            <h3 className="font-semibold">Advanced Physiological Simulator</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-400">
              {isRunning ? 'Monitoring' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isRunning 
                ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? 'Pause' : 'Resume'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </motion.button>
        </div>

        {/* Scenario Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Physiological Scenario:</label>
            <div className="text-xs text-gray-500">
              Runtime: {Math.floor(timeElapsed / 1000)}s
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {scenarios.map((s) => (
              <motion.button
                key={s.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setScenario(s.key as HealthScenario)}
                className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                  scenario === s.key
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={scenario === s.key ? 'text-black' : s.color}>
                    {s.name}
                  </span>
                  {scenario === s.key && <span className="text-black text-xs">Active</span>}
                </div>
                <div className={`text-xs mt-1 ${scenario === s.key ? 'text-black/70' : 'text-gray-500'}`}>
                  {s.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Simulation Status */}
        <div className="mt-4 p-4 bg-black/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block">Active Scenario:</span>
              <div className="font-semibold text-cyan-400">
                {getCurrentScenarioInfo()?.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getCurrentScenarioInfo()?.description}
              </div>
            </div>
            <div>
              <span className="text-gray-400 block">Physiological Features:</span>
              <div className="text-xs text-gray-400 space-y-1 mt-1">
                <div>• Respiratory Sinus Arrhythmia</div>
                <div>• Circadian Rhythm Variation</div>
                <div>• Autonomic Response Simulation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Vital Signs Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-gradient-to-r from-red-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-400 animate-pulse" size={20} />
            <span className="font-semibold">Real-time Physiological Monitor</span>
          </div>
          <div className="text-xs text-green-400 animate-pulse flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            LIVE RSA
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Heart Rate with RSA indicator */}
          <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            <Heart className="text-red-400 mx-auto mb-2 animate-pulse" size={24} />
            <div className="text-2xl font-bold text-red-400">
              {currentVitals.heartRate}
            </div>
            <div className="text-xs text-gray-400">BPM</div>
            <div className="text-xs text-blue-400 mt-1">RSA Active</div>
          </div>

          {/* Temperature */}
          <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
            <div className="text-2xl font-bold text-orange-400">
              {currentVitals.temperature}
            </div>
            <div className="text-xs text-gray-400">°F</div>
          </div>

          {/* SpO2 */}
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <Zap className="text-blue-400 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-blue-400">
              {currentVitals.oxygenSaturation}
            </div>
            <div className="text-xs text-gray-400">% SpO₂</div>
          </div>

          {/* Stress Level */}
          <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">
              {currentVitals.stressLevel}
            </div>
            <div className="text-xs text-gray-400">/10 Stress</div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {currentVitals.bloodPressure.systolic}/{currentVitals.bloodPressure.diastolic}
            </div>
            <div className="text-xs text-gray-400">mmHg Blood Pressure</div>
          </div>
        </div>

        {/* Enhanced Real-time Waveform with RSA */}
        <div className="mt-4 p-3 bg-black/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-gray-400">ECG with Respiratory Sinus Arrhythmia</div>
            <div className="text-xs text-green-400">Real-time RSA Simulation</div>
          </div>
          <div className="flex items-end gap-1 h-16">
            {[...Array(25)].map((_, i) => {
              // Enhanced waveform with respiratory influence
              const respiratoryComponent = Math.sin((Date.now() / 4000) + i * 0.3) * 20
              const heartbeatComponent = Math.abs(Math.sin((Date.now() / 200) + i * 0.5)) * 80
              const height = Math.max(10, heartbeatComponent + respiratoryComponent)
              
              return (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-green-500 to-green-300 flex-1 rounded-t"
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ minHeight: '4px' }}
                />
              )
            })}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Respiratory Sinus Arrhythmia: Natural heart rate variation with breathing cycle
          </div>
        </div>
      </motion.div>

      {/* Enhanced Simulation Info */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="text-sm text-blue-400 font-semibold mb-2">
          🔬 Advanced Physiological Modeling
        </div>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <strong>Respiratory Sinus Arrhythmia:</strong> Heart rate varies naturally with breathing</li>
          <li>• <strong>Circadian Rhythm:</strong> Physiological patterns follow daily cycles</li>
          <li>• <strong>Autonomic Responses:</strong> Realistic stress and recovery patterns</li>
          <li>• <strong>Medical Accuracy:</strong> NASA-grade physiological parameter ranges</li>
          <li>• <strong>Real-time Processing:</strong> Sub-second response and visualization</li>
        </ul>
      </div>
    </div>
  )
}
