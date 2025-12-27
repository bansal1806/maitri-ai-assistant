'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
    onComplete?: () => void
}

/**
 * Futuristic loading screen with MAITRI branding
 * Shows mission initialization sequence
 */
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)

    const loadingSteps = [
        'Initializing MAITRI Core Systems...',
        'Loading AI Modules...',
        'Calibrating Emotion Detection...',
        'Establishing Neural Networks...',
        'Synchronizing Biometric Sensors...',
        'Preparing Holographic Interface...',
        'Mission Ready'
    ]

    useEffect(() => {
        const duration = 3000 // 3 seconds total
        const steps = loadingSteps.length
        const stepDuration = duration / steps

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    if (onComplete) {
                        setTimeout(onComplete, 500)
                    }
                    return 100
                }
                return prev + (100 / (duration / 50)) // Update every 50ms
            })
        }, 50)

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps - 1) {
                    clearInterval(stepInterval)
                    return steps - 1
                }
                return prev + 1
            })
        }, stepDuration)

        return () => {
            clearInterval(progressInterval)
            clearInterval(stepInterval)
        }
    }, [loadingSteps.length, onComplete])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    animation: 'grid-move 20s linear infinite'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">

                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="relative inline-block">
                        {/* Glow Effect */}
                        <motion.div
                            animate={{
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 blur-3xl bg-cyan-500/30"
                        />

                        {/* Logo Text */}
                        <h1 className="relative text-8xl font-bold holographic font-['Orbitron']">
                            MAITRI
                        </h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                    >
                        AI Companion System
                    </motion.p>
                </motion.div>

                {/* Loading Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/30">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />

                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-y-0 left-0 right-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                width: '30%'
                            }}
                            animate={{
                                x: ['-100%', '400%']
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />
                    </div>

                    <div className="flex justify-between mt-2 text-sm">
                        <span className="text-cyan-400 font-mono">{Math.round(progress)}%</span>
                        <span className="text-gray-500">Loading...</span>
                    </div>
                </div>

                {/* Loading Steps */}
                <motion.div
                    className="h-16"
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <p className="text-gray-400 text-sm">
                        {loadingSteps[currentStep]}
                    </p>
                </motion.div>

                {/* Status Indicators */}
                <div className="mt-8 flex justify-center gap-2">
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i <= currentStep ? 'bg-cyan-400' : 'bg-gray-700'
                                }`}
                            animate={i === currentStep ? {
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    ))}
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30" />
            <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-cyan-500/30" />
            <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-cyan-500/30" />
            <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30" />

            <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }
      `}</style>
        </motion.div>
    )
}
