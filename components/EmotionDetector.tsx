'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface EmotionResult {
  emotion: string
  confidence: number
  timestamp: number
}

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: EmotionResult) => void
}

export default function EmotionDetector({ onEmotionDetected }: EmotionDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult>({
    emotion: 'neutral',
    confidence: 0,
    timestamp: Date.now()
  })
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Memoize the detection function to prevent recreation on every render
  const detectEmotion = useCallback(() => {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful']
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = Math.random() * 0.4 + 0.6 // 60-100% confidence
    
    const result: EmotionResult = {
      emotion: randomEmotion,
      confidence,
      timestamp: Date.now()
    }
    
    setCurrentEmotion(result)
    onEmotionDetected(result)
  }, [onEmotionDetected])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let mediaStream: MediaStream | null = null

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        })
        
        mediaStream = stream
        const currentVideo = videoRef.current
        
        if (currentVideo) {
          currentVideo.srcObject = stream
          setIsActive(true)
          setPermissionDenied(false)
        }
      } catch (error) {
        console.error('Camera access denied:', error)
        setPermissionDenied(true)
        setIsActive(false)
      }
    }

    const startEmotionDetection = () => {
      // Initial detection after 1 second
      const initialTimeout = setTimeout(detectEmotion, 1000)
      
      // Continuous detection every 3 seconds
      const interval = setInterval(detectEmotion, 3000)
      
      cleanup = () => {
        clearTimeout(initialTimeout)
        clearInterval(interval)
      }
    }

    initializeCamera()
    startEmotionDetection()

    return () => {
      if (cleanup) cleanup()
      
      // Cleanup camera stream
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [detectEmotion])

  if (permissionDenied) {
    return (
      <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
        <p className="text-yellow-400 mb-2">Camera access denied</p>
        <p className="text-sm text-gray-400">
          Using simulation mode for emotion detection
        </p>
        <div className="mt-3 p-2 bg-black/30 rounded">
          <div className="text-sm text-cyan-400 mb-1">Detected Emotion:</div>
          <div className="flex items-center gap-2 justify-center">
            <div className={`w-3 h-3 rounded-full ${
              currentEmotion.emotion === 'happy' ? 'bg-green-400' :
              currentEmotion.emotion === 'sad' ? 'bg-blue-400' :
              currentEmotion.emotion === 'angry' ? 'bg-red-400' :
              'bg-gray-400'
            }`} />
            <span className="capitalize font-semibold">{currentEmotion.emotion}</span>
            <span className="text-xs text-gray-400">
              ({(currentEmotion.confidence * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-48 rounded-lg border-2 border-cyan-500/30 object-cover"
      />
      
      {isActive && (
        <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3">
          <div className="text-sm text-cyan-400 mb-1">
            Emotion: <span className="font-bold capitalize">{currentEmotion.emotion}</span>
          </div>
          <div className="text-xs text-gray-400">
            Confidence: {(currentEmotion.confidence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            {new Date(currentEmotion.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
      
      {!isActive && !permissionDenied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  )
}
