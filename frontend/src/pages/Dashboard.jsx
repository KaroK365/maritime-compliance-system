import { useState, useEffect } from "react";
import { api } from "../api";
import { StatCard, Card, Badge, GaugeRing, Spinner, Button } from "../components/UI";
import { useAuth } from "../App";

function BarChart({ data, color = "#00c8ff", label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%",
              height: `${Math.max((d.value / max) * 64, 4)}px`,
              background: `linear-gradient(180deg, ${color}, ${color}66)`,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.5s ease",
              minHeight: 4,
            }} title={`${d.label}: ${d.value}`} />
            <span style={{ color: "#3d4f6b", fontSize: 9, textAlign: "center", lineHeight: 1 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPie({ completed, pending, overdue, inProgress }) {
  const total = completed + pending + overdue + inProgress || 1;
  const segments = [
    { label: "Completed", value: completed, color: "#10b981" },
    { label: "Pending", value: pending, color: "#f59e0b" },
    { label: "In Progress", value: inProgress, color: "#00c8ff" },
    { label: "Overdue", value: overdue, color: "#ef4444" },
  ].filter(s => s.value > 0);

  let offset = 0;
  const r = 45, circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={110} height={110} viewBox="0 0 100 100">
        {segments.map((s, i) => {
          const pct = s.value / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const el = (
            <circle key={i} cx="50" cy="50" r={r} fill="none"
              stroke={s.color} strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circ}
              transform="rotate(-90 50 50)"
            />
          );
          offset += pct;
          return el;
        })}
        <circle cx="50" cy="50" r="32" fill="#0a0e1a" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#e0eaff" fontSize="13" fontWeight="700">{total}</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#6b7fa3", fontSize: 12 }}>{s.label}</span>
            <span style={{ color: "#e0eaff", fontSize: 12, fontWeight: 600, marginLeft: "auto" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const { role } = useAuth();
  const [compliance, setCompliance] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/compliance"),
      api.get("/maintenance"),
      api.get("/drills"),
    ]).then(([c, m, d]) => {
      setCompliance(c);
      setTasks(m);
      setDrills(d);
    }).catch(() => {
      setError("Failed to load dashboard data. Please check your connection and try again.");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return (
    <div style={{ padding: "48px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
      <div style={{ color: "#ef4444", fontSize: 15, fontWeight: 500 }}>{error}</div>
    </div>
  );

  const taskCounts = {
    completed: tasks.filter(t => t.status === "COMPLETED").length,
    pending: tasks.filter(t => t.status === "PENDING").length,
    overdue: tasks.filter(t => t.status === "OVERDUE").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
  };

  const drillCounts = {
    completed: drills.filter(d => d.status === "COMPLETED").length,
    scheduled: drills.filter(d => d.status === "SCHEDULED").length,
    missed: drills.filter(d => d.status === "MISSED").length,
  };

  const overallColor = compliance?.overallCompliance >= 80 ? "#10b981" : compliance?.overallCompliance >= 60 ? "#f59e0b" : "#ef4444";

  const drillBarData = [
    { label: "Comp", value: drillCounts.completed },
    { label: "Sched", value: drillCounts.scheduled },
    { label: "Missed", value: drillCounts.missed },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "#e0eaff", margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
              Compliance Dashboard
            </h1>
            <p style={{ color: "#6b7fa3", margin: "6px 0 0", fontSize: 14 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{
            background: `${overallColor}18`,
            border: `1px solid ${overallColor}44`,
            borderRadius: 16, padding: "14px 22px",
            textAlign: "center",
          }}>
            <div style={{ color: overallColor, fontSize: 28, fontWeight: 700 }}>{compliance?.overallCompliance?.toFixed(1)}%</div>
            <div style={{ color: "#6b7fa3", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Overall Compliance</div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Tasks" value={tasks.length} icon="⚙" accent="#00c8ff" sub={`${taskCounts.completed} completed`} />
        <StatCard label="Overdue Tasks" value={compliance?.overdueTasks ?? taskCounts.overdue} icon="⚠" accent="#ef4444" sub="Need attention" />
        <StatCard label="Total Drills" value={drills.length} icon="🔔" accent="#a78bfa" sub={`${drillCounts.scheduled} upcoming`} />
        <StatCard label="Missed Drills" value={compliance?.missedDrills ?? drillCounts.missed} icon="✗" accent="#f59e0b" sub="No attendance" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Compliance gauges */}
        <Card>
          <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Compliance Rates</div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <GaugeRing value={Math.round(compliance?.maintenanceCompletionRate ?? 0)} label="Maintenance" color="#00c8ff" />
            <GaugeRing value={Math.round(compliance?.drillParticipationRate ?? 0)} label="Drills" color="#a78bfa" />
          </div>
        </Card>

        {/* Task breakdown */}
        <Card>
          <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Task Breakdown</div>
          <StatusPie {...taskCounts} />
        </Card>

        {/* Drill status bars */}
        <Card>
          <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Drill Status</div>
          <BarChart data={drillBarData} color="#a78bfa" label="Count by status" />
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Completed", color: "#10b981", count: drillCounts.completed },
              { label: "Scheduled", color: "#a78bfa", count: drillCounts.scheduled },
              { label: "Missed", color: "#ef4444", count: drillCounts.missed },
            ].map(s => (
              <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7fa3", fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color, display: "inline-block" }} />
                {s.label} ({s.count})
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent tasks + drills */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 700 }}>Recent Tasks</div>
            <button onClick={() => setPage("maintenance")} style={{
              background: "none", border: "none", color: "#00c8ff", fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.slice(0, 4).map(task => (
              <div key={task.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(0,200,255,0.03)", borderRadius: 10,
                border: "1px solid rgba(0,200,255,0.06)",
              }}>
                <div>
                  <div style={{ color: "#e0eaff", fontSize: 13, fontWeight: 500 }}>{task.title}</div>
                  {task.dueDate && <div style={{ color: "#3d4f6b", fontSize: 11, marginTop: 2 }}>Due {task.dueDate}</div>}
                </div>
                <Badge status={task.status} />
              </div>
            ))}
            {tasks.length === 0 && <div style={{ color: "#3d4f6b", fontSize: 13, textAlign: "center", padding: "16px" }}>No tasks found</div>}
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 700 }}>Recent Drills</div>
            <button onClick={() => setPage("drills")} style={{
              background: "none", border: "none", color: "#00c8ff", fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {drills.slice(0, 4).map(drill => (
              <div key={drill.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(167,139,250,0.03)", borderRadius: 10,
                border: "1px solid rgba(167,139,250,0.06)",
              }}>
                <div>
                  <div style={{ color: "#e0eaff", fontSize: 13, fontWeight: 500 }}>{drill.title}</div>
                  <div style={{ color: "#3d4f6b", fontSize: 11, marginTop: 2 }}>Type: {drill.type}</div>
                </div>
                <Badge status={drill.status} />
              </div>
            ))}
            {drills.length === 0 && <div style={{ color: "#3d4f6b", fontSize: 13, textAlign: "center", padding: "16px" }}>No drills found</div>}
          </div>
        </Card>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}