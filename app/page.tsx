'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Heart, Brain, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-8xl font-bold mb-8 holographic"
          animate={{
            textShadow: [
              '0 0 20px #00ffff',
              '0 0 40px #ff00ff',
              '0 0 20px #ffff00',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          MAITRI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl mb-12 text-gray-300"
        >
          AI-Powered Multimodal Assistant for Astronaut Well-Being
        </motion.p>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg medical-interface"
          >
            <Brain className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold mb-2">Emotional Support</h3>
            <p className="text-gray-400">AI companion for psychological well-being</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg medical-interface"
          >
            <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Health Monitoring</h3>
            <p className="text-gray-400">Real-time biometric analysis</p>
          </motion.div>
        </div>

        <div className="flex gap-6 justify-center">
          <Link href="/companion">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-lg neon-glow"
            >
              <Sparkles className="inline mr-2" />
              Meet Your Companion
            </motion.button>
          </Link>

          <Link href="/medical">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg font-semibold text-lg neon-glow"
            >
              <Zap className="inline mr-2" />
              Health Dashboard
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
