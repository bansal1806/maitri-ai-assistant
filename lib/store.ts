/**
 * Global State Management for MAITRI
 * Uses Zustand for lightweight, performant state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EmotionType } from '@/lib/emotionAI'

// ============================================================================
// TYPES
// ============================================================================

export interface VitalSigns {
    heartRate: number
    bloodPressure: { systolic: number; diastolic: number }
    temperature: number
    oxygenSaturation: number
    stressLevel: number
    respiratoryRate: number
    timestamp: number
}

export interface EmotionState {
    emotion: EmotionType
    confidence: number
    timestamp: number
}

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
    emotion?: EmotionType
}

export interface UserProfile {
    name: string
    rank: string
    mission: string
    startDate: string
}

// ============================================================================
// HEALTH STORE
// ============================================================================

interface HealthState {
    currentVitals: VitalSigns | null
    vitalHistory: VitalSigns[]
    alerts: string[]
    wellnessScore: number

    // Actions
    updateVitals: (vitals: VitalSigns) => void
    addAlert: (alert: string) => void
    clearAlerts: () => void
    calculateWellnessScore: () => void
}

export const useHealthStore = create<HealthState>((set, get) => ({
    currentVitals: null,
    vitalHistory: [],
    alerts: [],
    wellnessScore: 100,

    updateVitals: (vitals) => {
        set((state) => ({
            currentVitals: vitals,
            vitalHistory: [...state.vitalHistory, vitals].slice(-50) // Keep last 50
        }))
        get().calculateWellnessScore()
    },

    addAlert: (alert) => {
        set((state) => ({
            alerts: [...state.alerts, alert].slice(-20) // Keep last 20
        }))
    },

    clearAlerts: () => set({ alerts: [] }),

    calculateWellnessScore: () => {
        const vitals = get().currentVitals
        if (!vitals) return

        let score = 100

        // Heart rate scoring
        if (vitals.heartRate < 60 || vitals.heartRate > 100) score -= 20
        else if (vitals.heartRate < 65 || vitals.heartRate > 90) score -= 10

        // Temperature scoring
        if (vitals.temperature < 97.0 || vitals.temperature > 100.4) score -= 15
        else if (vitals.temperature < 97.8 || vitals.temperature > 99.1) score -= 5

        // Oxygen saturation
        if (vitals.oxygenSaturation < 95) score -= 20
        else if (vitals.oxygenSaturation < 97) score -= 10

        // Stress level
        if (vitals.stressLevel > 7) score -= 15
        else if (vitals.stressLevel > 5) score -= 8

        set({ wellnessScore: Math.max(0, Math.min(100, score)) })
    }
}))

// ============================================================================
// EMOTION STORE
// ============================================================================

interface EmotionStoreState {
    currentEmotion: EmotionState | null
    emotionHistory: EmotionState[]

    // Actions
    updateEmotion: (emotion: EmotionState) => void
    getDominantEmotion: () => EmotionType | null
}

export const useEmotionStore = create<EmotionStoreState>((set, get) => ({
    currentEmotion: null,
    emotionHistory: [],

    updateEmotion: (emotion) => {
        set((state) => ({
            currentEmotion: emotion,
            emotionHistory: [...state.emotionHistory, emotion].slice(-100)
        }))
    },

    getDominantEmotion: () => {
        const history = get().emotionHistory.slice(-10) // Last 10 emotions
        if (history.length === 0) return null

        const counts: Partial<Record<EmotionType, number>> = {}
        history.forEach(e => {
            counts[e.emotion] = (counts[e.emotion] || 0) + 1
        })

        let maxCount = 0
        let dominant: EmotionType = 'neutral'
        Object.entries(counts).forEach(([emotion, count]) => {
            if (count && count > maxCount) {
                maxCount = count
                dominant = emotion as EmotionType
            }
        })

        return dominant
    }
}))

// ============================================================================
// CONVERSATION STORE
// ============================================================================

interface ConversationState {
    messages: Message[]
    isListening: boolean
    isSpeaking: boolean

    // Actions
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
    clearMessages: () => void
    setListening: (listening: boolean) => void
    setSpeaking: (speaking: boolean) => void
}

export const useConversationStore = create<ConversationState>()(
    persist(
        (set) => ({
            messages: [],
            isListening: false,
            isSpeaking: false,

            addMessage: (message) => {
                const newMessage: Message = {
                    ...message,
                    id: `msg-${Date.now()}-${Math.random()}`,
                    timestamp: Date.now()
                }
                set((state) => ({
                    messages: [...state.messages, newMessage].slice(-100) // Keep last 100
                }))
            },

            clearMessages: () => set({ messages: [] }),
            setListening: (listening) => set({ isListening: listening }),
            setSpeaking: (speaking) => set({ isSpeaking: speaking })
        }),
        {
            name: 'maitri-conversation-storage',
            partialize: (state) => ({ messages: state.messages })
        }
    )
)

// ============================================================================
// USER PROFILE STORE
// ============================================================================

interface ProfileState {
    profile: UserProfile | null
    preferences: {
        voiceEnabled: boolean
        cameraEnabled: boolean
        bluetoothEnabled: boolean
        notificationsEnabled: boolean
        theme: 'dark' | 'light'
    }

    // Actions
    setProfile: (profile: UserProfile) => void
    updatePreferences: (preferences: Partial<ProfileState['preferences']>) => void
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            profile: null,
            preferences: {
                voiceEnabled: true,
                cameraEnabled: true,
                bluetoothEnabled: true,
                notificationsEnabled: true,
                theme: 'dark'
            },

            setProfile: (profile) => set({ profile }),

            updatePreferences: (newPreferences) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...newPreferences }
                }))
        }),
        {
            name: 'maitri-profile-storage'
        }
    )
)

// ============================================================================
// APP STATE STORE
// ============================================================================

interface AppState {
    isLoading: boolean
    isInitialized: boolean
    connectionStatus: 'connected' | 'disconnected' | 'connecting'

    // Actions
    setLoading: (loading: boolean) => void
    setInitialized: (initialized: boolean) => void
    setConnectionStatus: (status: AppState['connectionStatus']) => void
}

export const useAppStore = create<AppState>((set) => ({
    isLoading: false,
    isInitialized: false,
    connectionStatus: 'disconnected',

    setLoading: (loading) => set({ isLoading: loading }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
    setConnectionStatus: (status) => set({ connectionStatus: status })
}))

// ============================================================================
// COMBINED HOOKS
// ============================================================================

/**
 * Hook for accessing all vital statistics
 */
export function useVitalStats() {
    const { currentVitals, vitalHistory, wellnessScore } = useHealthStore()
    const { currentEmotion } = useEmotionStore()

    return {
        vitals: currentVitals,
        history: vitalHistory,
        wellnessScore,
        emotion: currentEmotion
    }
}

/**
 * Hook for accessing conversation state
 */
export function useConversation() {
    const { messages, addMessage, isListening, isSpeaking } = useConversationStore()

    return {
        messages,
        addMessage,
        isListening,
        isSpeaking
    }
}
