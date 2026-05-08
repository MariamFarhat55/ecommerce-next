"use client"
import { Component } from "react"

// Catches JavaScript errors anywhere in the component tree
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}