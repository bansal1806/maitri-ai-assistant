'use client'

import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    z: number
    size: number
    speed: number
}

interface StarfieldProps {
    count?: number
    speed?: number
    className?: string
}

/**
 * Animated 3D starfield background effect
 * Creates an immersive space environment
 */
export default function Starfield({
    count = 200,
    speed = 0.5,
    className = ''
}: StarfieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const starsRef = useRef<Star[]>([])
    const animationRef = useRef<number>()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Initialize stars
        const initStars = () => {
            starsRef.current = Array.from({ length: count }, () => ({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * 1000,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.5
            }))
        }
        initStars()

        // Animation loop
        const animate = () => {
            // Clear with fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            starsRef.current.forEach((star) => {
                // Move star towards camera
                star.z -= star.speed * speed

                // Reset star if it goes behind camera
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * canvas.width * 2
                    star.y = (Math.random() - 0.5) * canvas.height * 2
                    star.z = 1000
                }

                // Project 3D position to 2D
                const scale = 1000 / (1000 + star.z)
                const x2d = star.x * scale + centerX
                const y2d = star.y * scale + centerY

                // Calculate trail opacity based on speedscale * 2
                const size = star.size * scale * 2
                const alpha = Math.min(1, (1000 - star.z) / 500)

                // Draw star
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.beginPath()
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
                ctx.fill()

                // Draw motion trail
                if (speed > 0.3) {
                    const trailLength = speed * 20
                    const prevZ = star.z + star.speed * speed * 3
                    const prevScale = 1000 / (1000 + prevZ)
                    const px2d = star.x * prevScale + centerX
                    const py2d = star.y * prevScale + centerY

                    const gradient = ctx.createLinearGradient(px2d, py2d, x2d, y2d)
                    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
                    gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`)

                    ctx.strokeStyle = gradient
                    ctx.lineWidth = size / 2
                    ctx.beginPath()
                    ctx.moveTo(px2d, py2d)
                    ctx.lineTo(x2d, y2d)
                    ctx.stroke()
                }
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [count, speed])

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 -z-10 ${className}`}
            style={{ background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)' }}
        />
    )
}
