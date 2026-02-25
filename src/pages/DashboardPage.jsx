import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useSuite } from "../state/SuiteContext";

function formatStage(stage) {
  return stage
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DashboardPage() {
  const { jobs, ats, currentAnalysis, placementScore, notifications, applicationProgress, jobMatchQuality } =
    useSuite();

  const top5 = useMemo(() => [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5), [jobs]);
  const stageCount = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc[job.stage] = (acc[job.stage] || 0) + 1;
      return acc;
    }, {});
  }, [jobs]);

  const weakSkills = currentAnalysis?.missing?.slice(0, 6) || [];
  const nextAction =
    ats.score < 70
      ? "Improve ATS fundamentals by filling summary, projects, and skills."
      : (currentAnalysis?.alignmentScore ?? 0) < 60
      ? "Align resume keywords with latest JD before applying."
      : "Move highest-match saved jobs to Applied and prepare interview notes.";

  return (
    <section className="dashboard">
      <article className="hero card reveal">
        <div>
          <p className="eyebrow">Unified Dashboard</p>
          <h1>Placement Command Center</h1>
          <p className="hero-text">
            One score, one pipeline, one workflow. Track your placement momentum across job matches, resume quality,
            and interview readiness.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="link-btn">
              Save Job
            </Link>
            <Link to="/readiness" className="link-btn ghost">
              Analyze JD
            </Link>
            <Link to="/resume" className="link-btn ghost">
              Improve Resume
            </Link>
          </div>
        </div>
        <div className="score-orb">
          <span>Placement Score</span>
          <strong>{placementScore}</strong>
          <small>/100</small>
        </div>
      </article>

      <section className="kpi-grid">
        <article className="card reveal">
          <h3>Daily Job Matches</h3>
          <p className="score">{jobMatchQuality}%</p>
          <p className="muted">Average match quality across saved jobs.</p>
        </article>
        <article className="card reveal">
          <h3>Resume ATS Score</h3>
          <p className="score">{ats.score}%</p>
          <p className="muted">Automated quality scan for recruiter filters.</p>
        </article>
        <article className="card reveal">
          <h3>Current JD Readiness</h3>
          <p className="score">{currentAnalysis?.alignmentScore ?? 0}%</p>
          <p className="muted">Latest resume-to-JD skill alignment.</p>
        </article>
        <article className="card reveal">
          <h3>Application Pipeline</h3>
          <p className="score">{applicationProgress}%</p>
          <p className="muted">Progress based on stage transitions.</p>
        </article>
      </section>

      <section className="panel-grid">
        <article className="card reveal">
          <h3>Top 5 Matches</h3>
          <ul className="clean-list">
            {top5.map((job) => (
              <li key={job.id} className="row-item">
                <div>
                  <strong>{job.title}</strong>
                  <p className="muted">
                    {job.company} · {job.location}
                  </p>
                </div>
                <span className="pill">{job.matchScore}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card reveal">
          <h3>Applications Pipeline</h3>
          <ul className="clean-list">
            {Object.entries(stageCount).map(([stage, count]) => (
              <li key={stage}>
                <div className="progress-head">
                  <span>{formatStage(stage)}</span>
                  <strong>{count}</strong>
                </div>
                <div className="mini-track">
                  <div
                    className="mini-fill"
                    style={{ width: `${Math.min((count / Math.max(jobs.length, 1)) * 100, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card reveal">
          <h3>Weak Skill Alert</h3>
          {weakSkills.length ? (
            <ul className="tag-list">
              {weakSkills.map((skill) => (
                <li key={skill} className="tag">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No critical gap detected from latest JD.</p>
          )}
        </article>

        <article className="card reveal">
          <h3>Next Action Recommendation</h3>
          <p>{nextAction}</p>
          <ul className="clean-list compact">
            {notifications.length ? notifications.map((alert) => <li key={alert}>{alert}</li>) : <li>No active alerts.</li>}
          </ul>
        </article>
      </section>
    </section>
  );
}
