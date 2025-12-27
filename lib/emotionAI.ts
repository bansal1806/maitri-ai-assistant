/**
 * Emotion AI utility functions
 * Provides helper functions for emotion detection and analysis
 */

export type EmotionType = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral' | 'fearful'

export interface EmotionResult {
    emotion: EmotionType
    confidence: number
    timestamp: number
}

export interface EmotionColor {
    r: number
    g: number
    b: number
}

/**
 * Maps emotion types to their corresponding colors
 * @param emotion - The detected emotion
 * @returns RGB color tuple for the emotion
 */
export function getEmotionColor(emotion: EmotionType): [number, number, number] {
    const colorMap: Record<EmotionType, [number, number, number]> = {
        happy: [0, 1, 0.5], // Green-cyan
        sad: [0, 0.5, 1], // Blue
        angry: [1, 0.2, 0], // Red
        surprised: [1, 1, 0], // Yellow
        fearful: [0.8, 0, 1], // Purple
        neutral: [0, 1, 1] // Cyan
    }

    return colorMap[emotion]
}

/**
 * Gets a hex color string for an emotion
 * @param emotion - The detected emotion
 * @returns Hex color string (e.g., "#00FF80")
 */
export function getEmotionHexColor(emotion: EmotionType): string {
    const [r, g, b] = getEmotionColor(emotion)
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Determines if a confidence score is considered strong
 * @param confidence - Confidence score (0-1)
 * @returns True if confidence is above threshold
 */
export function isStrongConfidence(confidence: number): boolean {
    const CONFIDENCE_THRESHOLD = 0.8
    return confidence >= CONFIDENCE_THRESHOLD
}

/**
 * Formats confidence as a percentage string
 * @param confidence - Confidence score (0-1)
 * @returns Formatted percentage (e.g., "87.5%")
 */
export function formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`
}

/**
 * Gets a human-readable description of confidence level
 * @param confidence - Confidence score (0-1)
 * @returns Description string
 */
export function getConfidenceLevel(confidence: number): string {
    if (confidence >= 0.9) return 'Very High'
    if (confidence >= 0.75) return 'High'
    if (confidence >= 0.6) return 'Moderate'
    if (confidence >= 0.4) return 'Low'
    return 'Very Low'
}

/**
 * Validates an emotion result object
 * @param result - Emotion result to validate
 * @returns True if valid
 */
export function isValidEmotionResult(result: Partial<EmotionResult>): result is EmotionResult {
    return (
        typeof result.emotion === 'string' &&
        ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful'].includes(result.emotion) &&
        typeof result.confidence === 'number' &&
        result.confidence >= 0 &&
        result.confidence <= 1 &&
        typeof result.timestamp === 'number'
    )
}

/**
 * Creates a mock emotion result for testing
 * @param emotion - Optional specific emotion, otherwise random
 * @returns Mock emotion result
 */
export function createMockEmotionResult(emotion?: EmotionType): EmotionResult {
    const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful']
    const selectedEmotion = emotion || emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = Math.random() * 0.4 + 0.6 // 60-100%

    return {
        emotion: selectedEmotion,
        confidence,
        timestamp: Date.now()
    }
}

/**
 * Smooths emotion detection results over time to reduce flickering
 */
export class EmotionSmoother {
    private history: EmotionResult[] = []
    private maxHistory: number

    constructor(maxHistory: number = 5) {
        this.maxHistory = maxHistory
    }

    /**
     * Adds a new result and returns smoothed emotion
     * @param result - New emotion result
     * @returns Smoothed emotion result
     */
    addResult(result: EmotionResult): EmotionResult {
        this.history.push(result)
        if (this.history.length > this.maxHistory) {
            this.history.shift()
        }

        // Count occurrences of each emotion
        const emotionCounts: Partial<Record<EmotionType, number>> = {}
        const confidenceSum: Partial<Record<EmotionType, number>> = {}

        this.history.forEach(r => {
            emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1
            confidenceSum[r.emotion] = (confidenceSum[r.emotion] || 0) + r.confidence
        })

        // Find most common emotion
        let maxCount = 0
        let dominantEmotion: EmotionType = 'neutral'
        let avgConfidence = 0

        Object.entries(emotionCounts).forEach(([emotion, count]) => {
            if (count && count > maxCount) {
                maxCount = count
                dominantEmotion = emotion as EmotionType
                avgConfidence = (confidenceSum[emotion as EmotionType] || 0) / count
            }
        })

        return {
            emotion: dominantEmotion,
            confidence: avgConfidence,
            timestamp: Date.now()
        }
    }

    /**
     * Clears the emotion history
     */
    reset(): void {
        this.history = []
    }
}
