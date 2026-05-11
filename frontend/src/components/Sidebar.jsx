import { useAuth } from "../App";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬡", all: true },
  { id: "maintenance", label: "Maintenance", icon: "⚙", all: true },
  { id: "drills", label: "Drills", icon: "🔔", all: true },
  { id: "crew", label: "Crew", icon: "⚓", admin: true },
];

export default function Sidebar({ page, setPage, role, name }) {
  const { logout } = useAuth();

  return (
    <aside style={{
      width: 240,
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      background: "linear-gradient(180deg, #0d1526 0%, #0a0e1a 100%)",
      borderRight: "1px solid rgba(0,200,255,0.08)",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(0,200,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #00c8ff, #0050ff)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff",
          }}>⚓</div>
          <div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>MarineGuard</div>
            <div style={{ color: "#00c8ff", fontSize: 10, letterSpacing: 2, fontWeight: 500, textTransform: "uppercase" }}>Compliance</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(0,200,255,0.06)" }}>
        <div style={{
          background: "rgba(0,200,255,0.06)",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #00c8ff44, #0050ff44)",
            borderRadius: "50%",
            border: "1px solid rgba(0,200,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#00c8ff",
          }}>{name?.charAt(0)?.toUpperCase() || "U"}</div>
          <div>
            <div style={{ color: "#e0eaff", fontSize: 13, fontWeight: 600 }}>{name || "User"}</div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              color: role === "ADMIN" ? "#f59e0b" : "#00c8ff",
              background: role === "ADMIN" ? "rgba(245,158,11,0.12)" : "rgba(0,200,255,0.12)",
              padding: "1px 6px", borderRadius: 4, display: "inline-block",
            }}>{role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.filter(n => n.all || (n.admin && role === "ADMIN")).map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: active ? "linear-gradient(90deg, rgba(0,200,255,0.15), rgba(0,80,255,0.1))" : "transparent",
              color: active ? "#00c8ff" : "#6b7fa3",
              fontSize: 14, fontWeight: active ? 600 : 400,
              textAlign: "left",
              transition: "all 0.2s",
              borderLeft: active ? "2px solid #00c8ff" : "2px solid transparent",
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(0,200,255,0.04)"; e.currentTarget.style.color = "#a0b4cc"; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7fa3"; }}}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(0,200,255,0.06)" }}>
        <button onClick={logout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "11px 14px", borderRadius: 10, border: "none",
          cursor: "pointer", background: "transparent",
          color: "#6b7fa3", fontSize: 14, fontWeight: 400, textAlign: "left",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.08)"; e.currentTarget.style.color = "#ff5050"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7fa3"; }}
        >
          <span>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  );
}