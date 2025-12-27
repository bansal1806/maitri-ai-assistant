/**
 * Application-wide constants for the MAITRI AI Assistant
 * Centralizes all magic numbers and constant values for better maintainability
 */

// ============================================================================
// HEALTH VITAL CONSTANTS
// ============================================================================

export const HEALTH_THRESHOLDS = {
  heartRate: {
    critical: { min: 0, max: 59 },
    warning: { min: 60, max: 65 },
    normal: { min: 66, max: 90 },
    elevated: { min: 91, max: 100 },
    high: { min: 101, max: 200 }
  },
  temperature: {
    hypothermia: { min: 0, max: 96.9 },
    lowNormal: { min: 97.0, max: 97.7 },
    normal: { min: 97.8, max: 99.1 },
    elevated: { min: 99.2, max: 100.3 },
    fever: { min: 100.4, max: 120 }
  },
  oxygenSaturation: {
    critical: { min: 0, max: 89 },
    low: { min: 90, max: 94 },
    warning: { min: 95, max: 96 },
    normal: { min: 97, max: 100 }
  },
  bloodPressure: {
    systolic: {
      low: { min: 0, max: 89 },
      normal: { min: 90, max: 119 },
      elevated: { min: 120, max: 129 },
      high1: { min: 130, max: 139 },
      high2: { min: 140, max: 300 }
    },
    diastolic: {
      low: { min: 0, max: 59 },
      normal: { min: 60, max: 79 },
      elevated: { min: 80, max: 84 },
      high1: { min: 85, max: 89 },
      high2: { min: 90, max: 200 }
    }
  },
  stressLevel: {
    low: { min: 0, max: 3 },
    normal: { min: 4, max: 4 },
    moderate: { min: 5, max: 6 },
    high: { min: 7, max: 8 },
    critical: { min: 9, max: 10 }
  }
} as const

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 500,
  slow: 1000,
  verySlow: 2000,
  hologram: 3000
} as const

export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 500,
  long: 1000
} as const

// ============================================================================
// UPDATE INTERVALS
// ============================================================================

export const UPDATE_INTERVALS = {
  vitalSigns: 1000 / 60, // 60 FPS - 16.67ms
  emotionDetection: 3000, // 3 seconds
  heartRateMonitor: 1000, // 1 second
  missionDayCounter: 1000 // 1 second
} as const

// ============================================================================
// DATA LIMITS
// ============================================================================

export const DATA_LIMITS = {
  vitalHistory: 50, // Keep last 50 readings
  trendChartPoints: 20, // Show last 20 points in charts
  messageHistory: 100, // Keep last 100 messages
  alertHistory: 20 // Keep last 20 alerts
} as const

// ============================================================================
// DEVICE CONFIGURATION
// ============================================================================

export const BLUETOOTH_CONFIG = {
  services: {
    heartRate: 0x180D,
    battery: 0x180F
  },
  characteristics: {
    heartRateMeasurement: 0x2A37,
    batteryLevel: 0x2A19
  },
  reconnectDelay: 5000,
  timeout: 10000
} as const

export const CAMERA_CONFIG = {
  video: {
    width: 640,
    height: 480,
    facingMode: 'user'
  }
} as const

