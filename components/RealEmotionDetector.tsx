'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CameraOff, AlertCircle, CheckCircle } from 'lucide-react'
import { startEmotionDetection } from '@/lib/ai/realEmotionDetection'
import { useEmotionStore } from '@/lib/store'
import type { FaceDetectionResult } from '@/lib/ai/realEmotionDetection'

interface RealEmotionDetectorProps {
    onEmotionDetected?: (result: FaceDetectionResult) => void
    showVideo?: boolean
    className?: string
}

/**
 * Real-time emotion detection component using webcam
 */
export default function RealEmotionDetector({
    onEmotionDetected,
    showVideo = true,
    className = ''
}: RealEmotionDetectorProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [isInitializing, setIsInitializing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastDetection, setLastDetection] = useState<FaceDetectionResult | null>(null)
    const { updateEmotion } = useEmotionStore()
    const cleanupRef = useRef<(() => void) | null>(null)

    const startDetection = async () => {
        if (!videoRef.current) return

        setIsInitializing(true)
        setError(null)

        try {
            const cleanup = await startEmotionDetection(
                videoRef.current,
                (result) => {
                    setLastDetection(result)

                    // Update global emotion store
                    updateEmotion({
                        emotion: result.emotion,
                        confidence: result.confidence,
                        timestamp: Date.now()
                    })

                    // Call callback if provided
                    onEmotionDetected?.(result)

                    // Draw landmarks on canvas if showing video
                    if (showVideo && canvasRef.current && videoRef.current) {
                        drawLandmarks(result)
                    }
                },
                1000 // Detect every second
            )

            cleanupRef.current = cleanup
            setIsActive(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start detection')
            console.error('Emotion detection error:', err)
        } finally {
            setIsInitializing(false)
        }
    }

    const stopDetection = () => {
        if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
        }
        setIsActive(false)
        setLastDetection(null)
    }

    const drawLandmarks = (result: FaceDetectionResult) => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw landmarks
        ctx.fillStyle = '#00ffff'
        result.facialLandmarks.forEach(([x, y]) => {
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, 2 * Math.PI)
            ctx.fill()
        })
    }

    useEffect(() => {
        return () => {
            stopDetection()
        }
    }, [])

    const getEmotionColor = (emotion: string) => {
        const colors: Record<string, string> = {
            happy: '#ffd700',
            sad: '#4a9eff',
            stressed: '#ff6b6b',
            calm: '#00e5cc',
            excited: '#ff00ff',
            neutral: '#00ffff'
        }
        return colors[emotion] || colors.neutral
    }

    return (
        <div className={`relative ${className}`}>
            {/* Video Feed */}
            {showVideo && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover mirror"
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                    />

                    {/* Overlay */}
                    {!isActive && !isInitializing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="text-center">
                                <Camera className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
                                <p className="text-gray-400 mb-4">Camera not active</p>
                            </div>
                        </div>
                    )}

                    {/* Detection Indicator */}
                    <AnimatePresence>
                        {isActive && lastDetection && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-4 left-4 right-4"
                            >
                                <div className="glass-effect rounded-lg p-3 border border-cyan-500/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full animate-pulse"
                                                style={{ backgroundColor: getEmotionColor(lastDetection.emotion) }}
                                            />
                                            <span className="text-white font-semibold capitalize">
                                                {lastDetection.emotion}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {Math.round(lastDetection.confidence * 100)}% confidence
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Controls */}
            <div className="mt-4 flex gap-3">
                {!isActive ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startDetection}
                        disabled={isInitializing}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        {isInitializing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            <>
                                <Camera size={20} />
                                Start Detection
                            </>
                        )}
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopDetection}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/50 transition-all"
                    >
                        <CameraOff size={20} />
                        Stop Detection
                    </motion.button>
                )}
            </div>

            {/* Status Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-semibold mb-1">Detection Error</p>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50"
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-green-400 font-semibold mb-1">Detection Active</p>
                                <p className="text-green-300 text-sm">
                                    AI is analyzing your facial expressions in real-time
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    )
}
