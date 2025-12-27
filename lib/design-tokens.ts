/**
 * Design Tokens for MAITRI AI Assistant
 * Space-themed design system with cosmic aesthetics
 */

// ============================================================================
// COLOR SYSTEM - Cosmic Palette
// ============================================================================

export const colors = {
    // Deep Space Background
    space: {
        deepest: '#000000',
        deep: '#0a0a0f',
        dark: '#151520',
        medium: '#1a1a2e',
        light: '#252538'
    },

    // Nebula Colors
    nebula: {
        purple: '#663399',
        magenta: '#9d4edd',
        pink: '#e0aaff',
        blue: '#5a189a',
        violet: '#7209b7'
    },

    // Holographic Primaries
    holo: {
        cyan: '#00ffff',
        magenta: '#ff00ff',
        yellow: '#ffff00',
        green: '#00ff88',
        blue: '#0088ff'
    },

    // Aurora Effects
    aurora: {
        green: '#00ff9f',
        teal: '#00e5cc',
        blue: '#00ccff',
        purple: '#b794f6',
        pink: '#ff6ec7'
    },

    // Status Colors
    status: {
        success: '#00ff88',
        warning: '#ffb347',
        error: '#ff6b9d',
        info: '#00d4ff',
        neutral: '#a0aec0'
    },

    // Emotion Colors
    emotion: {
        happy: { primary: '#ffd700', secondary: '#ffeb3b' },
        sad: { primary: '#4a9eff', secondary: '#82b1ff' },
        stressed: { primary: '#ff6b6b', secondary: '#ff8787' },
        calm: { primary: '#00e5cc', secondary: '#4fffdf' },
        excited: { primary: '#ff00ff', secondary: '#ff66ff' },
        tired: { primary: '#9b9b9b', secondary: '#b8b8b8' }
    },

    // Gradient Definitions
    gradients: {
        cosmic: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        nebula: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        aurora: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)',
        hologram: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff)',
        space: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000000 70%)',
        deepSpace: 'radial-gradient(ellipse at top, #0a0a0f 0%, #000000 100%)'
    }
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
    fonts: {
        display: '"Orbitron", "Inter", system-ui, sans-serif',
        body: '"Inter", system-ui, sans-serif',
        mono: '"Fira Code", "Courier New", monospace',
        heading: '"Exo 2", "Inter", system-ui, sans-serif'
    },

    sizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem',  // 72px
        '8xl': '6rem'     // 96px
    },

    weights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900
    },

    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2
    }
} as const

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacing = {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
    40: '10rem',   // 160px
    48: '12rem'    // 192px
} as const

// ============================================================================
// SHADOWS & GLOWS
// ============================================================================

export const shadows = {
    // Regular Shadows
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',

    // Glows
    glow: {
        cyan: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4)',
        magenta: '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)',
        yellow: '0 0 20px rgba(255, 255, 0, 0.6), 0 0 40px rgba(255, 255, 0, 0.4)',
        green: '0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.4)',
        purple: '0 0 20px rgba(157, 78, 221, 0.6), 0 0 40px rgba(157, 78, 221, 0.4)'
    },

    // Neon Effects
    neon: {
        strong: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
        medium: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        soft: '0 0 10px currentColor, 0 0 20px currentColor'
    }
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
} as const

// ============================================================================
// ANIMATION CURVES
// ============================================================================

export const easings = {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const

export const durations = {
    fastest: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slowest: '1000ms'
} as const

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    notification: 1600,
    max: 9999
} as const

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
} as const

// ============================================================================
// EFFECTS & FILTERS
// ============================================================================

export const effects = {
    blur: {
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)',
        xl: 'blur(24px)'
    },

    backdropBlur: {
        xs: 'blur(2px)',
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(16px)',
        xl: 'blur(24px)'
    },

    glassmorphism: {
        light: 'blur(10px) saturate(180%)',
        medium: 'blur(15px) saturate(200%)',
        strong: 'blur(20px) saturate(220%)'
    }
} as const

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const variants = {
    button: {
        primary: {
            bg: colors.holo.cyan,
            text: colors.space.deepest,
            glow: shadows.glow.cyan
        },
        secondary: {
            bg: 'transparent',
            border: colors.holo.cyan,
            text: colors.holo.cyan,
            glow: shadows.glow.cyan
        },
        danger: {
            bg: colors.status.error,
            text: colors.space.deepest,
            glow: shadows.glow.magenta
        }
    },

    card: {
        default: {
            bg: 'rgba(26, 26, 46, 0.6)',
            border: 'rgba(0, 255, 255, 0.2)',
            backdrop: effects.backdropBlur.md
        },
        elevated: {
            bg: 'rgba(26, 26, 46, 0.8)',
            border: 'rgba(0, 255, 255, 0.3)',
            backdrop: effects.backdropBlur.lg,
            shadow: shadows.xl
        }
    }
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate gradient text CSS
 */
export function gradientText(gradient: string): string {
    return `
    background: ${gradient};
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `
}

/**
 * Generate glassmorphism CSS
 */
export function glassmorphism(intensity: 'light' | 'medium' | 'strong' = 'medium'): string {
    return `
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: ${effects.glassmorphism[intensity]};
    border: 1px solid rgba(255, 255, 255, 0.1);
  `
}

/**
 * Generate neon glow effect
 */
export function neonGlow(color: string, intensity: 'soft' | 'medium' | 'strong' = 'medium'): string {
    return `
    color: ${color};
    text-shadow: ${shadows.neon[intensity]};
  `
}

// ============================================================================
// EXPORTS
// ============================================================================

export const designTokens = {
    colors,
    typography,
    spacing,
    shadows,
    borderRadius,
    easings,
    durations,
    zIndex,
    breakpoints,
    effects,
    variants
} as const

export type DesignTokens = typeof designTokens
