/**
 * Environment variable configuration with type safety and validation
 * Provides centralized access to environment variables with fallbacks
 */

/**
 * Gets an environment variable value with type safety
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Environment variable value or default
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined') {
        // Client-side: only NEXT_PUBLIC_ variables are available
        return (window as Window & { ENV?: Record<string, string> }).ENV?.[key] || process.env[key] || defaultValue
    }
    // Server-side
    return process.env[key] || defaultValue
}

/**
 * Gets a boolean environment variable
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = getEnvVar(key, String(defaultValue))
    return value === 'true' || value === '1'
}

/**
 * Gets a number environment variable
 */
function getEnvNumber(key: string, defaultValue: number = 0): number {
    const value = getEnvVar(key, String(defaultValue))
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
    timeout: getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 10000),
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
    enableBluetooth: getEnvBoolean('NEXT_PUBLIC_ENABLE_BLUETOOTH', true),
    enableVoice: getEnvBoolean('NEXT_PUBLIC_ENABLE_VOICE', true),
    enableCamera: getEnvBoolean('NEXT_PUBLIC_ENABLE_CAMERA', true),
    enableAnalytics: getEnvBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    debugMode: getEnvBoolean('NEXT_PUBLIC_DEBUG_MODE', false),
} as const

// ============================================================================
// ANALYTICS
// ============================================================================

export const ANALYTICS_CONFIG = {
    enabled: FEATURE_FLAGS.enableAnalytics,
    measurementId: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
    debug: FEATURE_FLAGS.debugMode,
} as const

// ============================================================================
// LOGGING
// ============================================================================

export const LOG_CONFIG = {
    level: getEnvVar('NEXT_PUBLIC_LOG_LEVEL', 'info'),
    enableConsole: getEnvBoolean('NEXT_PUBLIC_ENABLE_CONSOLE_LOGS', true),
} as const

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates required environment variables
 * Call this during app initialization to ensure all required vars are set
 */
export function validateEnv(): void {
    const errors: string[] = []

    // Add validation for required env vars
    // Example:
    // if (FEATURE_FLAGS.enableAnalytics && !ANALYTICS_CONFIG.measurementId) {
    //   errors.push('NEXT_PUBLIC_GA_MEASUREMENT_ID is required when analytics is enabled')
    // }

    if (errors.length > 0) {
        console.error('Environment variable validation failed:')
        errors.forEach(error => console.error(`  - ${error}`))

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Environment validation failed. Check logs for details.')
        }
    }
}

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Checks if the code is running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Checks if the code is running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Checks if the code is running in test mode
 */
export const isTest = process.env.NODE_ENV === 'test'

/**
 * Logs environment configuration (for debugging)
 * Only logs in development mode
 */
export function logEnvConfig(): void {
    if (isDevelopment) {
        console.group('Environment Configuration')
        console.log('API:', API_CONFIG)
        console.log('Features:', FEATURE_FLAGS)
        console.log('Analytics:', ANALYTICS_CONFIG)
        console.log('Logging:', LOG_CONFIG)
        console.groupEnd()
    }
}