export const SPEECH_CONFIG = {
  recognition: {
    lang: 'en-US',
    continuous: true,
    interimResults: true,
    maxAlternatives: 1
  },
  synthesis: {
    rate: 0.8,
    pitch: 1.2,
    volume: 0.8,
    lang: 'en-US'
  }
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONSTANTS = {
  navigation: {
    height: 80,
    zIndex: 50
  },
  starCount: 50, // Number of animated stars on home page
  particleCount: 15, // Particles around holographic avatar
  gridSize: 20 // Grid helper size for 3D scenes
} as const

// ============================================================================
// COLOR CONSTANTS
// ============================================================================

export const COLORS = {
  primary: '#00ffff', // Cyan
  secondary: '#ff00ff', // Magenta
  accent: '#ffff00', // Yellow
  muted: '#1a1a2e', // Dark blue
  
  status: {
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#00ffff'
  },
  
  emotion: {
    happy: [0, 1, 0.5], // Green-cyan
    sad: [0, 0.5, 1], // Blue
    angry: [1, 0.2, 0], // Red
    surprised: [1, 1, 0], // Yellow
    fearful: [0.8, 0, 1], // Purple
    neutral: [0, 1, 1] // Cyan
  },
  
  health: {
    excellent: '#00ff00',
    good: '#90ee90',
    caution: '#ffff00',
    warning: '#ff6600',
    critical: '#ff0000'
  }
} as const

// ============================================================================
// TEXT CONSTANTS
// ============================================================================

export const MESSAGES = {
  errors: {
    camera: {
      denied: 'Camera access denied',
      notSupported: 'Camera not supported in this browser',
      notFound: 'No camera device found'
    },
    microphone: {
      denied: 'Microphone access denied',
      notSupported: 'Speech recognition not supported in this browser'
    },
    bluetooth: {
      denied: 'Bluetooth access denied',
      notSupported: 'Web Bluetooth not supported in this browser',
      connectionFailed: 'Failed to connect to device',
      disconnected: 'Device disconnected'
    },
    general: {
      somethingWrong: 'Something went wrong',
      tryAgain: 'Please try again',
      contactSupport: 'Please contact support if the problem persists'
    }
  },
  success: {
    connected: 'Successfully connected',
    saved: 'Data saved successfully',
    updated: 'Updated successfully'
  },
  info: {
    loading: 'Loading...',
    initializing: 'Initializing...',
    processing: 'Processing...',
    simulationMode: 'Using simulation mode'
  }
} as const

// ============================================================================
// HEALTH SCENARIO CONFIGURATIONS
// ============================================================================

export const HEALTH_SCENARIOS = {
  resting: {
    id: 'resting',
    name: 'Resting State',
    description: 'Normal resting state with calm vitals',
    heartRate: { base: 70, variation: 5 },
    bloodPressure: { systolic: 120, diastolic: 80, variation: 2 },
    temperature: { base: 98.6, variation: 0.2 },
    oxygenSaturation: { base: 98, variation: 1 },
    stressLevel: { base: 2.5, variation: 0.5 }
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise Recovery',
    description: 'Post-exercise recovery period',
    heartRate: { base: 90, variation: 5 },
    bloodPressure: { systolic: 130, diastolic: 82, variation: 3 },
    temperature: { base: 99.2, variation: 0.3 },
    oxygenSaturation: { base: 97, variation: 1 },
    stressLevel: { base: 4.5, variation: 0.5 }
  },
  stress: {
    id: 'stress',
    name: 'Stress Response',
    description: 'Elevated stress with increased vitals',
    heartRate: { base: 102, variation: 8 },
    bloodPressure: { systolic: 145, diastolic: 90, variation: 5 },
    temperature: { base: 99.0, variation: 0.2 },
    oxygenSaturation: { base: 96, variation: 1 },
    stressLevel: { base: 8, variation: 1 }
  },
  emergency: {
    id: 'emergency',
    name: 'Medical Emergency',
    description: 'Critical medical event requiring immediate attention',
    heartRate: { base: 127, variation: 13 },
    bloodPressure: { systolic: 100, diastolic: 62, variation: 8 },
    temperature: { base: 101.2, variation: 0.8 },
    oxygenSaturation: { base: 90, variation: 3 },
    stressLevel: { base: 9.5, variation: 0.5 }
  }
} as const

// ============================================================================
// API ENDPOINTS (placeholder - to be configured via environment)
// ============================================================================

export const API_ENDPOINTS = {
  health: '/api/health',
  emotion: '/api/emotion',
  analytics: '/api/analytics'
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  enableBluetooth: true,
  enableVoice: true,
  enableCamera: true,
  enableAnalytics: false,
  debugMode: false
} as const

// ============================================================================
// 3D SCENE CONSTANTS
// ============================================================================

export const SCENE_3D = {
  camera: {
    position: [0, 0, 8],
    fov: 60
  },
  lights: {
    ambient: 0.3,
    point1: { intensity: 0.8, color: '#00ffff' },
    point2: { intensity: 0.4, color: '#ff00ff' }
  },
  controls: {
    autoRotateSpeed: 1,
    minDistance: 5,
    maxDistance: 15
  }
} as const

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type HealthScenarioId = keyof typeof HEALTH_SCENARIOS
export type EmotionType = keyof typeof COLORS.emotion
export type HealthStatus = 'normal' | 'warning' | 'critical'
