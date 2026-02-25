import { useSuite } from "../state/SuiteContext";

export default function ReadinessPage() {
  const { currentAnalysis, lastAnalyzedAt } = useSuite();

  return (
    <section className="stack">
      <article className="card">
        <h3>JD Analyzer</h3>
        {!currentAnalysis ? (
          <p>Select a job in Job Tracker and click Analyze JD.</p>
        ) : (
          <>
            <p className="muted">
              Job: <strong>{currentAnalysis.jobTitle}</strong> at <strong>{currentAnalysis.company}</strong>
            </p>
            <p className="muted">
              Last analyzed: {new Date(lastAnalyzedAt || currentAnalysis.analyzedAt).toLocaleString()}
            </p>
            <p>
              Alignment Score: <strong>{currentAnalysis.alignmentScore}%</strong>
            </p>
            <h4>Required Skills</h4>
            <p>{currentAnalysis.jdSkills.join(", ") || "No skill detected."}</p>
            <h4>Matched Skills</h4>
            <p>{currentAnalysis.matched.join(", ") || "No matches yet."}</p>
            <h4>Missing Skills</h4>
            <p>{currentAnalysis.missing.join(", ") || "No critical gaps."}</p>
            <h4>Recommended Next Steps</h4>
            <ul className="clean-list compact">
              {(currentAnalysis.recommendations || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </article>
      <article className="card">
        <h3>Cross-Module Automation</h3>
        <ol>
          <li>User saves a job.</li>
          <li>Click Analyze JD.</li>
          <li>JD skills are extracted.</li>
          <li>Resume skills are compared.</li>
          <li>Missing alignment is highlighted.</li>
          <li>Dashboard and placement score update.</li>
        </ol>
      </article>
    </section>
  );
}
