export default function NotificationBanner({ messages, onClose }) {
  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(245,158,11,0.12), rgba(245,158,11,0.06))",
      border: "1px solid rgba(245,158,11,0.25)",
      borderRadius: 12,
      padding: "12px 20px",
      marginBottom: 24,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {messages.map((m, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 13, fontWeight: 500 }}>{m}</span>
        ))}
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#f59e0b", fontSize: 18, lineHeight: 1, padding: 4,
      }}>✕</button>
    </div>
  );
}