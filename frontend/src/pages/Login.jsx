import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      // Decode JWT to get role/name
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role || payload.roles?.[0]?.replace("ROLE_", "") || "CREW";
      const name = payload.name || payload.sub || email.split("@")[0];
      onLogin(data.token, role, name);
    } catch (e) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background effects */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0,80,255,0.08) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 70%)",
        top: "20%", right: "20%",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(13,21,38,0.9)",
        border: "1px solid rgba(0,200,255,0.12)",
        borderRadius: 24,
        padding: "48px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #0050ff, #00c8ff)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(0,80,255,0.3)",
          }}>⚓</div>
          <h1 style={{ color: "#e0eaff", margin: 0, fontSize: 22, fontWeight: 700 }}>MarineGuard</h1>
          <p style={{ color: "#6b7fa3", margin: "6px 0 0", fontSize: 13 }}>Maritime Compliance System</p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", background: "rgba(0,200,255,0.04)",
                border: "1px solid rgba(0,200,255,0.12)", borderRadius: 12,
                padding: "12px 16px", color: "#e0eaff", fontSize: 14,
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                transition: "border 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
            />
          </div>
          <div>
            <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%", background: "rgba(0,200,255,0.04)",
                border: "1px solid rgba(0,200,255,0.12)", borderRadius: 12,
                padding: "12px 16px", color: "#e0eaff", fontSize: 14,
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                transition: "border 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10, padding: "10px 14px",
              color: "#ef4444", fontSize: 13,
            }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            style={{
              marginTop: 8,
              background: "linear-gradient(90deg, #0050ff, #00c8ff)",
              border: "none", borderRadius: 12,
              padding: "14px", color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              opacity: (loading || !email || !password) ? 0.6 : 1,
              transition: "all 0.2s",
              fontFamily: "inherit",
              letterSpacing: 0.5,
              boxShadow: "0 4px 24px rgba(0,80,255,0.3)",
            }}
          >{loading ? "Signing in…" : "Sign In"}</button>
        </div>

        <p style={{ textAlign: "center", color: "#3d4f6b", fontSize: 12, marginTop: 32, marginBottom: 0 }}>
          Maritime Compliance & Safety Management
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}