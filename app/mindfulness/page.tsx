'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import Starfield from '@/components/effects/Starfield'
import FloatingParticles from '@/components/effects/FloatingParticles'

interface ExerciseStep {
    instruction: string
    duration: number // in seconds
    type: 'inhale' | 'hold' | 'exhale' | 'rest'
}

const exercises = {
    boxBreathing: {
        name: 'Box Breathing',
        description: 'Equal breathing pattern for stress reduction',
        duration: 240, // 4 minutes
        icon: '📦',
        steps: [
            { instruction: 'Inhale deeply', duration: 4, type: 'inhale' as const },
            { instruction: 'Hold your breath', duration: 4, type: 'hold' as const },
            { instruction: 'Exhale slowly', duration: 4, type: 'exhale' as const },
            { instruction: 'Hold empty', duration: 4, type: 'hold' as const },
        ]
    },
    deepBreathing: {
        name: '4-7-8 Breathing',
        description: 'Calming breath for sleep and anxiety',
        duration: 180, // 3 minutes
        icon: '🌊',
        steps: [
            { instruction: 'Breathe in through nose', duration: 4, type: 'inhale' as const },
            { instruction: 'Hold your breath', duration: 7, type: 'hold' as const },
            { instruction: 'Exhale completely', duration: 8, type: 'exhale' as const },
        ]
    },
    bodyScan: {
        name: 'Body Scan Meditation',
        description: 'Progressive relaxation technique',
        duration: 600, // 10 minutes
        icon: '🧘',
        steps: [
            { instruction: 'Focus on your toes', duration: 30, type: 'rest' as const },
            { instruction: 'Feel your feet', duration: 30, type: 'rest' as const },
            { instruction: 'Relax your legs', duration: 30, type: 'rest' as const },
            { instruction: 'Release your hips', duration: 30, type: 'rest' as const },
            { instruction: 'Soften your belly', duration: 30, type: 'rest' as const },
            { instruction: 'Relax your chest', duration: 30, type: 'rest' as const },
            { instruction: 'Release shoulders', duration: 30, type: 'rest' as const },
            { instruction: 'Relax your arms', duration: 30, type: 'rest' as const },
            { instruction: 'Soften your face', duration: 30, type: 'rest' as const },
            { instruction: 'Total body awareness', duration: 150, type: 'rest' as const },
        ]
    },
    mindfulBreathing: {
        name: 'Mindful Breathing',
        description: 'Simple awareness practice',
        duration: 300, // 5 minutes
        icon: '🍃',
        steps: [
            { instruction: 'Notice your natural breath', duration: 60, type: 'rest' as const },
            { instruction: 'Follow the inhale', duration: 60, type: 'inhale' as const },
            { instruction: 'Follow the exhale', duration: 60, type: 'exhale' as const },
            { instruction: 'Observe without judgment', duration: 120, type: 'rest' as const },
        ]
    }
}

