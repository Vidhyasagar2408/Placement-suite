import { PIPELINE_STAGES, getStageLabel } from "../lib/readiness";
import { useSuite } from "../state/SuiteContext";

export default function PipelinePage() {
  const { jobs, practiceCompletion, setPracticeCompletion, applicationProgress, actions } = useSuite();

  return (
    <section className="stack">
      <article className="card">
        <h3>Application Pipeline</h3>
        <p>Pipeline Progress Score: {applicationProgress}</p>
        <table>
          <thead>
            <tr><th>Role</th><th>Company</th><th>Stage</th></tr>
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
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="card">
        <h3>Practice Completion (10% weight)</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={practiceCompletion}
          onChange={(e) => setPracticeCompletion(Number(e.target.value))}
        />
        <p>{practiceCompletion}%</p>
      </article>
    </section>
  );
}
