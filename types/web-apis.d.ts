/**
 * Type definitions for Web APIs not fully covered by TypeScript
 * Removes need for 'any' types and eslint-disable comments
 */

// ============================================================================
// WEB SPEECH API
// ============================================================================

export interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
}

export interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
}

export interface SpeechRecognitionResult {
    readonly length: number
    readonly isFinal: boolean
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
}

export interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
}

export interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string
    readonly message: string
}

export interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number

    start(): void
    stop(): void
    abort(): void

    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
    onend: ((this: SpeechRecognition, ev: Event) => void) | null
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null
}

export interface SpeechRecognitionConstructor {
    new(): SpeechRecognition
    prototype: SpeechRecognition
}

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor
        webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
}

// ============================================================================
// MEDIA DEVICES EXTENSIONS
// ============================================================================

export interface ExtendedMediaStreamConstraints extends MediaStreamConstraints {
    video?: boolean | {
        width?: number | { min?: number; max?: number; ideal?: number }
        height?: number | { min?: number; max?: number; ideal?: number }
        facingMode?: 'user' | 'environment' | { exact: string } | { ideal: string }
        frameRate?: number | { min?: number; max?: number; ideal?: number }
    }
    audio?: boolean | MediaTrackConstraints
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Makes all properties of T required and non-nullable
 */
export type RequiredNonNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>
}

/**
 * Makes specified properties of T optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extracts the value type from a readonly object
 */
export type ValueOf<T> = T[keyof T]

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
