'use client'

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { useHealthStore } from '@/lib/store'
import { format } from 'date-fns'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface VitalChartProps {
    type: 'heartRate' | 'temperature' | 'oxygenSaturation' | 'stressLevel'
    height?: number
}

/**
 * Real-time vital signs chart component
 */
export default function VitalChart({ type, height = 200 }: VitalChartProps) {
    const { vitalHistory } = useHealthStore()

    const getChartConfig = () => {
        switch (type) {
            case 'heartRate':
                return {
                    label: 'Heart Rate (BPM)',
                    color: '#ff6b9d',
                    gradientStart: 'rgba(255, 107, 157, 0.4)',
                    gradientEnd: 'rgba(255, 107, 157, 0)',
                    min: 40,
                    max: 140
                }
            case 'temperature':
                return {
                    label: 'Temperature (°F)',
                    color: '#ffb347',
                    gradientStart: 'rgba(255, 179, 71, 0.4)',
                    gradientEnd: 'rgba(255, 179, 71, 0)',
                    min: 96,
                    max: 102
                }
            case 'oxygenSaturation':
                return {
                    label: 'SpO₂ (%)',
                    color: '#00d4ff',
                    gradientStart: 'rgba(0, 212, 255, 0.4)',
                    gradientEnd: 'rgba(0, 212, 255, 0)',
                    min: 85,
                    max: 100
                }
            case 'stressLevel':
                return {
                    label: 'Stress Level',
                    color: '#b794f6',
                    gradientStart: 'rgba(183, 148, 246, 0.4)',
                    gradientEnd: 'rgba(183, 148, 246, 0)',
                    min: 0,
                    max: 10
                }
        }
    }

    const config = getChartConfig()
    const last20 = vitalHistory.slice(-20)

    const data = {
        labels: last20.map(v => format(v.timestamp, 'HH:mm')),
        datasets: [
            {
                label: config.label,
                data: last20.map(v => {
                    switch (type) {
                        case 'heartRate':
                            return v.heartRate
                        case 'temperature':
                            return v.temperature
                        case 'oxygenSaturation':
                            return v.oxygenSaturation
                        case 'stressLevel':
                            return v.stressLevel
                    }
                }),
                borderColor: config.color,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx
                    const gradient = ctx.createLinearGradient(0, 0, 0, height)
                    gradient.addColorStop(0, config.gradientStart)
                    gradient.addColorStop(1, config.gradientEnd)
                    return gradient
                },
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: config.color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: config.color,
                borderColor: config.color,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    },
                    maxRotation: 0
                }
            },
            y: {
                min: config.min,
                max: config.max,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    }

    if (vitalHistory.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No data available</div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: `${height}px` }}>
            <Line data={data} options={options} />
        </div>
    )
}
