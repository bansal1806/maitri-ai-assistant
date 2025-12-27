'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Heart, Brain, Zap, Activity, Mic, Eye, Shield } from 'lucide-react'
import Starfield from '@/components/effects/Starfield'
import FloatingParticles from '@/components/effects/FloatingParticles'

export default function EnhancedHome() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Effects */}
      <Starfield count={300} speed={0.8} />
      <FloatingParticles count={60} />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-black/50 pointer-events-none -z-5" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-32"
        >
          {/* Logo/Title with Holographic Effect */}
          <motion.div
            className="mb-8 inline-block"
            animate={{
              textShadow: [
                '0 0 20px #00ffff, 0 0 40px #00ffff',
                '0 0 30px #ff00ff, 0 0 60px #ff00ff',
                '0 0 20px #ffff00, 0 0 40px #ffff00',
                '0 0 20px #00ffff, 0 0 40px #00ffff',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <h1 className="text-8xl md:text-9xl font-bold holographic mb-4">
              MAITRI
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <p className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-semibold mb-4">
              Your AI Companion in the Cosmos
            </p>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              AI-Powered Multimodal Assistant for Psychological & Physical Well-Being of Astronauts
            </p>
          </motion.div>

          {/* Mission Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex  justify-center gap-8 mb-12 flex-wrap"
          >
            <StatCounter label="Mission Days" value={45} suffix=" days" />
            <StatCounter label="Crew Supported" value={100} suffix="+" />
            <StatCounter label="Emotions Detected" value={1000} suffix="+" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex gap-6 justify-center flex-wrap"
          >
            <Link href="/companion">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-xl text-white shadow-lg hover:shadow-cyan-500/50 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Meet Your Companion
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link href="/medical">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 136, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl font-bold text-xl text-white shadow-lg hover:shadow-green-500/50 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Activity className="w-6 h-6" />
                  Health Dashboard
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Advanced Multimodal Support
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12" />}
              title="Emotion AI"
              description="Real-time facial expression and voice tone analysis"
              color="from-cyan-500 to-blue-500"
              delay={0}
            />
            <FeatureCard
              icon={<Heart className="w-12 h-12" />}
              title="Health Monitoring"
              description="Continuous biometric tracking and wellness insights"
              color="from-red-500 to-pink-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<Mic className="w-12 h-12" />}
              title="Voice Interaction"
              description="Natural conversation with adaptive tone matching"
              color="from-purple-500 to-indigo-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Instant Support"
              description="AI-powered coping strategies and mindfulness"
              color="from-yellow-500 to-orange-500"
              delay={0.3}
            />
          </div>
        </motion.section>

        {/* Capabilities Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            Addressing Critical Challenges
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChallengeCard
              title="Isolation & Loneliness"
              solution="MAITRI acts as a virtual companion to reduce psychological stress"
              icon="🤝"
            />
            <ChallengeCard
              title="Sleep Disruption & Fatigue"
              solution="Detects tiredness and suggests personalized rest routines"
              icon="😴"
            />
            <ChallengeCard
              title="High Stress & Workload"
              solution="Provides calming guidance, mindfulness, and coping strategies"
              icon="🧘"
            />
            <ChallengeCard
              title="Monotony & Motivation Loss"
              solution="Keeps crew engaged with interactive content and positive reinforcement"
              icon="🎯"
            />
          </div>
        </motion.section>

        {/* Innovation Highlights */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">
            Innovation & Uniqueness
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <InnovationCard
              title="Multimodal Recognition"
              description="Combines audio, visual, and physiological signals for comprehensive emotion detection"
              icon={<Eye className="w-10 h-10" />}
            />
            <InnovationCard
              title="Adaptive Conversations"
              description="AI that adjusts tone and language in real-time to match astronaut's mood"
              icon={<Brain className="w-10 h-10" />}
            />
            <InnovationCard
              title="Offline Reliability"
              description="Functions without internet connection, crucial for deep space missions"
              icon={<Shield className="w-10 h-10" />}
            />
          </div>

          {/* Final CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl"
          >
            <h3 className="text-3xl font-bold mb-4 text-white">Ready to Experience MAITRI?</h3>
            <p className="text-gray-300 mb-6">
              Join the future of astronaut well-being support
            </p>
            <Link href="/companion">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl font-bold text-lg text-white shadow-lg neon-glow"
              >
                Start Your Journey
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

// Helper Components

function StatCounter({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-cyan-400 mb-2">
        {value}{suffix}
      </div>
      <div className="text-sm text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  )
}

function FeatureCard({ icon, title, description, color, delay }: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-500/50 transition-all group"
    >
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} mb-6 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function ChallengeCard({ title, solution, icon }: { title: string; solution: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
      className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-purple-300">{title}</h3>
      <p className="text-gray-300 leading-relaxed">→ {solution}</p>
    </motion.div>
  )
}

function InnovationCard({ title, description, icon }: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 backdrop-blur-xl"
    >
      <div className="text-yellow-400 mb-4 flex justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 text-yellow-300">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  )
}
