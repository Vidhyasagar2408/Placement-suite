import { useState } from "react";
import { useSuite } from "../state/SuiteContext";

const defaults = { title: "", company: "", location: "", jdText: "", matchScore: 70 };

export default function JobTrackerPage() {
  const { jobs, actions } = useSuite();
  const [form, setForm] = useState(defaults);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.title || !form.company || !form.jdText) return;
    actions.saveNewJob(form);
    setForm(defaults);
  };

  return (
    <section className="stack">
      <article className="card">
        <h3>Add Job</h3>
        <form className="form" onSubmit={onSubmit}>
          <input placeholder="Role" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          <input placeholder="Company" value={form.company} onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
          <input type="number" min="0" max="100" placeholder="Match Score" value={form.matchScore} onChange={(e) => setForm((s) => ({ ...s, matchScore: e.target.value }))} />
          <textarea placeholder="Paste JD" value={form.jdText} onChange={(e) => setForm((s) => ({ ...s, jdText: e.target.value }))} />
          <button type="submit">Save Job</button>
        </form>
      </article>

      <article className="card">
        <h3>Saved Jobs</h3>
        <table>
          <thead>
            <tr><th>Role</th><th>Company</th><th>Match</th><th>Stage</th><th>Action</th></tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>{j.matchScore}%</td>
                <td>{j.stage}</td>
                <td><button onClick={() => actions.analyzeJob(j.id)}>Analyze JD</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
