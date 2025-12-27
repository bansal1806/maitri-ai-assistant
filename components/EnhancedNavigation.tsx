'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Menu, X, MessageCircle, Activity, Bot, Brain, Moon, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function EnhancedNavigation() {
    const pathname = usePathname()
    const [missionTime, setMissionTime] = useState(0)
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Mission timer
    useEffect(() => {
        const startDate = new Date('2024-01-01')
        const updateTimer = () => {
            const now = new Date()
            const diff = now.getTime() - startDate.getTime()
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            setMissionTime(days)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { href: '/', icon: Home, label: 'Home', color: 'cyan' },
        { href: '/companion', icon: Bot, label: 'Companion', color: 'purple' },
        { href: '/medical', icon: Activity, label: 'Medical', color: 'green' },
        { href: '/mindfulness', icon: Brain, label: 'Mindfulness', color: 'teal' },
        { href: '/sleep', icon: Moon, label: 'Sleep', color: 'indigo' },
    ]

    const getColorClass = (color: string, active: boolean) => {
        if (active) {
            switch (color) {
                case 'cyan': return 'bg-cyan-500 text-black';
                case 'purple': return 'bg-purple-500 text-white';
                case 'green': return 'bg-green-500 text-black';
                case 'teal': return 'bg-teal-500 text-black';
                case 'indigo': return 'bg-indigo-500 text-white';
                default: return 'bg-gray-500 text-white';
            }
        }
        return `text-${color}-400 hover:bg-${color}-500/20`
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-black/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo/Brand */}
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div className="relative">
                                    <Sparkles className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                    <motion.div
                                        className="absolute inset-0"
                                        animate={{
                                            opacity: [0.5, 1, 0.5],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-8 h-8 text-cyan-400/50" />
                                    </motion.div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white font-['Orbitron']">MAITRI</h1>
                                    <p className="text-xs text-gray-400">AI Companion</p>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Mission Info */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-gray-400">Mission Day</span>
                                <span className="text-cyan-400 font-bold font-mono">{missionTime}</span>
                            </div>
                            <div className="h-4 w-px bg-gray-700" />
                            <div className="text-gray-400">
                                Status: <span className="text-green-400">Operational</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-full border border-cyan-500/20">
                            {navItems.map(({ href, icon: Icon, label, color }) => {
                                const isActive = pathname === href
                                return (
                                    <Link key={href} href={href}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${isActive
                                                ? color === 'cyan' ? 'bg-cyan-500 text-black' :
                                                    color === 'purple' ? 'bg-purple-500 text-white' :
                                                        'bg-green-500 text-black'
                                                : `text-${color}-400 hover:bg-${color}-500/20`
                                                }`}
                                            title={label}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 rounded-full"
                                                    style={{
                                                        boxShadow: color === 'cyan' ? '0 0 20px rgba(0, 255, 255, 0.5)' :
                                                            color === 'purple' ? '0 0 20px rgba(168, 85, 247, 0.5)' :
                                                                '0 0 20px rgba(34, 197, 94, 0.5)'
                                                    }}
                                                />
                                            )}
                                            <Icon size={18} className="relative z-10" />
                                            {isActive && (
                                                <motion.span
                                                    initial={{ width: 0, opacity: 0 }}
                                                    animate={{ width: 'auto', opacity: 1 }}
                                                    className="relative z-10 font-semibold text-sm"
                                                >
                                                    {label}
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-xl pt-20"
                    >
                        <div className="container mx-auto px-4 py-8">
                            {/* Mission Info Mobile */}
                            <div className="mb-8 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-400">Mission Day</span>
                                    <span className="text-cyan-400 font-bold font-mono">{missionTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-green-400">Operational</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Nav Items */}
                            <div className="space-y-4">
                                {navItems.map(({ href, icon: Icon, label, color }) => {
                                    const isActive = pathname === href
                                    return (
                                        <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-4 rounded-xl border transition-all ${isActive
                                                    ? color === 'cyan' ? 'bg-cyan-500/20 border-cyan-500' :
                                                        color === 'purple' ? 'bg-purple-500/20 border-purple-500' :
                                                            'bg-green-500/20 border-green-500'
                                                    : 'bg-gray-900/50 border-gray-700 hover:border-cyan-500/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-lg ${color === 'cyan' ? 'bg-cyan-500/20' :
                                                        color === 'purple' ? 'bg-purple-500/20' :
                                                            'bg-green-500/20'
                                                        }`}>
                                                        <Icon size={24} className={`text-${color}-400`} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-semibold ${isActive ? `text-${color}-400` : 'text-white'
                                                            }`}>
                                                            {label}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {href === '/' ? 'Dashboard' :
                                                                href === '/companion' ? 'AI Interface' :
                                                                    'Health Monitoring'}
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <div className="ml-auto">
                                                            <div className={`w-2 h-2 rounded-full bg-${color}-400 animate-pulse`} />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
