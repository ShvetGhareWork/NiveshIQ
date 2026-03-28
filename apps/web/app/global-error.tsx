'use client'

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body style={{ 
                backgroundColor: "#0A0F1E", 
                margin: 0, 
                color: "white", 
                fontFamily: "system-ui, sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: "20px"
            }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ 
                        color: "#F43F5E", 
                        fontSize: "6rem", 
                        fontWeight: "900",
                        margin: 0,
                        opacity: "0.2"
                    }}>
                        FATAL
                    </h1>
                </div>
                
                <h2 style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "900", 
                    letterSpacing: "0.3em",
                    margin: "0 0 1rem 0",
                    textTransform: "uppercase"
                }}>
                    CORE SYSTEM FAILURE
                </h2>

                <p style={{ 
                    color: "#94A3B8", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    maxWidth: "400px",
                    margin: "0 0 2rem 0"
                }}>
                    The root intelligence matrix has collapsed. Manual override required.
                </p>

                <button
                    onClick={reset}
                    style={{
                        padding: "16px 32px",
                        backgroundColor: "#D4AF37",
                        color: "#0A0F1E",
                        border: "none",
                        borderRadius: "16px",
                        fontWeight: "900",
                        fontSize: "14px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        boxShadow: "0 0 30px rgba(212,175,55,0.2)"
                    }}
                >
                    REBOOT ORACLE
                </button>
            </body>
        </html>
    )
}