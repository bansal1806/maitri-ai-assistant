/**
 * Real-time Emotion Detection using TensorFlow.js and MediaPipe
 * Analyzes facial expressions to detect emotions
 */

import * as tf from '@tensorflow/tfjs'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import type { EmotionType } from './emotionAI'
import { useEmotionStore } from './store'

export interface FaceDetectionResult {
    emotion: EmotionType
    confidence: number
    facialLandmarks: number[][]
    actionUnits?: {
        innerBrow: number
        outerBrow: number
        upperLip: number
        jawDrop: number
        lipCorner: number
    }
}

class RealEmotionDetector {
    private detector: faceLandmarksDetection.FaceLandmarksDetector | null = null
    private isInitialized = false
    private videoElement: HTMLVideoElement | null = null

    /**
     * Initialize the face detection model
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return

        try {
            // Load TensorFlow.js
            await tf.ready()

            // Create detector with MediaPipe
            const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
            const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
                runtime: 'mediapipe',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
                maxFaces: 1,
                refineLandmarks: true
            }

            this.detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
            this.isInitialized = true
            console.log('✅ Face detection model initialized')
        } catch (error) {
            console.error('Failed to initialize face detection:', error)
            throw error
        }
    }

    /**
     * Start webcam stream
     */
    async startVideo(videoElement: HTMLVideoElement): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            })

            videoElement.srcObject = stream
            this.videoElement = videoElement

            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play()
                    resolve()
                }
            })
        } catch (error) {
            console.error('Failed to start video:', error)
            throw error
        }
    }

    /**
     * Stop webcam stream
     */
    stopVideo(): void {
        if (this.videoElement?.srcObject) {
            const stream = this.videoElement.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            this.videoElement.srcObject = null
        }
    }

    /**
     * Detect faces and analyze emotions
     */
    async detectEmotion(videoElement: HTMLVideoElement): Promise<FaceDetectionResult | null> {
        if (!this.detector || !this.isInitialized) {
            console.warn('Detector not initialized')
            return null
        }

        try {
            const faces = await this.detector.estimateFaces(videoElement, {
                flipHorizontal: false
            })

            if (faces.length === 0) {
                return null
            }

            const face = faces[0]
            const keypoints = face.keypoints

            // Extract facial landmarks
            const landmarks = keypoints.map(kp => [kp.x, kp.y])

            // Calculate facial action units (simplified)
            const actionUnits = this.calculateActionUnits(keypoints)

            // Determine emotion from action units
            const emotion = this.determineEmotion(actionUnits)

            return {
                emotion: emotion.type,
                confidence: emotion.confidence,
                facialLandmarks: landmarks,
                actionUnits
            }
        } catch (error) {
            console.error('Error detecting emotion:', error)
            return null
        }
    }

    /**
     * Calculate facial action units from landmarks
     */
    private calculateActionUnits(keypoints: faceLandmarksDetection.Keypoint[]): {
        innerBrow: number
        outerBrow: number
        upperLip: number
        jawDrop: number
        lipCorner: number
    } {
        // Simplified action unit calculation
        // In production, use more sophisticated algorithms

        // Get key facial points (MediaPipe face mesh indices)
        const leftEyebrow = keypoints[107] // Left inner eyebrow
        const rightEyebrow = keypoints[336] // Right inner eyebrow
        const noseTip = keypoints[1] // Nose tip
        const upperLip = keypoints[13] // Upper lip
        const lowerLip = keypoints[14] // Lower lip
        const leftMouth = keypoints[61] // Left mouth corner
        const rightMouth = keypoints[291] // Right mouth corner

        // Calculate distances (normalized)
        const browHeight = Math.abs(leftEyebrow.y - noseTip.y)
        const mouthOpen = Math.abs(upperLip.y - lowerLip.y)
        const mouthWidth = Math.abs(leftMouth.x - rightMouth.x)
        const smileIntensity = (rightMouth.y - upperLip.y) / mouthWidth

        return {
            innerBrow: browHeight / 100, // Normalized 0-1
            outerBrow: browHeight / 100,
            upperLip: smileIntensity,
            jawDrop: mouthOpen / 50,
            lipCorner: smileIntensity
        }
    }

    /**
     * Determine emotion from action units
     */
    private determineEmotion(actionUnits: {
        innerBrow: number
        outerBrow: number
        upperLip: number
        jawDrop: number
        lipCorner: number
    }): { type: EmotionType; confidence: number } {
        // Simplified emotion detection based on facial action units

        // Happy: Smile (lip corners up, mouth width increases)
        if (actionUnits.lipCorner > 0.3 && actionUnits.jawDrop < 0.4) {
            return { type: 'happy', confidence: Math.min(actionUnits.lipCorner * 2, 0.95) }
        }

        // Sad: Brows down, lip corners down
        if (actionUnits.innerBrow < 0.2 && actionUnits.lipCorner < -0.1) {
            return { type: 'sad', confidence: 0.7 }
        }

        // Surprised: Eyebrows raised, mouth open
        if (actionUnits.innerBrow > 0.6 && actionUnits.jawDrop > 0.5) {
            return { type: 'excited', confidence: 0.8 }
        }

        // Stressed/Angry: Brows furrowed, tight lips
        if (actionUnits.innerBrow > 0.4 && actionUnits.jawDrop < 0.2) {
            return { type: 'stressed', confidence: 0.75 }
        }

        // Neutral: Default
        return { type: 'neutral', confidence: 0.6 }
    }

    /**
     * Clean up resources
     */
    dispose(): void {
        this.stopVideo()
        this.detector = null
        this.isInitialized = false
    }
}

// Singleton instance
let detectorInstance: RealEmotionDetector | null = null

/**
 * Get or create detector instance
 */
export function getEmotionDetector(): RealEmotionDetector {
    if (!detectorInstance) {
        detectorInstance = new RealEmotionDetector()
    }
    return detectorInstance
}

/**
 * Start continuous emotion detection
 */
export async function startEmotionDetection(
    videoElement: HTMLVideoElement,
    onDetection: (result: FaceDetectionResult) => void,
    intervalMs: number = 1000
): Promise<() => void> {
    const detector = getEmotionDetector()

    // Initialize if needed
    if (!detector['isInitialized']) {
        await detector.initialize()
    }

    // Start video
    await detector.startVideo(videoElement)

    // Start detection loop
    const intervalId = setInterval(async () => {
        const result = await detector.detectEmotion(videoElement)
        if (result) {
            onDetection(result)
        }
    }, intervalMs)

    // Return cleanup function
    return () => {
        clearInterval(intervalId)
        detector.stopVideo()
    }
}
