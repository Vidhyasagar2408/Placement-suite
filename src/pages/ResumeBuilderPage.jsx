import { useMemo, useState } from "react";
import { useSuite } from "../state/SuiteContext";

function safeLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function downloadBlob(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildResumeMarkup({ resume, skillList, expLines, projectLines }) {
  return `
    <section class="company-resume print-sheet">
      <header class="company-head">
        <h1>${escapeHtml(resume.name || "Your Name")}</h1>
        <p>${escapeHtml([resume.email, resume.phone, resume.location].filter(Boolean).join(" | "))}</p>
        <p>${escapeHtml([resume.linkedin, resume.github].filter(Boolean).join(" | "))}</p>
      </header>

      <section class="company-block">
        <h2>Professional Summary</h2>
        <p>${escapeHtml(resume.summary || "Add a concise role-focused summary.")}</p>
      </section>

      <section class="company-block">
        <h2>Education</h2>
        <p>${escapeHtml(resume.education || "Add education details with degree, college, year, and score.")}</p>
      </section>

      <section class="company-block">
        <h2>Experience</h2>
        <ul>
          ${
            expLines.length
              ? expLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")
              : "<li>Add measurable experience bullets.</li>"
          }
        </ul>
      </section>

      <section class="company-block">
        <h2>Projects</h2>
        <ul>
          ${
            projectLines.length
              ? projectLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")
              : "<li>Add projects with stack and outcomes.</li>"
          }
        </ul>
      </section>

      <section class="company-block">
        <h2>Skills</h2>
        <p>${escapeHtml(skillList.join(", ") || "Add relevant role skills.")}</p>
      </section>
    </section>
  `;
}

function buildResumeDocument({ resume, skillList, expLines, projectLines }) {
  const markup = buildResumeMarkup({ resume, skillList, expLines, projectLines });
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Resume - ${escapeHtml(resume.name || "Candidate")}</title>
        <style>
          body { margin: 0; font-family: Calibri, Arial, sans-serif; background: #f4f6f8; }
          .print-wrap { padding: 16px; display: grid; place-items: center; }
          .company-resume { width: 210mm; min-height: 297mm; background: #fff; color: #111; padding: 14mm 16mm; box-sizing: border-box; }
          .company-head { text-align: center; border-bottom: 1px solid #2f3f57; padding-bottom: 10px; margin-bottom: 12px; }
          .company-head h1 { margin: 0 0 4px; font-size: 27px; letter-spacing: 0.4px; }
          .company-head p { margin: 2px 0; font-size: 13px; }
          .company-block { margin-bottom: 10px; }
          .company-block h2 { margin: 0 0 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.7px; color: #1f2f46; border-bottom: 1px solid #d8e0ea; padding-bottom: 2px; }
          .company-block p { margin: 0; font-size: 12px; line-height: 1.45; }
          .company-block ul { margin: 0; padding-left: 18px; }
          .company-block li { font-size: 12px; line-height: 1.4; margin-bottom: 4px; }
          @media print {
            body { background: #fff; }
            .print-wrap { padding: 0; }
            .company-resume { box-shadow: none; width: auto; min-height: auto; padding: 12mm 14mm; }
          }
        </style>
      </head>
      <body>
        <main class="print-wrap">${markup}</main>
      </body>
    </html>
  `;
}

function openPrintWindow(documentHtml) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
  return true;
}

export default function ResumeBuilderPage() {
  const { resume, ats, currentAnalysis, actions } = useSuite();
  const [draftSkill, setDraftSkill] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const skillList = useMemo(
    () =>
      String(resume.skillsText || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [resume.skillsText]
  );

  const expLines = useMemo(() => safeLines(resume.experience), [resume.experience]);
  const projectLines = useMemo(() => safeLines(resume.projects), [resume.projects]);
  const jdMissing = currentAnalysis?.missing || [];
  const documentHtml = useMemo(
    () => buildResumeDocument({ resume, skillList, expLines, projectLines }),
    [resume, skillList, expLines, projectLines]
  );
  const previewMarkup = useMemo(
    () => buildResumeMarkup({ resume, skillList, expLines, projectLines }),
    [resume, skillList, expLines, projectLines]
  );

  const updateSkills = (nextSkills) => {
    actions.updateResume({ skillsText: nextSkills.join(", ") });
  };

  const addSkill = (value) => {
    const item = value.trim();
    if (!item) return;
    if (skillList.some((skill) => skill.toLowerCase() === item.toLowerCase())) return;
    updateSkills([...skillList, item]);
    setDraftSkill("");
  };

  const removeSkill = (target) => {
    updateSkills(skillList.filter((skill) => skill !== target));
  };

  const handleDownloadDoc = () => {
    const fileName = `${(resume.name || "resume").replace(/\s+/g, "_").toLowerCase()}_company_resume.doc`;
    downloadBlob(fileName, "application/msword;charset=utf-8", documentHtml);
    setExportMsg("DOC downloaded. Open and save as PDF if needed.");
  };

  const handleDownloadPdfReady = () => {
    const opened = openPrintWindow(documentHtml);
    setExportMsg(opened ? "Print window opened. Choose 'Save as PDF'." : "Enable pop-ups to export PDF.");
  };

  return (
    <section className="resume-suite">
      <section className="resume-editor stack">
        <article className="card">
          <h3>Professional Header</h3>
          <div className="resume-grid-two">
            <input value={resume.name || ""} onChange={(e) => actions.updateResume({ name: e.target.value })} placeholder="Full Name" />
            <input value={resume.email || ""} onChange={(e) => actions.updateResume({ email: e.target.value })} placeholder="Email" />
            <input value={resume.phone || ""} onChange={(e) => actions.updateResume({ phone: e.target.value })} placeholder="Phone" />
            <input value={resume.location || ""} onChange={(e) => actions.updateResume({ location: e.target.value })} placeholder="Location" />
          </div>
        </article>

        <article className="card">
          <h3>Links</h3>
          <div className="resume-grid-two">
            <input
              value={resume.linkedin || ""}
              onChange={(e) => actions.updateResume({ linkedin: e.target.value })}
              placeholder="LinkedIn URL"
            />
            <input
              value={resume.github || ""}
              onChange={(e) => actions.updateResume({ github: e.target.value })}
              placeholder="GitHub URL"
            />
          </div>
        </article>

        <article className="card">
          <h3>Summary</h3>
          <textarea
            rows={4}
            value={resume.summary || ""}
            onChange={(e) => actions.updateResume({ summary: e.target.value })}
            placeholder="Role-focused summary with strengths and measurable impact."
          />
        </article>

        <article className="card">
          <h3>Education</h3>
          <textarea
            rows={3}
            value={resume.education || ""}
            onChange={(e) => actions.updateResume({ education: e.target.value })}
            placeholder="B.Tech CSE | XYZ College | 2021-2025 | CGPA 8.4"
          />
        </article>

        <article className="card">
          <h3>Experience Highlights</h3>
          <textarea
            rows={6}
            value={resume.experience || ""}
            onChange={(e) => actions.updateResume({ experience: e.target.value })}
            placeholder="One bullet per line. Use action + metric."
          />
        </article>

        <article className="card">
          <h3>Projects</h3>
          <textarea
            rows={5}
            value={resume.projects || ""}
            onChange={(e) => actions.updateResume({ projects: e.target.value })}
            placeholder="Project name | tech stack | outcome"
          />
        </article>

        <article className="card">
          <h3>Skills Builder</h3>
          <div className="skill-entry">
            <input
              value={draftSkill}
              onChange={(e) => setDraftSkill(e.target.value)}
              placeholder="Add a skill and press Enter"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                addSkill(draftSkill);
              }}
            />
            <button type="button" onClick={() => addSkill(draftSkill)}>
              Add
            </button>
          </div>
          <ul className="tag-list">
            {skillList.map((skill) => (
              <li key={skill} className="tag skill-tag">
                {skill}
                <button type="button" className="tag-close" onClick={() => removeSkill(skill)}>
                  x
                </button>
              </li>
            ))}
          </ul>
          {jdMissing.length ? (
            <>
              <p className="muted">Suggested from latest JD analysis:</p>
              <ul className="tag-list">
                {jdMissing.map((skill) => (
                  <li key={skill}>
                    <button type="button" className="ghost-chip" onClick={() => addSkill(skill)}>
                      + {skill}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      </section>

      <aside className="resume-side stack">
        <article className="card">
          <h3>ATS Readiness</h3>
          <div className="ats-meter">
            <div className="ats-fill" style={{ width: `${ats.score}%` }} />
          </div>
          <p className="score">{ats.score}/100</p>
          <ul className="clean-list compact">
            {ats.suggestions.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3>Company-Ready Resume</h3>
          <div className="resume-actions">
            <button type="button" onClick={handleDownloadDoc}>Download DOC</button>
            <button type="button" onClick={handleDownloadPdfReady}>Download PDF</button>
          </div>
          {exportMsg ? <p className="muted">{exportMsg}</p> : null}
          <div className="resume-preview-shell" dangerouslySetInnerHTML={{ __html: previewMarkup }} />
        </article>
      </aside>
    </section>
  );
}
