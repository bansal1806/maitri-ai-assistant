/**
 * Tests for emotion AI utilities
 */

import {
    getEmotionColor,
    getEmotionHexColor,
    isStrongConfidence,
    formatConfidence,
    getConfidenceLevel,
    isValidEmotionResult,
    createMockEmotionResult,
    EmotionSmoother
} from '@/lib/emotionAI'

describe('Emotion AI Utilities', () => {
    describe('getEmotionColor', () => {
        it('should return correct color for each emotion', () => {
            expect(getEmotionColor('happy')).toEqual([0, 1, 0.5])
            expect(getEmotionColor('sad')).toEqual([0, 0.5, 1])
            expect(getEmotionColor('angry')).toEqual([1, 0.2, 0])
            expect(getEmotionColor('neutral')).toEqual([0, 1, 1])
        })

        it('should return arrays of length 3', () => {
            const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'neutral'] as const
            emotions.forEach(emotion => {
                expect(getEmotionColor(emotion)).toHaveLength(3)
            })
        })
    })

    describe('getEmotionHexColor', () => {
        it('should return valid hex color strings', () => {
            const hexRegex = /^#[0-9A-F]{6}$/i
            expect(getEmotionHexColor('happy')).toMatch(hexRegex)
            expect(getEmotionHexColor('angry')).toMatch(hexRegex)
        })

        it('should convert neutral to cyan', () => {
            // neutral is [0, 1, 1] which should be cyan #00FFFF
            expect(getEmotionHexColor('neutral')).toBe('#00ffff')
        })
    })

    describe('isStrongConfidence', () => {
        it('should return true for confidence >= 0.8', () => {
            expect(isStrongConfidence(0.8)).toBe(true)
            expect(isStrongConfidence(0.9)).toBe(true)
            expect(isStrongConfidence(1.0)).toBe(true)
        })

        it('should return false for confidence < 0.8', () => {
            expect(isStrongConfidence(0.7)).toBe(false)
            expect(isStrongConfidence(0.5)).toBe(false)
            expect(isStrongConfidence(0)).toBe(false)
        })
    })

    describe('formatConfidence', () => {
        it('should format confidence as percentage', () => {
            expect(formatConfidence(0.875)).toBe('87.5%')
            expect(formatConfidence(0.5)).toBe('50.0%')
            expect(formatConfidence(1)).toBe('100.0%')
        })
    })

    describe('getConfidenceLevel', () => {
        it('should return correct level for confidence ranges', () => {
            expect(getConfidenceLevel(0.95)).toBe('Very High')
            expect(getConfidenceLevel(0.85)).toBe('High')
            expect(getConfidenceLevel(0.7)).toBe('Moderate')
            expect(getConfidenceLevel(0.5)).toBe('Low')
            expect(getConfidenceLevel(0.3)).toBe('Very Low')
        })
    })

    describe('isValidEmotion Result', () => {
        it('should validate correct emotion results', () => {
            const valid = {
                emotion: 'happy' as const,
                confidence: 0.85,
                timestamp: Date.now()
            }
            expect(isValidEmotionResult(valid)).toBe(true)
        })

        it('should reject invalid emotion', () => {
            const invalid = {
                emotion: 'invalid',
                confidence: 0.85,
                timestamp: Date.now()
            }
            expect(isValidEmotionResult(invalid)).toBe(false)
        })

        it('should reject invalid confidence', () => {
            const invalid = {
                emotion: 'happy',
                confidence: 1.5, // > 1
                timestamp: Date.now()
            }
            expect(isValidEmotionResult(invalid)).toBe(false)
        })
    })

    describe('createMockEmotionResult', () => {
        it('should create valid mock result', () => {
            const mock = createMockEmotionResult()
            expect(isValidEmotionResult(mock)).toBe(true)
        })

        it('should use specified emotion when provided', () => {
            const mock = createMockEmotionResult('happy')
            expect(mock.emotion).toBe('happy')
        })

        it('should have confidence between 0.6 and 1', () => {
            const mock = createMockEmotionResult()
            expect(mock.confidence).toBeGreaterThanOrEqual(0.6)
            expect(mock.confidence).toBeLessThanOrEqual(1.0)
        })
    })

    describe('EmotionSmoother', () => {
        let smoother: EmotionSmoother

        beforeEach(() => {
            smoother = new EmotionSmoother(3)
        })

        it('should return smoothed emotion', () => {
            const result1 = createMockEmotionResult('happy')
            const result2 = createMockEmotionResult('happy')

            smoother.addResult(result1)
            const smoothed = smoother.addResult(result2)

            expect(smoothed.emotion).toBe('happy')
        })

        it('should find dominant emotion', () => {
            smoother.addResult(createMockEmotionResult('happy'))
            smoother.addResult(createMockEmotionResult('happy'))
            const smoothed = smoother.addResult(createMockEmotionResult('sad'))

            expect(smoothed.emotion).toBe('happy') // 2 happy vs 1 sad
        })

        it('should reset history', () => {
            smoother.addResult(createMockEmotionResult('happy'))
            smoother.reset()

            const smoothed = smoother.addResult(createMockEmotionResult('sad'))
            expect(smoothed.emotion).toBe('sad')
        })
    })
})
