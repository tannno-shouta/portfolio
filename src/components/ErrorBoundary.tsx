"use client";

import { Component, type ReactNode } from "react";

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ color: "red", padding: 24, fontFamily: "monospace", background: "#000" }}>
          <h2>Runtime Error (ErrorBoundary)</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#aaa" }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
