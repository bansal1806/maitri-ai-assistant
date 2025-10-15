'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Bot, Activity } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/companion', icon: Bot, label: 'Companion' },
    { href: '/medical', icon: Activity, label: 'Medical' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex justify-center">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full border border-cyan-500/30"
        >
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full transition-all ${
                  pathname === href
                    ? 'bg-cyan-500 text-black'
                    : 'text-cyan-400 hover:bg-cyan-500/20'
                }`}
                title={label}
              >
                <Icon size={20} />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </nav>
  )
}
