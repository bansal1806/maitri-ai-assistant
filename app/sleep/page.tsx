'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, TrendingUp, TrendingDown, Zap, Brain, Heart } from 'lucide-react'
import { Line, Radar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'
import Starfield from '@/components/effects/Starfield'
import FloatingParticles from '@/components/effects/FloatingParticles'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
)

interface SleepData {
    date: string
    totalHours: number
    deep: number
    light: number
    rem: number
    awake: number
    quality: number
    heartRate: number
    movements: number
}

// Mock sleep data (replace with real data from wearables)
const mockSleepData: SleepData[] = [
    { date: '2024-01-01', totalHours: 7.5, deep: 2.0, light: 4.0, rem: 1.3, awake: 0.2, quality: 85, heartRate: 58, movements: 12 },
    { date: '2024-01-02', totalHours: 6.8, deep: 1.5, light: 4.2, rem: 1.0, awake: 0.1, quality: 72, heartRate: 62, movements: 18 },
    { date: '2024-01-03', totalHours: 8.2, deep: 2.5, light: 4.5, rem: 1.0, awake: 0.2, quality: 92, heartRate: 56, movements: 8 },
    { date: '2024-01-04', totalHours: 7.0, deep: 1.8, light: 4.0, rem: 1.0, awake: 0.2, quality: 78, heartRate: 60, movements: 15 },
    { date: '2024-01-05', totalHours: 7.8, deep: 2.2, light: 4.3, rem: 1.2, awake: 0.1, quality: 88, heartRate: 57, movements: 10 },
    { date: '2024-01-06', totalHours: 6.5, deep: 1.3, light: 4.0, rem: 1.0, awake: 0.2, quality: 68, heartRate: 64, movements: 22 },
    { date: '2024-01-07', totalHours: 8.5, deep: 2.8, light: 4.5, rem: 1.0, awake: 0.2, quality: 95, heartRate: 55, movements: 6 },
]

