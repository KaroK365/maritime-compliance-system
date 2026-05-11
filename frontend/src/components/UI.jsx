// Card
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(13,21,38,0.8)",
      border: "1px solid rgba(0,200,255,0.08)",
      borderRadius: 16,
      padding: "24px",
      backdropFilter: "blur(10px)",
      ...style,
    }}>{children}</div>
  );
}

// StatCard
export function StatCard({ label, value, sub, accent = "#00c8ff", icon }) {
  return (
    <div style={{
      background: "rgba(13,21,38,0.8)",
      border: `1px solid ${accent}22`,
      borderRadius: 16,
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
      }} />
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ color: "#e0eaff", fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ color: accent, fontSize: 12, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// Badge
export function Badge({ status }) {
  const map = {
    PENDING:     { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    IN_PROGRESS: { color: "#00c8ff", bg: "rgba(0,200,255,0.1)" },
    COMPLETED:   { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    OVERDUE:     { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    SCHEDULED:   { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    MISSED:      { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const s = map[status] || { color: "#6b7fa3", bg: "rgba(107,127,163,0.1)" };
  return (
    <span style={{
      color: s.color, background: s.bg,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase",
      border: `1px solid ${s.color}33`,
    }}>{status}</span>
  );
}

// Button
export function Button({ children, onClick, variant = "primary", disabled, style = {}, size = "md" }) {
  const variants = {
    primary: { background: "linear-gradient(90deg, #0050ff, #00c8ff)", color: "#fff", border: "none" },
    secondary: { background: "rgba(0,200,255,0.08)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.2)" },
    danger: { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" },
    ghost: { background: "transparent", color: "#6b7fa3", border: "1px solid rgba(0,200,255,0.1)" },
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 }, lg: { padding: "13px 28px", fontSize: 15 } };
  const v = variants[variant];
  const sz = sizes[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...v, ...sz,
      borderRadius: 10,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s",
      letterSpacing: 0.3,
      fontFamily: "inherit",
      ...style,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >{children}</button>
  );
}

// Input
export function Input({ label, value, onChange, type = "text", placeholder, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.12)",
          borderRadius: 10, padding: "10px 14px", color: "#e0eaff",
          fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
      />
    </div>
  );
}

// Select
export function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        background: "#0d1526", border: "1px solid rgba(0,200,255,0.12)",
        borderRadius: 10, padding: "10px 14px", color: "#e0eaff",
        fontSize: 14, outline: "none", fontFamily: "inherit", cursor: "pointer",
      }}
      onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
      onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: "#0d1526" }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// Modal
export function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#0d1526", border: "1px solid rgba(0,200,255,0.15)",
        borderRadius: 20, padding: "32px", width: "100%", maxWidth: width,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.2s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ color: "#e0eaff", margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#6b7fa3",
            fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Gauge / Ring chart
export function GaugeRing({ value, label, color = "#00c8ff", size = 120 }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,200,255,0.08)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
          fill="#e0eaff" fontSize="16" fontWeight="700">{value}%</text>
      </svg>
      <div style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// PageHeader
export function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
      <div>
        <h1 style={{ color: "#e0eaff", margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{title}</h1>
        {sub && <p style={{ color: "#6b7fa3", margin: "6px 0 0", fontSize: 14 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// EmptyState
export function EmptyState({ icon, message }) {
  return (
    <div style={{ padding: "48px", textAlign: "center", color: "#6b7fa3" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}

// LoadingSpinner
export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "3px solid rgba(0,200,255,0.1)",
        borderTop: "3px solid #00c8ff",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
    </div>
  );
}