export default function MindfulnessPage() {
    const [selectedExercise, setSelectedExercise] = useState<keyof typeof exercises | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentExercise = selectedExercise ? exercises[selectedExercise] : null
    const currentStep = currentExercise?.steps[currentStepIndex]

    useEffect(() => {
        if (isPlaying && currentExercise && currentStep) {
            if (timeRemaining === 0) {
                setTimeRemaining(currentStep.duration)
            }

            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        // Move to next step
                        if (currentStepIndex < currentExercise.steps.length - 1) {
                            setCurrentStepIndex((i) => i + 1)
                            playSound(currentExercise.steps[currentStepIndex + 1].type)
                            return currentExercise.steps[currentStepIndex + 1].duration
                        } else {
                            // Exercise completed
                            setIsPlaying(false)
                            playSound('complete')
                            return 0
                        }
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isPlaying, currentStepIndex, currentExercise, currentStep, timeRemaining])

    const startExercise = (exerciseKey: keyof typeof exercises) => {
        setSelectedExercise(exerciseKey)
        setCurrentStepIndex(0)
        setTimeRemaining(exercises[exerciseKey].steps[0].duration)
        setTotalTime(exercises[exerciseKey].duration)
        setIsPlaying(true)
        playSound('start')
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
        if (!isPlaying) {
            playSound(currentStep?.type || 'start')
        }
    }

    const reset = () => {
        setIsPlaying(false)
        setCurrentStepIndex(0)
        if (currentExercise) {
            setTimeRemaining(currentExercise.steps[0].duration)
        }
    }

    const playSound = (type: string) => {
        if (isMuted) return

        // In production, use actual audio files
        // For now, using Web Audio API to generate tones
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const audioContext = new AudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        const frequencies: Record<string, number> = {
            inhale: 440,
            exhale: 330,
            hold: 380,
            rest: 350,
            start: 523,
            complete: 659
        }

        oscillator.frequency.value = frequencies[type] || 440
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
    }

    const progress = currentExercise ? ((totalTime - timeRemaining - (currentExercise.steps.slice(0, currentStepIndex).reduce((sum: number, step: ExerciseStep) => sum + step.duration, 0))) / totalTime) * 100 : 0

    return (
        <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
            {/* Background */}
            <Starfield count={80} speed={0.1} />
            <FloatingParticles count={15} speed={0.1} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400">
                        Mindfulness & Meditation
                    </h1>
                    <p className="text-gray-400">Find peace and balance in the cosmos</p>
                </motion.div>

                {!selectedExercise ? (
                    /* Exercise Selection */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {(Object.keys(exercises) as Array<keyof typeof exercises>).map((key, index) => (
                            <ExerciseCard
                                key={key}
                                exercise={exercises[key]}
                                onStart={() => startExercise(key)}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                ) : (
                    /* Active Exercise */
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="medical-interface rounded-3xl p-8 relative overflow-hidden"
                        >
                            {/* Background gradient based on step type */}
                            <div
                                className={`absolute inset-0 opacity-10 transition-all duration-1000 ${currentStep?.type === 'inhale' ? 'bg-gradient-to-t from-cyan-500 to-blue-500' :
                                    currentStep?.type === 'exhale' ? 'bg-gradient-to-b from-purple-500 to-pink-500' :
                                        currentStep?.type === 'hold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            'bg-gradient-to-br from-green-500 to-teal-500'
                                    }`}
                            />

                            {/* Exercise Info */}
                            <div className="relative z-10 text-center mb-8">
                                <div className="text-6xl mb-4">{currentExercise.icon}</div>
                                <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
                                <p className="text-gray-400">{currentExercise.description}</p>
                            </div>

                            {/* Breathing Circle */}
                            <div className="relative flex items-center justify-center mb-8" style={{ height: '300px' }}>
                                <motion.div
                                    className="absolute rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-400/30 backdrop-blur-xl border-2 border-cyan-400/50"
                                    animate={{
                                        scale: currentStep?.type === 'inhale' ? [1, 1.5] :
                                            currentStep?.type === 'exhale' ? [1.5, 1] :
                                                [1, 1],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{
                                        duration: currentStep?.duration || 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{ width: '200px', height: '200px' }}
                                />

                                <div className="relative z-10 text-center">
                                    <div className="text-6xl font-bold mb-4">{timeRemaining}s</div>
                                    <div className="text-xl text-cyan-400 capitalize">{currentStep?.instruction}</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Step {currentStepIndex + 1} of {currentExercise.steps.length}</span>
                                    <span>{Math.floor((totalTime - timeRemaining) / 60)}:{((totalTime - timeRemaining) % 60).toString().padStart(2, '0')} / {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={togglePlay}
                                    className="p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={reset}
                                    className="p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50 transition-all"
                                >
                                    <RotateCcw size={24} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50 transition-all"
                                >
                                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedExercise(null)
                                        setIsPlaying(false)
                                    }}
                                    className="px-6 py-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all"
                                >
                                    Exit
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Tips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 p-6 rounded-2xl bg-green-500/10 border border-green-500/30"
                        >
                            <h3 className="text-lg font-semibold text-green-400 mb-3">💡 Tips</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• Find a comfortable seated or lying position</li>
                                <li>• Close your eyes or soften your gaze</li>
                                <li>• Breathe naturally through your nose</li>
                                <li>• Let go of distractions and focus inward</li>
                            </ul>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ExerciseCard({ exercise, onStart, delay }: {
    exercise: typeof exercises[keyof typeof exercises]
    onStart: () => void
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="medical-interface rounded-2xl p-6 cursor-pointer hover:border-cyan-500/50 transition-all"
            onClick={onStart}
        >
            <div className="text-5xl mb-4">{exercise.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-white">{exercise.name}</h3>
            <p className="text-gray-400 mb-4">{exercise.description}</p>
            <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-400">{Math.floor(exercise.duration / 60)} minutes</span>
                <span className="text-gray-500">{exercise.steps.length} steps</span>
            </div>
        </motion.div>
    )
}
