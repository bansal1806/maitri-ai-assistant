/**
 * Analytics tracking utility for MAITRI AI Assistant
 * Provides type-safe event tracking with privacy-friendly defaults
 */

import { FEATURE_FLAGS } from './env'
import logger from './logger'

// ============================================================================
// TYPES
// ============================================================================

export interface AnalyticsEvent {
    category: string
    action: string
    label?: string
    value?: number
    context?: Record<string, unknown>
}

export type EventCategory =
    | 'Health Monitoring'
    | 'Emotion Detection'
    | 'Voice Interaction'
    | 'Bluetooth Connection'
    | 'User Interaction'
    | 'System'

export type EventAction =
    | 'vital_alert_triggered'
    | 'emotion_detected'
    | 'voice_command_processed'
    | 'device_connected'
    | 'device_disconnected'
    | 'page_view'
    | 'button_click'
    | 'error_occurred'

// ============================================================================
// EVENT TRACKING
// ============================================================================

class Analytics {
    private enabled: boolean
    private debug: boolean
    private queue: AnalyticsEvent[] = []

    constructor(enabled: boolean = false, debug: boolean = false) {
        this.enabled = enabled
        this.debug = debug
    }

    /**
     * Track a custom event
     */
    trackEvent(event: AnalyticsEvent): void {
        if (!this.enabled && !this.debug) return

        const enrichedEvent = {
            ...event,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        }

        if (this.debug) {
            logger.debug('Analytics Event', enrichedEvent)
        }

        this.queue.push(enrichedEvent)

        // TODO: Send to analytics service (e.g., Google Analytics, Mixpanel)
        // this.sendToService(enrichedEvent)
    }

    /**
     * Track a page view
     */
    trackPageView(path: string, title?: string): void {
        this.trackEvent({
            category: 'System',
            action: 'page_view',
            label: path,
            context: { title }
        })
    }

    /**
     * Track vital sign alert
     */
    trackVitalAlert(vitalType: string, value: number, severity: string): void {
        this.trackEvent({
            category: 'Health Monitoring',
            action: 'vital_alert_triggered',
            label: vitalType,
            value,
            context: { severity }
        })
    }

    /**
     * Track emotion detection
     */
    trackEmotion(emotion: string, confidence: number): void {
        this.trackEvent({
            category: 'Emotion Detection',
            action: 'emotion_detected',
            label: emotion,
            value: Math.round(confidence * 100),
            context: { confidence }
        })
    }

    /**
     * Track voice interaction
     */
    trackVoiceCommand(transcript: string, success: boolean): void {
        this.trackEvent({
            category: 'Voice Interaction',
            action: 'voice_command_processed',
            label: success ? 'success' : 'failed',
            context: {
                transcriptLength: transcript.length,
                success
            }
        })
    }

    /**
     * Track device connection
     */
    trackDeviceConnection(deviceType: string, connected: boolean): void {
        this.trackEvent({
            category: 'Bluetooth Connection',
            action: connected ? 'device_connected' : 'device_disconnected',
            label: deviceType
        })
    }

    /**
     * Track button click
     */
    trackButtonClick(buttonName: string, location: string): void {
        this.trackEvent({
            category: 'User Interaction',
            action: 'button_click',
            label: buttonName,
            context: { location }
        })
    }

    /**
     * Track error
     */
    trackError(error: Error, context?: Record<string, unknown>): void {
        this.trackEvent({
            category: 'System',
            action: 'error_occurred',
            label: error.message,
            context: {
                ...context,
                stack: error.stack
            }
        })
    }

    /**
     * Get queued events
     */
    getQueue(): readonly AnalyticsEvent[] {
        return [...this.queue]
    }

    /**
     * Clear event queue
     */
    clearQueue(): void {
        this.queue = []
    }

    /**
     * Enable/disable analytics
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled
    }

    /**
     * Export analytics data
     */
    exportData(): string {
        return JSON.stringify(this.queue, null, 2)
    }
}

// Create singleton instance
const analytics = new Analytics(
    FEATURE_FLAGS.enableAnalytics,
    FEATURE_FLAGS.debugMode
)

export default analytics

// Export convenience methods
export const {
    trackEvent,
    trackPageView,
    trackVitalAlert,
    trackEmotion,
    trackVoiceCommand,
    trackDeviceConnection,
    trackButtonClick,
    trackError
} = analytics
