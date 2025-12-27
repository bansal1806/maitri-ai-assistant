'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useEmotionStore } from '@/lib/store'

interface Advanced3DAvatarProps {
    emotion?: string
    isListening?: boolean
    isSpeaking?: boolean
    scale?: number
}

/**
 * Holographic Avatar Core - The 3D mesh
 */
function AvatarCore({ emotion = 'neutral', isListening, isSpeaking }: {
    emotion: string
    isListening?: boolean
    isSpeaking?: boolean
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    // Emotion-based colors
    const emotionColors = useMemo(() => ({
        happy: new THREE.Color('#ffd700'),
        sad: new THREE.Color('#4a9eff'),
        stressed: new THREE.Color('#ff6b6b'),
        calm: new THREE.Color('#00e5cc'),
        excited: new THREE.Color('#ff00ff'),
        tired: new THREE.Color('#9b9b9b'),
        neutral: new THREE.Color('#00ffff')
    }), [])

    const currentColor = emotionColors[emotion as keyof typeof emotionColors] || emotionColors.neutral

    // Animation
    useFrame((state) => {
        if (!meshRef.current || !groupRef.current) return

        const time = state.clock.getElapsedTime()

        // Gentle floating animation
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.2

        // Rotation
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2

        // Breathing effect
        const breathScale = 1 + Math.sin(time * 1.5) * 0.05
        meshRef.current.scale.set(breathScale, breathScale, breathScale)

        // Pulse when speaking
        if (isSpeaking) {
            const pulse = 1 + Math.sin(time * 10) * 0.15
            meshRef.current.scale.set(pulse, pulse, pulse)
        }

        // Glow when listening
        if (isListening) {
            const glow = Math.sin(time * 3) * 0.5 + 0.5
            const material = meshRef.current.material as THREE.MeshStandardMaterial
            material.emissiveIntensity = glow * 2
        }
    })

    return (
        <group ref={groupRef}>
            {/* Main avatar sphere */}
            <Sphere ref={meshRef} args={[1.5, 64, 64]} castShadow>
                <MeshDistortMaterial
                    color={currentColor}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={currentColor}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            {/* Inner core */}
            <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial
                    color={currentColor}
                    emissive={currentColor}
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            {/* Holographic rings */}
            {[1.8, 2.2, 2.6].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[radius, 0.02, 16, 100]} />
                    <meshStandardMaterial
                        color={currentColor}
                        emissive={currentColor}
                        emissiveIntensity={1}
                        transparent
                        opacity={0.3 - i * 0.1}
                    />
                </mesh>
            ))}

            {/* Particle field */}
            <ParticleField color={currentColor} />
        </group>
    )
}

/**
 * Particle field around avatar
 */
function ParticleField({ color }: { color: THREE.Color }) {
    const pointsRef = useRef<THREE.Points>(null)

    const particles = useMemo(() => {
        const positions = new Float32Array(200 * 3)
        for (let i = 0; i < 200; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            const radius = 2.5 + Math.random() * 1

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = radius * Math.cos(phi)
        }
        return positions
    }, [])

    useFrame((state) => {
        if (!pointsRef.current) return
        pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={color}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

/**
 * Advanced 3D Avatar Component
 */
export default function Advanced3DAvatar({
    emotion = 'neutral',
    isListening = false,
    isSpeaking = false,
    scale = 1
}: Advanced3DAvatarProps) {
    const { currentEmotion } = useEmotionStore()
    const activeEmotion = currentEmotion?.emotion || emotion

    return (
        <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />

                {/* Avatar */}
                <group scale={scale}>
                    <AvatarCore
                        emotion={activeEmotion}
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                    />
                </group>

                {/* Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    autoRotate={!isListening && !isSpeaking}
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Status overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-full glass-effect border border-cyan-500/30"
                >
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-400 animate-pulse' :
                        isSpeaking ? 'bg-purple-400 animate-pulse' :
                            'bg-cyan-400'
                        }`} />
                    <span className="text-sm font-medium text-white">
                        {isListening ? 'Listening...' :
                            isSpeaking ? 'Speaking...' :
                                `Feeling ${activeEmotion}`}
                    </span>
                </motion.div>
            </div>
        </div>
    )
}
