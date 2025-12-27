'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface WellnessScoreProps {
    score: number
    trend?: 'up' | 'down' | 'stable'
    className?: string
}

/**
 * Circular wellness score indicator with trend
 */
export default function WellnessScore({ score, trend = 'stable', className = '' }: WellnessScoreProps) {
    const radius = 80
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    const getColor = (score: number) => {
        if (score >= 80) return { primary: '#00ff88', secondary: '#00cc6a', glow: 'rgba(0, 255, 136, 0.3)' }
        if (score >= 60) return { primary: '#ffeb3b', secondary: '#ffc107', glow: 'rgba(255, 235, 59, 0.3)' }
        if (score >= 40) return { primary: '#ff9800', secondary: '#f57c00', glow: 'rgba(255, 152, 0, 0.3)' }
        return { primary: '#ff6b6b', secondary: '#ff5252', glow: 'rgba(255, 107, 107, 0.3)' }
    }

    const colors = getColor(score)

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-5 h-5 text-green-400" />
            case 'down':
                return <TrendingDown className="w-5 h-5 text-red-400" />
            default:
                return <Minus className="w-5 h-5 text-gray-400" />
        }
    }

    return (
        <div className={`relative ${className}`}>
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="12"
                    fill="none"
                />

                {/* Progress Circle */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke={`url(#wellness-gradient)`}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        filter: `drop-shadow(0 0 10px ${colors.glow})`
                    }}
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="wellness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-center"
                >
                    <div className="text-5xl font-bold mb-2" style={{ color: colors.primary }}>
                        {score}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                        Wellness Score
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        {getTrendIcon()}
                    </div>
                </motion.div>
            </div>

            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{ background: colors.glow }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </div>
    )
}
