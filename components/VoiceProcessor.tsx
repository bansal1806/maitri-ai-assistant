'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface VoiceProcessorProps {
  onTranscript: (transcript: string) => void
  isListening: boolean
  onListeningChange: (listening: boolean) => void
}

export default function VoiceProcessor({ 
  onTranscript, 
  isListening, 
  onListeningChange 
}: VoiceProcessorProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<unknown | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setIsSupported(true)
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }
        
        setTranscript(interimTranscript || finalTranscript)
        
        if (finalTranscript) {
          onTranscript(finalTranscript.trim())
          setTranscript('')
        }
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        onListeningChange(false)
      }
      
      recognition.onend = () => {
        onListeningChange(false)
      }
      
      recognitionRef.current = recognition
    }
    
    return () => {
      if (recognitionRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).stop()
      }
    }
  }, [onTranscript, onListeningChange])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop()
      onListeningChange(false)
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).start()
        onListeningChange(true)
      } catch (error) {
        console.error('Failed to start recognition:', error)
        onListeningChange(false)
      }
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-500/30">
        <p className="text-red-400">Voice recognition not supported in this browser.</p>
        <p className="text-sm text-gray-400">Please use Chrome or Edge for voice features.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`p-4 rounded-full border-2 transition-all ${
            isListening
              ? 'bg-red-500 border-red-400 text-white'
              : 'bg-cyan-500 border-cyan-400 text-white hover:bg-cyan-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => speakText('Hello, I am MAITRI, your AI companion.')}
          className="p-4 rounded-full border-2 border-purple-400 bg-purple-500 text-white hover:bg-purple-600 transition-all"
          aria-label="Test voice output"
        >
          <Volume2 size={24} />
        </motion.button>
      </div>
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-black/50 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">Listening...</span>
          </div>
          
          {transcript && (
            <div className="text-gray-300 italic">
              &quot;{transcript}&quot;
            </div>
          )}
        </motion.div>
      )}
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Click the microphone to start voice interaction
        </p>
      </div>
    </div>
  )
}
