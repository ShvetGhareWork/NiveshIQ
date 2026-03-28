export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0F1E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      color: "#F9FAFB",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{
        fontSize: "6rem",
        fontWeight: "700",
        color: "#D4AF37",
        margin: "0",
        lineHeight: "1"
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "500",
        margin: "1rem 0 0.5rem",
        color: "#F9FAFB"
      }}>
        Page not found
      </h2>
      <p style={{
        color: "#6B7280",
        fontSize: "1rem",
        marginBottom: "2rem",
        maxWidth: "400px"
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" style={{
        background: "#D4AF37",
        color: "#0A0F1E",
        padding: "12px 28px",
        borderRadius: "999px",
        fontWeight: "600",
        fontSize: "0.95rem",
        textDecoration: "none"
      }}>
        Go back home
      </a>
      <p style={{
        marginTop: "3rem",
        fontSize: "0.75rem",
        color: "#374151"
      }}>
        NiveshIQ — Investment Intelligence
      </p>
    </div>
  )
}