import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import JobTrackerPage from "./pages/JobTrackerPage";
import ReadinessPage from "./pages/ReadinessPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import PipelinePage from "./pages/PipelinePage";
import ProofPage from "./pages/ProofPage";

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
          <NavLink to="/readiness">Readiness</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <NavLink to="/pipeline">Pipeline</NavLink>
          <NavLink to="/proof">Proof</NavLink>
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
        <Route path="/readiness" element={<ReadinessPage />} />
        <Route path="/resume" element={<ResumeBuilderPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/proof" element={<ProofPage />} />
      </Routes>
    </Layout>
  );
}
