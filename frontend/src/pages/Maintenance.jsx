import { useState, useEffect } from "react";
import { api } from "../api";
import { Card, Badge, Button, Modal, Input, Select, PageHeader, EmptyState, Spinner } from "../components/UI";
import { useAuth } from "../App";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "OVERDUE", label: "Overdue" },
];

const UPDATE_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function Maintenance() {
  const { role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(null);

  // Create form
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", assignedCrewId: "", shipId: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Update form
  const [updateForm, setUpdateForm] = useState({ status: "IN_PROGRESS", notes: "" });

  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api.get("/maintenance")
      .then(setTasks)
      .catch(() => setError("Failed to load maintenance tasks. Please check your connection and try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterDate && t.dueDate < filterDate) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    setFormError("");
    if (!form.title || !form.dueDate || !form.shipId || !form.assignedCrewId) {
      setFormError("All fields are required");
      return;
    }
    setFormLoading(true);
    try {
      await api.post("/maintenance", {
        ...form,
        assignedCrewId: parseInt(form.assignedCrewId),
        shipId: parseInt(form.shipId),
      });
      setShowCreate(false);
      setForm({ title: "", description: "", dueDate: "", assignedCrewId: "", shipId: "" });
      load();
    } catch (e) {
      setFormError(e.message || "Failed to create task");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!showUpdate) return;
    try {
      await api.put(`/maintenance/${showUpdate.id}/status`, updateForm);
      setShowUpdate(null);
      load();
    } catch (e) {
      // Show in UI if needed
    }
  };

  const overdueCount = tasks.filter(t => t.status === "OVERDUE").length;

  return (
    <div>
      <PageHeader
        title="Maintenance Tasks"
        sub="Track and manage all maintenance operations"
        action={role === "ADMIN" && (
          <Button onClick={() => setShowCreate(true)}>+ New Task</Button>
        )}
      />

      {/* Overdue warning */}
      {overdueCount > 0 && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 12, padding: "12px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10,
          color: "#ef4444", fontSize: 13, fontWeight: 500,
        }}>
          ⚠ {overdueCount} task{overdueCount > 1 ? "s are" : " is"} overdue and require immediate attention
        </div>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Input label="Search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{ flex: 2, minWidth: 160 }} />
          <Select label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} options={STATUS_OPTIONS} style={{ flex: 1, minWidth: 140 }} />
          <Input label="Due After" value={filterDate} onChange={e => setFilterDate(e.target.value)} type="date" style={{ flex: 1, minWidth: 140 }} />
          <Button variant="ghost" onClick={() => { setFilterStatus(""); setFilterDate(""); setSearch(""); }}>Clear</Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : error ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
          <div style={{ color: "#ef4444", fontSize: 15, fontWeight: 500 }}>{error}</div>
        </div>
      ) : filtered.length === 0 ? (
          <EmptyState icon="⚙" message="No maintenance tasks found" />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,200,255,0.08)" }}>
                {["Task", "Description", "Due Date", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#6b7fa3", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => (
                <tr key={task.id} style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,200,255,0.04)" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 20px", color: "#e0eaff", fontSize: 14, fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: "14px 20px", color: "#6b7fa3", fontSize: 13, maxWidth: 200 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {task.description || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", color: task.status === "OVERDUE" ? "#ef4444" : "#6b7fa3", fontSize: 13 }}>
                    {task.dueDate || "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}><Badge status={task.status} /></td>
                  <td style={{ padding: "14px 20px" }}>
                    {role === "CREW" && task.status !== "COMPLETED" && (
                      <Button size="sm" variant="secondary" onClick={() => { setShowUpdate(task); setUpdateForm({ status: "IN_PROGRESS", notes: "" }); }}>
                        Update
                      </Button>
                    )}
                    {task.notes && (
                      <span style={{ color: "#3d4f6b", fontSize: 11, marginLeft: 8 }} title={task.notes}>📝</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Maintenance Task">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Engine Inspection" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Task description..."
              style={{
                background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.12)",
                borderRadius: 10, padding: "10px 14px", color: "#e0eaff", fontSize: 14,
                outline: "none", fontFamily: "inherit", resize: "vertical",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
            />
          </div>
          <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Crew ID" type="number" value={form.assignedCrewId} onChange={e => setForm(f => ({ ...f, assignedCrewId: e.target.value }))} placeholder="3" />
            <Input label="Ship ID" type="number" value={form.shipId} onChange={e => setForm(f => ({ ...f, shipId: e.target.value }))} placeholder="1" />
          </div>
          {formError && <div style={{ color: "#ef4444", fontSize: 13, padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>{formError}</div>}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={formLoading}>{formLoading ? "Creating…" : "Create Task"}</Button>
          </div>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal open={!!showUpdate} onClose={() => setShowUpdate(null)} title={`Update: ${showUpdate?.title}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Select label="New Status" value={updateForm.status} onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))} options={UPDATE_STATUSES} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: "#6b7fa3", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Notes</label>
            <textarea value={updateForm.notes} onChange={e => setUpdateForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Add completion notes..."
              style={{
                background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.12)",
                borderRadius: 10, padding: "10px 14px", color: "#e0eaff", fontSize: 14,
                outline: "none", fontFamily: "inherit", resize: "vertical",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(0,200,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,200,255,0.12)"}
            />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setShowUpdate(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Status</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}