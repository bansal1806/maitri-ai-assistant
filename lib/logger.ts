/**
 * Logging utility for the MAITRI AI Assistant
 * Provides structured logging with different levels and conditional output
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: Date
    context?: Record<string, unknown>
    error?: Error
}

class Logger {
    private level: LogLevel
    private enableConsole: boolean
    private logs: LogEntry[] = []
    private maxLogs: number = 100

    constructor(level: LogLevel = 'info', enableConsole: boolean = true) {
        this.level = level
        this.enableConsole = enableConsole
    }

    /**
     * Gets the numeric priority of a log level
     */
    private getLevelPriority(level: LogLevel): number {
        const priorities: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        }
        return priorities[level]
    }

    /**
     * Checks if a message should be logged based on current level
     */
    private shouldLog(level: LogLevel): boolean {
        return this.getLevelPriority(level) >= this.getLevelPriority(this.level)
    }

    /**
     * Internal logging method
     */
    private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
        if (!this.shouldLog(level)) return

        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date(),
            context,
            error
        }

        // Store log entry
        this.logs.push(entry)
        if (this.logs.length > this.maxLogs) {
            this.logs.shift()
        }

        // Console output
        if (this.enableConsole) {
            const timestamp = entry.timestamp.toISOString()
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`

            switch (level) {
                case 'debug':
                    console.debug(prefix, message, context || '')
                    break
                case 'info':
                    console.info(prefix, message, context || '')
                    break
                case 'warn':
                    console.warn(prefix, message, context || '')
                    break
                case 'error':
                    console.error(prefix, message, context || '', error || '')
                    break
            }
        }

        // TODO: Send to external logging service in production
        // this.sendToService(entry)
    }

    /**
     * Log debug message
     */
    debug(message: string, context?: Record<string, unknown>): void {
        this.log('debug', message, context)
    }

    /**
     * Log info message
     */
    info(message: string, context?: Record<string, unknown>): void {
        this.log('info', message, context)
    }

    /**
     * Log warning message
     */
    warn(message: string, context?: Record<string, unknown>): void {
        this.log('warn', message, context)
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error, context?: Record<string, unknown>): void {
        this.log('error', message, context, error)
    }

    /**
     * Get all stored logs
     */
    getLogs(): readonly LogEntry[] {
        return [...this.logs]
    }

    /**
     * Get logs filtered by level
     */
    getLogsByLevel(level: LogLevel): readonly LogEntry[] {
        return this.logs.filter(log => log.level === level)
    }

    /**
     * Clear all stored logs
     */
    clearLogs(): void {
        this.logs = []
    }

    /**
     * Set log level
     */
    setLevel(level: LogLevel): void {
        this.level = level
    }

    /**
     * Enable/disable console output
     */
    setConsoleOutput(enabled: boolean): void {
        this.enableConsole = enabled
    }

    /**
     * Export logs as JSON
     */
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2)
    }
}

// Create singleton instance
const logger = new Logger(
    (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info',
    process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS !== 'false'
)

export default logger

// Export individual methods for convenience
export const { debug, info, warn, error, getLogs, clearLogs } = logger
