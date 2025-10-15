'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import HolographicAvatar from '@/components/HolographicAvatar'
import EmotionDetector from '@/components/EmotionDetector'
import VoiceProcessor from '@/components/VoiceProcessor'
import { Mic, MessageSquare, Heart } from 'lucide-react'

interface Message {
  type: 'user' | 'assistant'
  content: string
  timestamp: number
  emotion?: string
}

interface EmotionResult {
  emotion: string
  confidence: number
  timestamp: number
}

export default function CompanionPage() {
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: 'Hello! I&apos;m MAITRI, your AI companion. I&apos;m here to support you throughout your mission. How are you feeling today?',
      timestamp: Date.now()
    }
  ])

  const emotionResponses = {
    happy: [
      "It&apos;s wonderful to see you in such good spirits! Your positive energy is infectious.",
      "I love seeing that smile! What&apos;s bringing you joy today?",
    ],
    sad: [
      "I notice you might be feeling down. Would you like to talk about what&apos;s on your mind?",
      "I&apos;m here for you. Sometimes sharing our feelings can help lighten the load.",
    ],
    angry: [
      "I can sense some tension. Let&apos;s take a deep breath together and work through this.",
      "It&apos;s okay to feel frustrated. Would some calming exercises help right now?",
    ],
    surprised: [
      "Something caught your attention! Tell me what&apos;s on your mind.",
      "You seem surprised! I&apos;m curious about what you&apos;re thinking.",
    ],
    neutral: [
      "How can I support you today? I&apos;m here whenever you need me.",
      "I&apos;m listening and ready to help with whatever you need.",
    ],
    fearful: [
      "I&apos;m sensing some anxiety. Remember, you&apos;re safe and you&apos;re not alone.",
      "Let&apos;s work through this together. You&apos;ve overcome challenges before.",
    ]
  }

  const handleEmotionDetected = (emotion: EmotionResult) => {
    setCurrentEmotion(emotion.emotion)
    
    // Auto-respond to strong emotions
    if (emotion.confidence > 0.8 && emotion.emotion !== 'neutral') {
      const responses = emotionResponses[emotion.emotion as keyof typeof emotionResponses] || emotionResponses.neutral
      const response = responses[Math.floor(Math.random() * responses.length)]
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: response,
          timestamp: Date.now(),
          emotion: emotion.emotion
        }])
      }, 1000)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setMessages(prev => [...prev, {
      type: 'user',
      content: transcript,
      timestamp: Date.now()
    }])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand what you&apos;re saying. Let me help you with that.",
        "That&apos;s an interesting perspective. Can you tell me more?",
        "I&apos;m processing your input and considering the best way to support you.",
        "Thank you for sharing that with me. Your feelings are valid."
      ]
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      }])
    }, 2000)
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold holographic mb-4">
            Your AI Companion
          </h1>
          <p className="text-gray-400">
            I&apos;m here to provide emotional support and companionship during your mission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Section */}
          <div className="medical-interface rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="mr-2 text-red-400" />
              MAITRI Avatar
            </h2>
            <HolographicAvatar emotion={currentEmotion} />
            
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <div className="text-sm text-cyan-400 mb-2">Current Status:</div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentEmotion === 'happy' ? 'bg-green-400' :
                  currentEmotion === 'sad' ? 'bg-blue-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-gray-400'
                }`} />
                <span className="capitalize">{currentEmotion}</span>
              </div>
            </div>
          </div>

          {/* Interaction Section */}
          <div className="space-y-6">
            {/* Emotion Detection */}
            <div className="medical-interface rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Emotion Monitoring</h3>
              <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            </div>

            {/* Voice Interaction */}
            <div className="medical-interface rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Mic className="mr-2" />
                Voice Interaction
              </h3>
              <VoiceProcessor 
                onTranscript={handleVoiceInput}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="mt-8 medical-interface rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2 text-blue-400" />
            Conversation Log
          </h2>
          
          <div className="h-64 overflow-y-auto space-y-3 mb-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.type === 'user' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
