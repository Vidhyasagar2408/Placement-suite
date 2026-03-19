import { PIPELINE_STAGES, getStageLabel } from "../lib/readiness";
import { useSuite } from "../state/SuiteContext";

export default function PipelinePage() {
  const { jobs, practiceCompletion, setPracticeCompletion, applicationProgress, actions } = useSuite();

  return (
    <section className="stack">
      <article className="card">
        <h3>Application Pipeline</h3>
        <p className="muted">Pipeline Progress Score</p>
        <div className="pipeline-progress-row">
          <div className="pipeline-progress-shell">
            <div className="pipeline-progress-track" aria-hidden="true">
              <div
                className="pipeline-progress-fill"
                style={{ width: `${Math.max(0, Math.min(applicationProgress, 100))}%` }}
              />
            </div>
          </div>
          <strong className="pipeline-progress-value">{applicationProgress}%</strong>
        </div>
        <table>
          <thead>
            <tr><th>Role</th><th>Company</th><th>Stage</th><th>Apply</th><th>Remove</th></tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>
                  <select value={job.stage} onChange={(e) => actions.updateJobStage(job.id, e.target.value)}>
                    {PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>{getStageLabel(stage)}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {job.applyUrl ? (
                    <a className="table-apply-link" href={job.applyUrl} target="_blank" rel="noreferrer">
                      Apply
                    </a>
                  ) : (
                    <span className="muted">No link</span>
                  )}
                </td>
                <td>
                  <button type="button" className="table-remove-btn" onClick={() => actions.removeJob(job.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="card">
        <h3>Practice Completion (10% weight)</h3>
        <p className="muted">Update your practice progress</p>
        <div className="practice-progress-row">
          <div className="practice-range-shell">
            <input
              className="practice-range"
              type="range"
              min="0"
              max="100"
              value={practiceCompletion}
              onChange={(e) => setPracticeCompletion(Number(e.target.value))}
            />
          </div>
          <span className="practice-simple-value">{practiceCompletion}%</span>
        </div>
      </article>
    </section>
  );
}
