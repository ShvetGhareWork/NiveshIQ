'use client'

import { useRouter } from 'next/navigation'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0A0F1E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "system-ui, sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <div style={{
        position: "relative",
        marginBottom: "2rem"
      }}>
        <h1 style={{
          fontSize: "8rem",
          fontWeight: "900",
          color: "#F43F5E",
          margin: "0",
          lineHeight: "1",
          opacity: "0.2"
        }}>
          500
        </h1>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%"
        }}>
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "900",
            margin: "0",
            letterSpacing: "0.2em",
            color: "white"
          }}>
            ANOMALY DETECTED
          </h2>
        </div>
      </div>

      <p style={{
        color: "#94A3B8",
        fontSize: "14px",
        fontWeight: "600",
        letterSpacing: "0.1em",
        maxWidth: "400px",
        margin: "0 0 2rem 0",
        textTransform: "uppercase"
      }}>
        The Oracle has encountered a critical structural failure. System integrity compromised.
      </p>

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            backgroundColor: "#D4AF37",
            color: "#0A0F1E",
            border: "none",
            borderRadius: "12px",
            fontWeight: "900",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer"
          }}
        >
          RETRY SYNC
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontWeight: "900",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer"
          }}
        >
          RETURN TO DOCK
        </button>
      </div>
    </div>
  )
}