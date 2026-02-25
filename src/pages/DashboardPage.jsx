import { useMemo } from "react";
import { useSuite } from "../state/SuiteContext";

export default function DashboardPage() {
  const { jobs, ats, currentAnalysis, placementScore, notifications } = useSuite();
  const top5 = useMemo(() => [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5), [jobs]);
  const stageCount = useMemo(
    () =>
      jobs.reduce(
        (acc, j) => ({ ...acc, [j.stage]: (acc[j.stage] || 0) + 1 }),
        {}
      ),
    [jobs]
  );

  return (
    <section className="grid">
      <article className="card">
        <h3>Placement Score</h3>
        <p className="score">{placementScore}/100</p>
        <p>Single central readiness metric.</p>
      </article>

      <article className="card">
        <h3>Daily Job Matches (Top 5)</h3>
        <ul>
          {top5.map((j) => (
            <li key={j.id}>{j.title} - {j.company} ({j.matchScore}%)</li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Resume ATS Score</h3>
        <p className="score">{ats.score}</p>
      </article>

      <article className="card">
        <h3>Current JD Readiness</h3>
        <p className="score">{currentAnalysis?.alignmentScore ?? 0}</p>
      </article>

      <article className="card">
        <h3>Applications Pipeline</h3>
        <ul>
          {Object.entries(stageCount).map(([stage, count]) => (
            <li key={stage}>{stage}: {count}</li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Weak Skill Alert</h3>
        {currentAnalysis?.missing?.length ? (
          <p>{currentAnalysis.missing.slice(0, 6).join(", ")}</p>
        ) : (
          <p>No critical gap detected.</p>
        )}
      </article>

      <article className="card">
        <h3>Next Action Recommendation</h3>
        <p>
          {ats.score < 70
            ? "Improve ATS sections first."
            : currentAnalysis?.alignmentScore < 60
            ? "Align resume with latest JD."
            : "Move highest-match saved jobs to Applied."}
        </p>
      </article>

      <article className="card">
        <h3>Notification Intelligence</h3>
        <ul>
          {notifications.length ? notifications.map((n) => <li key={n}>{n}</li>) : <li>No active alerts.</li>}
        </ul>
      </article>
    </section>
  );
}
