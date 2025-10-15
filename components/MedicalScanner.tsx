'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface VitalSigns {
  heartRate: number
  bloodPressure: { systolic: number; diastolic: number }
  temperature: number
  oxygenSaturation: number
  stressLevel: number
}

function BodyModel({ vitals }: { vitals: VitalSigns }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const getHealthColor = (): string => {
    const avgHealth = (
      (vitals.heartRate >= 60 && vitals.heartRate <= 100 ? 1 : 0) +
      (vitals.temperature >= 97.8 && vitals.temperature <= 99.1 ? 1 : 0) +
      (vitals.oxygenSaturation >= 95 ? 1 : 0) +
      (vitals.stressLevel <= 4 ? 1 : 0)
    ) / 4

    if (avgHealth > 0.75) return '#00ff00' // Green - Healthy
    if (avgHealth > 0.5) return '#ffff00'  // Yellow - Caution
    return '#ff6600' // Orange - Concern
  }

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[1, 3, 4, 8]} />
        <meshStandardMaterial 
          color={getHealthColor()} 
          transparent 
          opacity={0.7}
          wireframe
        />
      </mesh>

      {/* Heart indicator */}
      <mesh position={[-0.3, 1, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={vitals.heartRate / 200}
        />
      </mesh>

      {/* Stress indicators */}
      {vitals.stressLevel > 5 && (
        <>
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.2, 1.8, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {/* Temperature visualization */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial 
          color={vitals.temperature > 99 ? "#ff6600" : "#0066ff"}
          emissive={vitals.temperature > 99 ? "#ff6600" : "#0066ff"}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export default function MedicalScanner({ vitals }: { vitals: VitalSigns }) {
  return (
    <div className="w-full h-96 bg-black/30 rounded-lg">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#0066ff" />
        
        <BodyModel vitals={vitals} />
        
        {/* Grid floor */}
        <gridHelper args={[10, 10, '#333333', '#333333']} position={[0, -3, 0]} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          3D Body Analysis - Real-time health visualization
        </p>
      </div>
    </div>
  )
}
