'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Thermometer, Wind, Brain, TrendingUp } from 'lucide-react'
import { useHealthStore, useEmotionStore } from '@/lib/store'
import WellnessScore from '@/components/dashboard/WellnessScore'
import VitalChart from '@/components/dashboard/VitalChart'
import Starfield from '@/components/effects/Starfield'
import FloatingParticles from '@/components/effects/FloatingParticles'

export default function DashboardPage() {
    const { updateVitals, currentVitals, wellnessScore } = useHealthStore()
    const [missionDay] = useState(45)

    // Simulate vital signs updates (replace with real data later)
    useEffect(() => {
        const interval = setInterval(() => {
            updateVitals({
                heartRate: 70 + Math.sin(Date.now() / 10000) * 15,
                bloodPressure: {
                    systolic: 120 + Math.sin(Date.now() / 15000) * 10,
                    diastolic: 80 + Math.cos(Date.now() / 15000) * 5
                },
                temperature: 98.6 + Math.sin(Date.now() / 20000) * 0.8,
                oxygenSaturation: 98 + Math.sin(Date.now() / 12000) * 2,
                stressLevel: 3 + Math.sin(Date.now() / 18000) * 2,
                respiratoryRate: 16 + Math.sin(Date.now() / 14000) * 2,
                timestamp: Date.now()
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [updateVitals])

    return (
        <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
            {/* Background Effects */}
            <Starfield count={150} speed={0.3} />
            <FloatingParticles count={30} speed={0.2} />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        Wellness Dashboard
                    </h1>
                    <p className="text-gray-400">Mission Day {missionDay} • Real-time Health Monitoring</p>
                </motion.div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Heart className="w-8 h-8" />}
                        label="Heart Rate"
                        value={currentVitals?.heartRate.toFixed(0) || '--'}
                        unit="BPM"
                        color="from-red-500 to-pink-500"
                        delay={0}
                    />
                    <StatCard
                        icon={<Thermometer className="w-8 h-8" />}
                        label="Temperature"
                        value={currentVitals?.temperature.toFixed(1) || '--'}
                        unit="°F"
                        color="from-orange-500 to-yellow-500"
                        delay={0.1}
                    />
                    <StatCard
                        icon={<Activity className="w-8 h-8" />}
                        label="SpO₂"
                        value={currentVitals?.oxygenSaturation.toFixed(0) || '--'}
                        unit="%"
                        color="from-cyan-500 to-blue-500"
                        delay={0.2}
                    />
                    <StatCard
                        icon={<Brain className="w-8 h-8" />}
                        label="Stress Level"
                        value={currentVitals?.stressLevel.toFixed(1) || '--'}
                        unit="/10"
                        color="from-purple-500 to-pink-500"
                        delay={0.3}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Wellness Score - Left Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="medical-interface rounded-2xl p-8 h-full flex flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold mb-6 text-white">Overall Wellness</h3>
                            <WellnessScore score={wellnessScore} trend="stable" />
                            <p className="text-gray-400 text-center mt-6 text-sm">
                                {wellnessScore >= 80 ? 'Excellent health status' :
                                    wellnessScore >= 60 ? 'Good health status' :
                                        wellnessScore >= 40 ? 'Fair health status' :
                                            'Requires attention'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Charts - Right 2 Columns */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ChartCard
                            title="Heart Rate Trend"
                            icon={<Heart className="w-5 h-5 text-red-400" />}
                            delay={0.5}
                        >
                            <VitalChart type="heartRate" height={200} />
                        </ChartCard>

                        <ChartCard
                            title="Temperature Trend"
                            icon={<Thermometer className="w-5 h-5 text-orange-400" />}
                            delay={0.6}
                        >
                            <VitalChart type="temperature" height={200} />
                        </ChartCard>

                        <ChartCard
                            title="Oxygen Saturation"
                            icon={<Activity className="w-5 h-5 text-cyan-400" />}
                            delay={0.7}
                        >
                            <VitalChart type="oxygenSaturation" height={200} />
                        </ChartCard>

                        <ChartCard
                            title="Stress Levels"
                            icon={<Brain className="w-5 h-5 text-purple-400" />}
                            delay={0.8}
                        >
                            <VitalChart type="stressLevel" height={200} />
                        </ChartCard>
                    </div>
                </div>

                {/* Blood Pressure */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="medical-interface rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20">
                                <Wind className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Blood Pressure</h3>
                                <p className="text-sm text-gray-400">Systolic / Diastolic</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-400">
                                {currentVitals?.bloodPressure.systolic.toFixed(0) || '--'}/
                                {currentVitals?.bloodPressure.diastolic.toFixed(0) || '--'}
                            </div>
                            <div className="text-sm text-gray-400">mmHg</div>
                        </div>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ delay: 1, duration: 0.5 }}
                        />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">Normal range: 90-120 / 60-80 mmHg</div>
                </motion.div>

            </div>
        </div>
    )
}

// Helper Components

function StatCard({ icon, label, value, unit, color, delay }: {
    icon: React.ReactNode
    label: string
    value: string
    unit: string
    color: string
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="medical-interface rounded-2xl p-6 hover:scale-105 transition-transform"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-20`}>
                    {icon}
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="mb-2">
                <div className="text-3xl font-bold text-white mb-1">
                    {value}
                    <span className="text-lg text-gray-400 ml-1">{unit}</span>
                </div>
                <div className="text-sm text-gray-400">{label}</div>
            </div>
        </motion.div>
    )
}

function ChartCard({ title, icon, children, delay }: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="medical-interface rounded-2xl p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            {children}
        </motion.div>
    )
}
