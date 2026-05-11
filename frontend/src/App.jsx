import { useState, useEffect, createContext, useContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import Drills from "./pages/Drills";
import Crew from "./pages/Crew";
import Sidebar from "./components/Sidebar";
import NotificationBanner from "./components/NotificationBanner";
import { api } from "./api";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    return token ? { token, role, name } : null;
  });
  const [page, setPage] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);

  const login = (token, role, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    setAuth({ token, role, name });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
    setPage("dashboard");
  };

  useEffect(() => {
    if (!auth) return;
    api.get("/maintenance").then((tasks) => {
      const overdue = tasks.filter((t) => t.status === "OVERDUE");
      if (overdue.length > 0) {
        setNotifications([
          `⚠️ ${overdue.length} maintenance task${overdue.length > 1 ? "s are" : " is"} overdue!`,
        ]);
      }
    }).catch(() => {});
  }, [auth]);

  if (!auth) return <Login onLogin={login} />;

  const pages = { dashboard: Dashboard, maintenance: Maintenance, drills: Drills, crew: Crew };
  const PageComponent = pages[page] || Dashboard;

  return (
    <AuthContext.Provider value={{ ...auth, logout }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e1a", fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar page={page} setPage={setPage} role={auth.role} name={auth.name} />
        <main style={{ flex: 1, marginLeft: 240, padding: "32px", overflowY: "auto", minHeight: "100vh" }}>
          {notifications.length > 0 && (
            <NotificationBanner messages={notifications} onClose={() => setNotifications([])} />
          )}
          <PageComponent setPage={setPage} />
        </main>
      </div>
    </AuthContext.Provider>
  );
}