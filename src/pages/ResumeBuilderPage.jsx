import { useSuite } from "../state/SuiteContext";

export default function ResumeBuilderPage() {
  const { resume, ats, currentAnalysis, actions } = useSuite();

  return (
    <section className="stack">
      <article className="card">
        <h3>Resume Builder + ATS</h3>
        <div className="form">
          <input value={resume.name} onChange={(e) => actions.updateResume({ name: e.target.value })} placeholder="Name" />
          <input value={resume.email} onChange={(e) => actions.updateResume({ email: e.target.value })} placeholder="Email" />
          <textarea value={resume.summary} onChange={(e) => actions.updateResume({ summary: e.target.value })} placeholder="Summary" />
          <textarea value={resume.experience} onChange={(e) => actions.updateResume({ experience: e.target.value })} placeholder="Experience bullets (new line)" />
          <textarea value={resume.projects} onChange={(e) => actions.updateResume({ projects: e.target.value })} placeholder="Projects" />
          <input value={resume.skillsText} onChange={(e) => actions.updateResume({ skillsText: e.target.value })} placeholder="Skills comma separated" />
          <input value={resume.linkedin} onChange={(e) => actions.updateResume({ linkedin: e.target.value })} placeholder="LinkedIn" />
          <input value={resume.github} onChange={(e) => actions.updateResume({ github: e.target.value })} placeholder="GitHub" />
        </div>
      </article>

      <article className="card">
        <h3>Resume ATS Score: {ats.score}/100</h3>
        <ul>{ats.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
      </article>

      <article className="card">
        <h3>Auto Resume Gap Check</h3>
        {currentAnalysis?.missing?.length ? (
          <p>Add these likely missing skills in relevant sections: {currentAnalysis.missing.join(", ")}</p>
        ) : (
          <p>No missing-skill alert from latest JD analysis.</p>
        )}
      </article>
    </section>
  );
}
