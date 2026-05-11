import { useState, useEffect } from "react";
import { api } from "../api";
import { Card, Badge, Button, Modal, Input, Select, PageHeader, EmptyState, Spinner, StatCard } from "../components/UI";
import { useAuth } from "../App";

const DRILL_TYPES = [
  { value: "FIRE", label: "Fire Safety" },
  { value: "EVACUATION", label: "Abandon Ship" },
  { value: "MOB", label: "Man Overboard" },
  { value: "MEDICAL", label: "Medical Emergency" },
  { value: "FLOODING", label: "Flooding Response" },
];

const STATUS_OPTS = [
  { value: "", label: "All Statuses" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "MISSED", label: "Missed" },
];

const TYPE_ICONS = { FIRE: "🔥", EVACUATION: "🚢", MOB: "👤", MEDICAL: "🏥", FLOODING: "💧" };

export default function Drills() {
  const { role } = useAuth();
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(null);

  const [form, setForm] = useState({ title: "", type: "FIRE", scheduledDate: "", shipId: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [attending, setAttending] = useState(true);
  const [attendLoading, setAttendLoading] = useState(false);

  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api.get("/drills")
      .then(setDrills)
      .catch(() => setError("Failed to load drills. Please check your connection and try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = drills.filter(d => {
    if (filterStatus && d.status !== filterStatus) return false;
    if (filterType && d.type !== filterType) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    setFormError("");
    if (!form.title || !form.scheduledDate || !form.shipId) {
      setFormError("Title, date, and ship ID are required");
      return;
    }
    setFormLoading(true);
    try {
      await api.post("/drills", { ...form, shipId: parseInt(form.shipId) });
      setShowCreate(false);
      setForm({ title: "", type: "FIRE", scheduledDate: "", shipId: "" });
      load();
    } catch (e) {
      setFormError(e.message || "Failed to schedule drill");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAttendance = async () => {
    if (!attendanceModal) return;
    setAttendLoading(true);
    try {
      await api.post(`/drills/${attendanceModal.id}/attendance`, { attended: attending });
      setAttendanceModal(null);
      load();
    } catch (e) {
      // ignore
    } finally {
      setAttendLoading(false);
    }
  };

  const stats = {
    total: drills.length,
    scheduled: drills.filter(d => d.status === "SCHEDULED").length,
    completed: drills.filter(d => d.status === "COMPLETED").length,
    missed: drills.filter(d => d.status === "MISSED").length,
  };

  return (
    <div>
      <PageHeader
        title="Safety Drills"
        sub="Schedule and track mandatory safety drills"
        action={role === "ADMIN" && <Button onClick={() => setShowCreate(true)}>+ Schedule Drill</Button>}
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Drills" value={stats.total} icon="🔔" accent="#a78bfa" />
        <StatCard label="Scheduled" value={stats.scheduled} icon="📅" accent="#00c8ff" sub="Upcoming" />
        <StatCard label="Completed" value={stats.completed} icon="✓" accent="#10b981" />
        <StatCard label="Missed" value={stats.missed} icon="✗" accent="#ef4444" />
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Input label="Search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drills..." style={{ flex: 2, minWidth: 160 }} />
          <Select label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            options={STATUS_OPTS} style={{ flex: 1, minWidth: 140 }} />
          <Select label="Type" value={filterType} onChange={e => setFilterType(e.target.value)}
            options={[{ value: "", label: "All Types" }, ...DRILL_TYPES]} style={{ flex: 1, minWidth: 140 }} />
          <Button variant="ghost" onClick={() => { setFilterStatus(""); setFilterType(""); setSearch(""); }}>Clear</Button>
        </div>
      </Card>

      {/* Drill Cards Grid */}
      {loading ? <Spinner /> : error ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
          <div style={{ color: "#ef4444", fontSize: 15, fontWeight: 500 }}>{error}</div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔔" message="No drills found" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(drill => (
            <div key={drill.id} style={{
              background: "rgba(13,21,38,0.8)",
              border: "1px solid rgba(167,139,250,0.1)",
              borderRadius: 16,
              padding: "20px",
              transition: "border-color 0.2s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.1)"}
            >
              <div style={{
                position: "absolute", top: 0, right: 0, width: 80, height: 80,
                background: "radial-gradient(circle at top right, rgba(167,139,250,0.08), transparent 70%)",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>{TYPE_ICONS[drill.type] || "🔔"}</div>
                <Badge status={drill.status} />
              </div>
              <div style={{ color: "#e0eaff", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{drill.title}</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <span style={{ color: "#6b7fa3", fontSize: 12 }}>
                  📋 {DRILL_TYPES.find(t => t.value === drill.type)?.label || drill.type}
                </span>
                {drill.scheduledDate && (
                  <span style={{ color: "#6b7fa3", fontSize: 12 }}>📅 {drill.scheduledDate}</span>
                )}
              </div>
              {role === "CREW" && drill.status === "SCHEDULED" && (
                <Button size="sm" variant="secondary" style={{ width: "100%" }}
                  onClick={() => setAttendanceModal(drill)}>
                  Mark Attendance
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Drill Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Schedule Safety Drill">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Fire Safety Drill" />
          <Select label="Drill Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={DRILL_TYPES} />
          <Input label="Scheduled Date" type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} />
          <Input label="Ship ID" type="number" value={form.shipId} onChange={e => setForm(f => ({ ...f, shipId: e.target.value }))} placeholder="1" />
          {formError && <div style={{ color: "#ef4444", fontSize: 13, padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>{formError}</div>}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={formLoading}>{formLoading ? "Scheduling…" : "Schedule Drill"}</Button>
          </div>
        </div>
      </Modal>

      {/* Attendance Modal */}
      <Modal open={!!attendanceModal} onClose={() => setAttendanceModal(null)} title={`Mark Attendance: ${attendanceModal?.title}`} width={400}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ color: "#6b7fa3", fontSize: 14, margin: 0 }}>
            Confirm your attendance for this drill.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ val: true, label: "✓ Attended", color: "#10b981" }, { val: false, label: "✗ Did Not Attend", color: "#ef4444" }].map(o => (
              <button key={String(o.val)} onClick={() => setAttending(o.val)} style={{
                flex: 1, padding: "14px",
                borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                border: attending === o.val ? `2px solid ${o.color}` : "2px solid rgba(0,200,255,0.1)",
                background: attending === o.val ? `${o.color}18` : "transparent",
                color: attending === o.val ? o.color : "#6b7fa3",
                transition: "all 0.2s",
              }}>{o.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setAttendanceModal(null)}>Cancel</Button>
            <Button onClick={handleAttendance} disabled={attendLoading}>{attendLoading ? "Submitting…" : "Submit"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}