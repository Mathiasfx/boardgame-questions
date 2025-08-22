import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              color: "white",
              fontSize: "18px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div>
              <p>Error al cargar el dado 3D</p>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>
                Tu navegador o dispositivo puede no soportar WebGL
              </p>
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#048FC9",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
