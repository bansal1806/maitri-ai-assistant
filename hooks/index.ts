/**
 * Custom React Hooks for the MAITRI AI Assistant
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook that debounces a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * Hook that throttles a function
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const lastRun = useRef(Date.now())

    return useCallback(
        (...args: Parameters<T>) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args)
                lastRun.current = Date.now()
            }
        },
        [callback, delay]
    )
}

/**
 * Hook for managing interval-based updates
 * @param callback - Function to call on interval
 * @param delay - Delay in milliseconds (null to pause)
 */
export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef(callback)

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay === null) return

        const id = setInterval(() => savedCallback.current(), delay)
        return () => clearInterval(id)
    }, [delay])
}

/**
 * Hook for managing local storage with type safety
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T) => void, () => void] {
    // Get initial value from localStorage or use default
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Wrapped setValue function
    const setValue = useCallback(
        (value: T) => {
            try {
                setStoredValue(value)
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(value))
                }
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key]
    )

    // Remove value from storage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    return [storedValue, setValue, removeValue]
}

/**
 * Hook to track previous value
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>()

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref.current
}

/**
 * Hook to track if component is mounted
 * @returns Boolean indicating if mounted
 */
export function useIsMounted(): boolean {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    return isMounted
}

/**
 * Hook for managing media queries
 * @param query - Media query string
 * @returns Boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const media = window.matchMedia(query)

        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)

        // Use addEventListener for modern browsers
        if (media.addEventListener) {
            media.addEventListener('change', listener)
            return () => media.removeEventListener('change', listener)
        } else {
            // Fallback for older browsers
            media.addListener(listener)
            return () => media.removeListener(listener)
        }
    }, [matches, query])

    return matches
}

/**
 * Hook for detecting click outside of element
 * @param ref - React ref to element
 * @param handler - Function to call on outside click
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current
            if (!el || el.contains(event.target as Node)) {
                return
            }
            handler(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler])
}

/**
 * Hook for managing async operations with loading and error states
 * @param asyncFunction - Async function to execute
 * @returns { execute, loading, error, data }
 */
export function useAsync<T, E = Error>(
    asyncFunction: () => Promise<T>
): {
    execute: () => Promise<void>
    loading: boolean
    error: E | null
    data: T | null
} {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<E | null>(null)
    const [data, setData] = useState<T | null>(null)

    const execute = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await asyncFunction()
            setData(result)
        } catch (err) {
            setError(err as E)
        } finally {
            setLoading(false)
        }
    }, [asyncFunction])

    return { execute, loading, error, data }
}

/**
 * Hook for managing array state with helper functions
 * @param initialValue - Initial array value
 * @returns Array state and helper functions
 */
export function useArray<T>(initialValue: T[] = []) {
    const [array, setArray] = useState(initialValue)

    const push = useCallback((element: T) => {
        setArray(arr => [...arr, element])
    }, [])

    const remove = useCallback((index: number) => {
        setArray(arr => arr.filter((_, i) => i !== index))
    }, [])

    const filter = useCallback((callback: (item: T, index: number) => boolean) => {
        setArray(arr => arr.filter(callback))
    }, [])

    const update = useCallback((index: number, newElement: T) => {
        setArray(arr => arr.map((item, i) => (i === index ? newElement : item)))
    }, [])

    const clear = useCallback(() => {
        setArray([])
    }, [])

    return { array, set: setArray, push, remove, filter, update, clear }
}
