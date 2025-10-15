// lib/speechTypes.ts - Simple type helpers for speech recognition

export interface SpeechRecognitionResult {
    isFinal: boolean
    [index: number]: {
      transcript: string
      confidence: number
    }
  }
  
  export interface SpeechRecognitionResultList {
    length: number
    [index: number]: SpeechRecognitionResult
  }
  
  export interface SpeechRecognitionEventResult {
    results: SpeechRecognitionResultList
    resultIndex: number
  }
  
  export const isSpeechRecognitionSupported = (): boolean => {
    return typeof window !== 'undefined' && 
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }
  
  export const createSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      return null
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    return new SpeechRecognition()
  }
  