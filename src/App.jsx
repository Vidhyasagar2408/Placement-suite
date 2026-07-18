import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import JobTrackerPage from "./pages/JobTrackerPage";
import PipelinePage from "./pages/PipelinePage";

function Layout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">PS</div>
          <div>
            <div className="brand">Placement Suite</div>
            <p className="brand-sub">Campus placement operating dashboard</p>
          </div>
        </div>
        <nav className="main-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/pipeline">Pipeline</NavLink>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobTrackerPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
      </Routes>
    </Layout>
  );
}
