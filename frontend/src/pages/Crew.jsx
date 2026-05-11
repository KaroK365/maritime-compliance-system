import { useState, useEffect } from "react";
import { api } from "../api";
import {
  Card,
  StatCard,
  Badge,
  PageHeader,
  Spinner,
  Modal,
  Input,
  Select,
  Button,
} from "../components/UI";
import { useAuth } from "../App";

export default function Crew() {
  const { role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CREW",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/maintenance"), api.get("/drills")])
      .then(([m, d]) => {
        setTasks(m);
        setDrills(d);
      })
      .catch(() =>
        setError(
          "Failed to load crew data. Please check your connection and try again.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");
    if (!regForm.name || !regForm.email || !regForm.password) {
      setRegError("All fields are required");
      return;
    }
    setRegLoading(true);
    try {
      await api.post("/auth/register", regForm);
      setRegSuccess("User registered successfully!");
      setRegForm({ name: "", email: "", password: "", role: "CREW" });
      setTimeout(() => {
        setShowRegister(false);
        setRegSuccess("");
      }, 1500);
    } catch (e) {
      setRegError(e.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const crewStats = {
    totalTasks: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    overdue: tasks.filter((t) => t.status === "OVERDUE").length,
  };

  const drillStats = {
    total: drills.length,
    upcoming: drills.filter((d) => d.status === "SCHEDULED").length,
    completed: drills.filter((d) => d.status === "COMPLETED").length,
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
        <div style={{ color: "#ef4444", fontSize: 15, fontWeight: 500 }}>
          {error}
        </div>
      </div>
    );

  if (role !== "ADMIN") {
    return (
      <div>
        <PageHeader
          title="My Dashboard"
          sub="Your personal task and drill overview"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="My Tasks"
            value={crewStats.totalTasks}
            icon="⚙"
            accent="#00c8ff"
          />
          <StatCard
            label="Completed"
            value={crewStats.completed}
            icon="✓"
            accent="#10b981"
          />
          <StatCard
            label="Overdue"
            value={crewStats.overdue}
            icon="⚠"
            accent="#ef4444"
          />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Card>
            <div
              style={{
                color: "#e0eaff",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              My Tasks
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "rgba(0,200,255,0.03)",
                      borderRadius: 10,
                      border: "1px solid rgba(0,200,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        color: "#e0eaff",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {t.title}
                    </span>
                    <Badge status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <div
              style={{
                color: "#e0eaff",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Upcoming Drills
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {drills.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "rgba(167,139,250,0.03)",
                      borderRadius: 10,
                      border: "1px solid rgba(167,139,250,0.06)",
                    }}
                  >
                    <span
                      style={{
                        color: "#e0eaff",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {d.title}
                    </span>
                    <Badge status={d.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Crew Management"
        sub="Overview of crew tasks, drills and performance"
        action={
          <Button onClick={() => setShowRegister(true)}>+ Add Crew</Button>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total Tasks"
          value={crewStats.totalTasks}
          icon="⚙"
          accent="#00c8ff"
        />
        <StatCard
          label="Completed"
          value={crewStats.completed}
          icon="✓"
          accent="#10b981"
          sub="Tasks done"
        />
        <StatCard
          label="Overdue"
          value={crewStats.overdue}
          icon="⚠"
          accent="#ef4444"
          sub="Needs action"
        />
        <StatCard
          label="Drills"
          value={drillStats.total}
          icon="🔔"
          accent="#a78bfa"
          sub={`${drillStats.upcoming} upcoming`}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Task status breakdown */}
        <Card>
          <div
            style={{
              color: "#e0eaff",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Task Status Overview
          </div>
          {[
            {
              label: "Completed",
              count: crewStats.completed,
              color: "#10b981",
              pct: crewStats.totalTasks
                ? (crewStats.completed / crewStats.totalTasks) * 100
                : 0,
            },
            {
              label: "Pending",
              count: crewStats.pending,
              color: "#f59e0b",
              pct: crewStats.totalTasks
                ? (crewStats.pending / crewStats.totalTasks) * 100
                : 0,
            },
            {
              label: "Overdue",
              count: crewStats.overdue,
              color: "#ef4444",
              pct: crewStats.totalTasks
                ? (crewStats.overdue / crewStats.totalTasks) * 100
                : 0,
            },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#6b7fa3", fontSize: 13 }}>
                  {s.label}
                </span>
                <span
                  style={{ color: "#e0eaff", fontSize: 13, fontWeight: 600 }}
                >
                  {s.count}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${s.pct}%`,
                    background: s.color,
                    borderRadius: 10,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </Card>

        {/* Drill compliance */}
        <Card>
          <div
            style={{
              color: "#e0eaff",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Drill Compliance
          </div>
          {[
            {
              label: "Completed",
              count: drillStats.completed,
              color: "#10b981",
              pct: drillStats.total
                ? (drillStats.completed / drillStats.total) * 100
                : 0,
            },
            {
              label: "Upcoming",
              count: drillStats.upcoming,
              color: "#a78bfa",
              pct: drillStats.total
                ? (drillStats.upcoming / drillStats.total) * 100
                : 0,
            },
            {
              label: "Missed",
              count: drills.filter((d) => d.status === "MISSED").length,
              color: "#ef4444",
              pct: drillStats.total
                ? (drills.filter((d) => d.status === "MISSED").length /
                    drillStats.total) *
                  100
                : 0,
            },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#6b7fa3", fontSize: 13 }}>
                  {s.label}
                </span>
                <span
                  style={{ color: "#e0eaff", fontSize: 13, fontWeight: 600 }}
                >
                  {s.count}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${s.pct}%`,
                    background: s.color,
                    borderRadius: 10,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Register Modal */}
      <Modal
        open={showRegister}
        onClose={() => {
          setShowRegister(false);
          setRegError("");
          setRegSuccess("");
        }}
        title="Register New Crew Member"
        width={440}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Full Name"
            value={regForm.name}
            onChange={(e) =>
              setRegForm((f) => ({ ...f, name: e.target.value }))
            }
            placeholder="John Smith"
          />
          <Input
            label="Email"
            type="email"
            value={regForm.email}
            onChange={(e) =>
              setRegForm((f) => ({ ...f, email: e.target.value }))
            }
            placeholder="john@ship.com"
          />
          <Input
            label="Password"
            type="password"
            value={regForm.password}
            onChange={(e) =>
              setRegForm((f) => ({ ...f, password: e.target.value }))
            }
            placeholder="••••••••"
          />
          <Select
            label="Role"
            value={regForm.role}
            onChange={(e) =>
              setRegForm((f) => ({ ...f, role: e.target.value }))
            }
            options={[
              { value: "CREW", label: "Crew" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
          {regError && (
            <div
              style={{
                color: "#ef4444",
                fontSize: 13,
                padding: "8px 12px",
                background: "rgba(239,68,68,0.08)",
                borderRadius: 8,
              }}
            >
              {regError}
            </div>
          )}
          {regSuccess && (
            <div
              style={{
                color: "#10b981",
                fontSize: 13,
                padding: "8px 12px",
                background: "rgba(16,185,129,0.08)",
                borderRadius: 8,
              }}
            >
              {regSuccess}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button variant="ghost" onClick={() => setShowRegister(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister} disabled={regLoading}>
              {regLoading ? "Registering…" : "Register"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