export default function SleepPage() {
    const [sleepData] = useState<SleepData[]>(mockSleepData)
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

    const latestSleep = sleepData[sleepData.length - 1]
    const avgQuality = sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length
    const avgHours = sleepData.reduce((sum, d) => sum + d.totalHours, 0) / sleepData.length
    const avgDeep = sleepData.reduce((sum, d) => sum + d.deep, 0) / sleepData.length

    // Chart data - Sleep hours trend
    const trendData = {
        labels: sleepData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Sleep Hours',
                data: sleepData.map(d => d.totalHours),
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Quality Score',
                data: sleepData.map(d => d.quality / 10),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    }

    const trendOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: { color: '#9ca3af' }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#00d4ff',
                borderColor: '#00d4ff',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#6b7280' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#6b7280' },
                title: { display: true, text: 'Hours', color: '#00d4ff' }
            },
            y1: {
                position: 'right' as const,
                grid: { display: false },
                ticks: { color: '#a855f7' },
                title: { display: true, text: 'Quality', color: '#a855f7' }
            }
        }
    }

    // Radar chart - Sleep quality breakdown
    const qualityData = {
        labels: ['Deep Sleep', 'Light Sleep', 'REM', 'Awake Time', 'Heart Rate', 'Movement'],
        datasets: [{
            label: 'Sleep Quality Factors',
            data: [
                (latestSleep.deep / latestSleep.totalHours) * 100,
                (latestSleep.light / latestSleep.totalHours) * 100,
                (latestSleep.rem / latestSleep.totalHours) * 100,
                100 - ((latestSleep.awake / latestSleep.totalHours) * 100),
                ((70 - latestSleep.heartRate) / 70) * 100,
                Math.max(0, 100 - (latestSleep.movements * 3))
            ],
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
            borderColor: '#00d4ff',
            borderWidth: 2,
            pointBackgroundColor: '#00d4ff',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00d4ff'
        }]
    }

    const qualityOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#00d4ff'
            }
        },
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: '#9ca3af', font: { size: 11 } },
                ticks: { display: false }
            }
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
            {/* Background */}
            <Starfield count={60} speed={0.1} />
            <FloatingParticles count={12} speed={0.08} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Sleep Analysis
                    </h1>
                    <p className="text-gray-400">Track and optimize your rest cycles</p>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <SleepStatCard
                        icon={<Moon className="w-8 h-8" />}
                        label="Last Night"
                        value={`${latestSleep.totalHours.toFixed(1)}h`}
                        trend={latestSleep.totalHours > avgHours ? 'up' : 'down'}
                        trendValue={`${Math.abs(latestSleep.totalHours - avgHours).toFixed(1)}h`}
                        color="from-blue-500 to-indigo-500"
                        delay={0}
                    />
                    <SleepStatCard
                        icon={<Zap className="w-8 h-8" />}
                        label="Sleep Quality"
                        value={`${latestSleep.quality}%`}
                        trend={latestSleep.quality > avgQuality ? 'up' : 'down'}
                        trendValue={`${Math.abs(latestSleep.quality - avgQuality).toFixed(0)}%`}
                        color="from-purple-500 to-pink-500"
                        delay={0.1}
                    />
                    <SleepStatCard
                        icon={<Brain className="w-8 h-8" />}
                        label="Deep Sleep"
                        value={`${latestSleep.deep.toFixed(1)}h`}
                        trend={latestSleep.deep > avgDeep ? 'up' : 'down'}
                        trendValue={`${Math.abs(latestSleep.deep - avgDeep).toFixed(1)}h`}
                        color="from-cyan-500 to-blue-500"
                        delay={0.2}
                    />
                    <SleepStatCard
                        icon={<Heart className="w-8 h-8" />}
                        label="Resting HR"
                        value={`${latestSleep.heartRate}`}
                        trend="stable"
                        trendValue="BPM"
                        color="from-red-500 to-pink-500"
                        delay={0.3}
                    />
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Sleep Trend */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="medical-interface rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Sleep Trends</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedPeriod('week')}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedPeriod === 'week'
                                                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                                                : 'bg-gray-700/50 border border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        Week
                                    </button>
                                    <button
                                        onClick={() => setSelectedPeriod('month')}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedPeriod === 'month'
                                                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                                                : 'bg-gray-700/50 border border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        Month
                                    </button>
                                </div>
                            </div>
                            <div style={{ height: '300px' }}>
                                <Line data={trendData} options={trendOptions} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Quality Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="medical-interface rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-semibold text-white mb-6">Quality Factors</h3>
                        <div style={{ height: '300px' }}>
                            <Radar data={qualityData} options={qualityOptions} />
                        </div>
                    </motion.div>
                </div>

                {/* Sleep Stages */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="medical-interface rounded-2xl p-6 mb-8"
                >
                    <h3 className="text-xl font-semibold text-white mb-6">Last Night's Sleep Stages</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <StageCard
                            label="Deep Sleep"
                            value={latestSleep.deep}
                            percentage={(latestSleep.deep / latestSleep.totalHours) * 100}
                            color="from-indigo-500 to-purple-500"
                            icon="🌙"
                            optimal="20-25%"
                        />
                        <StageCard
                            label="Light Sleep"
                            value={latestSleep.light}
                            percentage={(latestSleep.light / latestSleep.totalHours) * 100}
                            color="from-blue-500 to-cyan-500"
                            icon="☁️"
                            optimal="50-60%"
                        />
                        <StageCard
                            label="REM Sleep"
                            value={latestSleep.rem}
                            percentage={(latestSleep.rem / latestSleep.totalHours) * 100}
                            color="from-purple-500 to-pink-500"
                            icon="💭"
                            optimal="20-25%"
                        />
                        <StageCard
                            label="Awake"
                            value={latestSleep.awake}
                            percentage={(latestSleep.awake / latestSleep.totalHours) * 100}
                            color="from-gray-600 to-gray-500"
                            icon="👁️"
                            optimal="<5%"
                        />
                    </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="medical-interface rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5" />
                            Sleep Tips
                        </h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Your deep sleep is {latestSleep.deep > avgDeep ? 'above' : 'below'} average. {latestSleep.deep > avgDeep ? 'Great recovery!' : 'Try reducing screen time before bed.'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Maintain a consistent sleep schedule for better quality</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>Your resting heart rate is {latestSleep.heartRate < 60 ? 'excellent' : 'good'}signal of good cardiovascular fitness</span>
                            </li>
                        </ul>
                    </div>

                    <div className="medical-interface rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                            <Moon className="w-5 h-5" />
                            Optimize Your Sleep
                        </h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Try our Mindfulness exercises 30 minutes before bed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Keep your sleep environment cool (60-67°F / 15-19°C)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Avoid caffeine 6 hours before bedtime</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function SleepStatCard({ icon, label, value, trend, trendValue, color, delay }: {
    icon: React.ReactNode
    label: string
    value: string
    trend: 'up' | 'down' | 'stable'
    trendValue: string
    color: string
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="medical-interface rounded-2xl p-6"
        >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-20 mb-4`}>
                {icon}
            </div>
            <div className="text-sm text-gray-400 mb-2">{label}</div>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="flex items-center gap-1 text-xs">
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
                        {trendValue}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

function StageCard({ label, value, percentage, color, icon, optimal }: {
    label: string
    value: number
    percentage: number
    color: string
    icon: string
    optimal: string
}) {
    return (
        <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-sm text-gray-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-white mb-2">{value.toFixed(1)}h</div>
            <div className="mb-3">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${color}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                <span className="text-gray-600">Optimal: {optimal}</span>
            </div>
        </div>
    )
}
