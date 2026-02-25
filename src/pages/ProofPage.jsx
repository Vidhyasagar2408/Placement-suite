export default function ProofPage() {
  return (
    <section className="stack">
      <article className="card">
        <h3>Platform Proof</h3>
        <ul>
          <li>Job Tracker working</li>
          <li>JD Analyzer working</li>
          <li>Resume Builder + ATS working</li>
          <li>Unified Dashboard working</li>
          <li>Application Pipeline working</li>
          <li>Placement Score visible</li>
        </ul>
      </article>
      <article className="card">
        <h3>Architecture Principle</h3>
        <ul>
          <li>One global state</li>
          <li>Deterministic scoring</li>
          <li>No duplicated score logic</li>
          <li>Data separated from UI views</li>
        </ul>
      </article>
    </section>
  );
}
