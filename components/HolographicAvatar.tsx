'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { createHolographicMaterial } from '@/lib/holographicShaders'

function Avatar({ emotion }: { emotion: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
    if (groupRef.current) {
      // Rotate based on emotion intensity
      const rotationSpeed = emotion === 'happy' ? 0.8 : emotion === 'angry' ? 1.2 : 0.5
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.1
    }
  })

  // Get emotion-based color
  const getEmotionColor = (currentEmotion: string): [number, number, number] => {
    switch (currentEmotion) {
      case 'happy': return [0, 1, 0.5] // Green-cyan
      case 'sad': return [0, 0.5, 1]   // Blue
      case 'angry': return [1, 0.2, 0] // Red
      case 'surprised': return [1, 1, 0] // Yellow
      case 'fearful': return [0.8, 0, 1] // Purple
      default: return [0, 1, 1] // Cyan (neutral)
    }
  }

  const holographicMat = createHolographicMaterial(getEmotionColor(emotion))

  return (
    <group ref={groupRef}>
      {/* Main avatar sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          {...holographicMat}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Emotion-based facial features */}
      {emotion === 'happy' && (
        <>
          {/* Happy eyes */}
          <mesh position={[-0.5, 0.5, 1.8]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
          <mesh position={[0.5, 0.5, 1.8]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
          {/* Smile */}
          <mesh position={[0, -0.3, 1.8]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
        </>
      )}

      {emotion === 'sad' && (
        <>
          {/* Sad eyes */}
          <mesh position={[-0.5, 0.3, 1.8]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#4488ff" />
          </mesh>
          <mesh position={[0.5, 0.3, 1.8]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#4488ff" />
          </mesh>
          {/* Frown */}
          <mesh position={[0, -0.5, 1.8]}>
            <torusGeometry args={[0.25, 0.04, 8, 16, Math.PI]} />
            <meshBasicMaterial color="#4488ff" />
          </mesh>
        </>
      )}

      {emotion === 'angry' && (
        <>
          {/* Angry eyes */}
          <mesh position={[-0.5, 0.6, 1.8]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <meshBasicMaterial color="#ff4400" />
          </mesh>
          <mesh position={[0.5, 0.6, 1.8]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <meshBasicMaterial color="#ff4400" />
          </mesh>
        </>
      )}
      
      {/* Floating energy particles around avatar */}
      {[...Array(15)].map((_, i) => {
        const angle = (i / 15) * Math.PI * 2
        const radius = 3 + Math.sin(i) * 0.5
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle + Date.now() * 0.001) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial 
              color={getEmotionColor(emotion)} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        )
      })}

      {/* Energy ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.1, 8, 32]} />
        <meshBasicMaterial 
          color={getEmotionColor(emotion)} 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export default function HolographicAvatar({ emotion }: { emotion: string }) {
  return (
    <div className="w-full h-96 bg-black/20 rounded-lg">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff00ff" />
        
        <Avatar emotion={emotion} />
        
        {/* Holographic floor grid */}
        <gridHelper 
          args={[20, 20, '#00ffff', '#004444']} 
          position={[0, -4, 0]} 
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Holographic Avatar - Current Emotion: <span className="capitalize text-cyan-400 font-semibold">{emotion}</span>
        </p>
      </div>
    </div>
  )
}
