'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    color: string
    alpha: number
}

interface FloatingParticlesProps {
    count?: number
    colors?: string[]
    speed?: number
    className?: string
}

/**
 * Floating particles effect for ambient atmosphere
 * Creates gentle floating dust/energy particles
 */
export default function FloatingParticles({
    count = 50,
    colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffd700'],
    speed = 0.3,
    className = ''
}: FloatingParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
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

        // Initialize particles
        const initParticles = () => {
            particlesRef.current = Array.from({ length: count }, () => {
                const maxLife = Math.random() * 200 + 100
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed * 0.5 - speed * 0.2, // Slight upward bias
                    life: Math.random() * maxLife,
                    maxLife,
                    size: Math.random() * 3 + 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.5 + 0.3
                }
            })
        }
        initParticles()

        // Animation loop
        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach((particle, index) => {
                // Update position
                particle.x += particle.vx
                particle.y += particle.vy
                particle.life++

                // Fade in/out based on life
                const lifeCycle = particle.life / particle.maxLife
                let alpha = particle.alpha
                if (lifeCycle < 0.1) {
                    alpha *= lifeCycle / 0.1
                } else if (lifeCycle > 0.9) {
                    alpha *= (1 - lifeCycle) / 0.1
                }

                // Reset particle if it dies or goes off screen
                if (
                    particle.life >= particle.maxLife ||
                    particle.x < -50 ||
                    particle.x > canvas.width + 50 ||
                    particle.y < -50 ||
                    particle.y > canvas.height + 50
                ) {
                    const maxLife = Math.random() * 200 + 100
                    particle.x = Math.random() * canvas.width
                    particle.y = canvas.height + 50
                    particle.vx = (Math.random() - 0.5) * speed
                    particle.vy = (Math.random() - 0.5) * speed * 0.5 - speed * 0.2
                    particle.life = 0
                    particle.maxLife = maxLife
                    particle.size = Math.random() * 3 + 1
                    particle.color = colors[Math.floor(Math.random() * colors.length)]
                    particle.alpha = Math.random() * 0.5 + 0.3
                }

                // Draw particle with glow
                const hexToRgb = (hex: string) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : { r: 0, g: 255, b: 255 }
                }

                const rgb = hexToRgb(particle.color)
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 3
                )
                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`)
                gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`)
                gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
                ctx.fill()

                // Draw core
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()

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
    }, [count, colors, speed])

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
