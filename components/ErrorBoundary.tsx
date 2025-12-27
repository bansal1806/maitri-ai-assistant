'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })

    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
          <div className="max-w-2xl w-full">
            <div className="medical-interface rounded-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-red-900/30 border-2 border-red-500">
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4 text-red-400">
                System Error Detected
              </h1>

              <p className="text-gray-300 mb-6">
                MAITRI encountered an unexpected error. The system has been stabilized,
                but some features may not be functioning correctly.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 mb-2">
                    Technical Details (Development Mode)
                  </summary>
                  <div className="bg-black/50 p-4 rounded border border-gray-700 overflow-auto">
                    <p className="text-red-300 font-mono text-sm mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-gray-400 text-xs overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                If this problem persists, please contact mission control.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
