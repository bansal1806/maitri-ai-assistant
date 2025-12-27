'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, Send, Sparkles, Brain, Heart } from 'lucide-react'
import Advanced3DAvatar from '@/components/Advanced3DAvatar'
import EmotionDetector from '@/components/EmotionDetector'
import VoiceProcessor from '@/components/VoiceProcessor'
import Starfield from '@/components/effects/Starfield'
import FloatingParticles from '@/components/effects/FloatingParticles'
import { useConversationStore, useEmotionStore } from '@/lib/store'

export default function CompanionPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [inputText, setInputText] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const { messages, addMessage } = useConversationStore()
  const { currentEmotion } = useEmotionStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const emotionResponses = {
    happy: [
      "It's wonderful to see you in such good spirits! Your positive energy is infectious.",
      "I love seeing that smile! What's bringing you joy today?",
    ],
    sad: [
      "I notice you might be feeling down. Would you like to talk about what's on your mind?",
      "I'm here for you. Sometimes sharing our feelings can help lighten the load.",
    ],
    stressed: [
      "I can sense some tension. Let's take a deep breath together and work through this.",
      "It's okay to feel stressed. Would some calming exercises help right now?",
    ],
    neutral: [
      "How can I support you today? I'm here whenever you need me.",
      "I'm listening and ready to help with whatever you need.",
    ],
    calm: [
      "You seem peaceful. It's great to see you in this state.",
      "Your calm energy is wonderful. Let's maintain this balance together.",
    ],
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    // Add user message
    addMessage({
      role: 'user',
      content: inputText
    })

    setInputText('')
    setIsSpeaking(true)

    // Simulate AI response
    setTimeout(() => {
      const emotion = currentEmotion?.emotion || 'neutral'
      const responses = emotionResponses[emotion as keyof typeof emotionResponses] || emotionResponses.neutral
      const response = responses[Math.floor(Math.random() * responses.length)]

      addMessage({
        role: 'assistant',
        content: response
      })
      setIsSpeaking(false)
    }, 1500)
  }

  const handleVoiceInput = (transcript: string) => {
    addMessage({
      role: 'user',
      content: transcript
    })
    setIsListening(false)
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled) {
      setIsListening(true)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Background */}
      <Starfield count={100} speed={0.2} />
      <FloatingParticles count={20} speed={0.15} />

      <div className="container mx-auto px-4 pb-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            Your AI Companion
          </h1>
          <p className="text-gray-400">MAITRI is here to support your well-being</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: 3D Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="medical-interface rounded-2xl p-6 overflow-hidden" style={{ height: '600px' }}>
              <Advanced3DAvatar
                emotion={currentEmotion?.emotion || 'calm'}
                isListening={isListening}
                isSpeaking={isSpeaking}
                scale={1}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <StatCard
                icon={<Brain className="w-5 h-5" />}
                label="Emotion"
                value={currentEmotion?.emotion || 'Calm'}
                color="purple"
              />
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label="Confidence"
                value={currentEmotion ? `${Math.round(currentEmotion.confidence * 100)}%` : '--'}
                color="pink"
              />
              <StatCard
                icon={<Sparkles className="w-5 h-5" />}
                label="Status"
                value="Active"
                color="cyan"
              />
            </div>

            {/* Emotion & Voice Detection */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="medical-interface rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3 text-cyan-400">Emotion Monitor</h3>
                <EmotionDetector onEmotionDetected={() => {
                  // Emotion updates handled by store
                }} />
              </div>
              <div className="medical-interface rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3 text-purple-400">Voice Input</h3>
                <VoiceProcessor
                  onTranscript={handleVoiceInput}
                  isListening={isListening}
                  onListeningChange={setIsListening}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Conversation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="medical-interface rounded-2xl p-6 flex flex-col" style={{ height: '600px' }}>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-500/20">
                <h3 className="text-lg font-semibold text-white">Conversation</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoice}
                    className={`p-3 rounded-lg transition-all ${voiceEnabled
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : 'bg-gray-700/50 border border-gray-600 text-gray-400'
                      }`}
                  >
                    {voiceEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-400 transition-all"
                  >
                    <Volume2 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-500 mt-20"
                    >
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                      <p className="mb-2">Start a conversation with MAITRI</p>
                      <p className="text-sm">I&apos;m here to listen and support you</p>
                    </motion.div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/30'
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className="text-xs opacity-50 mt-2">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/50"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <QuickActionCard
                title="Mindfulness"
                description="Start a guided session"
                icon="🧘"
                color="from-green-500/20 to-teal-500/20"
                border="border-green-500/30"
              />
              <QuickActionCard
                title="Sleep Help"
                description="Relaxation techniques"
                icon="😴"
                color="from-blue-500/20 to-indigo-500/20"
                border="border-blue-500/30"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

// Helper Components

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="medical-interface rounded-xl p-4 text-center">
      <div className={`inline-flex p-2 rounded-lg bg-${color}-500/20 mb-2 text-${color}-400`}>
        {icon}
      </div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-sm font-semibold text-white capitalize">{value}</div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color, border }: {
  title: string
  description: string
  icon: string
  color: string
  border: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${color} border ${border} text-left transition-all hover:shadow-lg`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-semibold text-white mb-1">{title}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </motion.button>
  )
}
