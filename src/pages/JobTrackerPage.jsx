import { useEffect, useMemo, useState } from "react";
import { scrapedJobsSeed } from "../data/scrapedJobs";
import { useSuite } from "../state/SuiteContext";

const JOB_API_BASE = import.meta.env.VITE_JOB_API_BASE || "http://localhost:5000/api";
const JOB_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const JOB_REFRESH_KEY = "placement_suite_jobs_last_refresh";
const JOB_TARGET_COUNT = 30;

export default function JobTrackerPage() {
  const { actions, ats } = useSuite();
  const [message, setMessage] = useState("");
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const [loadingScraped, setLoadingScraped] = useState(false);
  const [scrapedError, setScrapedError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => localStorage.getItem(JOB_REFRESH_KEY) || "");

  const resumeSkills = useMemo(() => (ats?.skills || []).map((skill) => skill.toLowerCase()), [ats?.skills]);

  const normalizeScrapedJob = (job, index) => ({
    _id: job._id || job.id || `scraped-${index}`,
    title: job.title || "Untitled Role",
    company: job.company || "Unknown Company",
    location: job.location || "Unknown",
    source: job.source || job.sourcePlatform || "Unknown source",
    applicationLink: job.applicationLink || job.applyUrl || job.externalUrl || "",
    externalUrl: job.externalUrl || job.applyUrl || job.applicationLink || "",
    description: job.description || job.jdText || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    experience: job.experience || job.experienceLevel || "",
    jobType: job.jobType || "",
    workMode: job.workMode || "",
    datePosted: job.datePosted || "",
    isNew: Boolean(job.isNew),
  });

  const formatPostedDate = (value) => {
    if (!value) return "Recently posted";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Recently posted" : parsed.toLocaleDateString();
  };

  const formatLastUpdated = (value) => {
    if (!value) return "Not refreshed yet";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Not refreshed yet" : parsed.toLocaleString();
  };

  const getCompanyInitials = (company) =>
    String(company || "Job")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");

  const fetchScrapedJobs = async () => {
    setLoadingScraped(true);
    setScrapedError("");
    try {
      const response = await fetch(`${JOB_API_BASE}/jobs?limit=${JOB_TARGET_COUNT}&page=1&isActive=true`);
      if (!response.ok) {
        throw new Error(`API ${response.status}`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload?.data)
        ? payload.data.map(normalizeScrapedJob).slice(0, JOB_TARGET_COUNT)
        : [];
      setScrapedJobs(items);
      if (!items.length) {
        setScrapedJobs(scrapedJobsSeed.map(normalizeScrapedJob).slice(0, JOB_TARGET_COUNT));
        setScrapedError("Backend returned no jobs, so the tracker dataset was loaded instead.");
      }
    } catch (error) {
      setScrapedJobs(scrapedJobsSeed.map(normalizeScrapedJob).slice(0, JOB_TARGET_COUNT));
      setScrapedError("Backend is not available, so jobs were loaded from your tracker dataset.");
    } finally {
      const nowIso = new Date().toISOString();
      localStorage.setItem(JOB_REFRESH_KEY, nowIso);
      setLastUpdatedAt(nowIso);
      setLoadingScraped(false);
    }
  };

  useEffect(() => {
    const lastRefreshRaw = localStorage.getItem(JOB_REFRESH_KEY);
    const lastRefreshTime = lastRefreshRaw ? new Date(lastRefreshRaw).getTime() : 0;
    const now = Date.now();

    if (!lastRefreshTime || Number.isNaN(lastRefreshTime) || now - lastRefreshTime >= JOB_REFRESH_INTERVAL_MS) {
      fetchScrapedJobs();
    } else {
      setScrapedJobs(scrapedJobsSeed.map(normalizeScrapedJob).slice(0, JOB_TARGET_COUNT));
      setLastUpdatedAt(lastRefreshRaw);
    }

    const intervalId = window.setInterval(() => {
      fetchScrapedJobs();
    }, JOB_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const saveScrapedJob = (job) => {
    const extractedSkills = Array.isArray(job.skills) ? job.skills : [];
    const overlap = extractedSkills.filter((skill) =>
      resumeSkills.includes(String(skill).toLowerCase())
    ).length;
    const matchScore = extractedSkills.length
      ? Math.round((overlap / extractedSkills.length) * 100)
      : 70;

    const jdText = [job.description, extractedSkills.join(", "), job.title, job.experience, job.jobType]
      .filter(Boolean)
      .join("\n");

    actions.saveNewJob({
      title: job.title || "Untitled Role",
      company: job.company || "Unknown Company",
      location: job.location || "Unknown",
      jdText,
      matchScore,
      source: job.source || job.sourcePlatform || "Unknown source",
      applyUrl: job.applicationLink || job.externalUrl || job.applyUrl || "",
    });

    setMessage(`Saved "${job.title}" from ${job.source || "source"} to your suite.`);
  };

  return (
    <section className="stack">
      <article className="card">
        <h3>Live Scraped Jobs (Multi-Source)</h3>
        <p className="muted">{scrapedJobs.length} open positions from your tracker sources.</p>
        <p className="muted">Auto refresh: every 6 hours. Last updated: {formatLastUpdated(lastUpdatedAt)}</p>
        <div className="resume-actions">
          <button type="button" onClick={fetchScrapedJobs}>Refresh Jobs</button>
        </div>
        {loadingScraped ? <p className="muted">Loading scraped jobs...</p> : null}
        {scrapedError ? <p className="muted">{scrapedError}</p> : null}
        {!loadingScraped && scrapedJobs.length ? (
          <div className="job-feed">
            {scrapedJobs.map((job) => (
              <article key={job._id || job.applicationLink} className="job-card">
                {job.isNew ? <span className="job-new-badge">New</span> : null}
                <div className="job-card-main">
                  <div className="job-logo">{getCompanyInitials(job.company)}</div>
                  <div className="job-copy">
                    <h4>{job.title}</h4>
                    <p className="job-company">{job.company}</p>
                    <div className="job-meta">
                      <span className="job-meta-pill">{job.location || "Unknown"}</span>
                      {job.workMode ? <span className="job-meta-pill">{job.workMode}</span> : null}
                      {job.jobType ? <span className="job-meta-pill">{job.jobType}</span> : null}
                      {job.experience ? <span className="job-meta-pill">{job.experience}</span> : null}
                    </div>
                    {job.skills.length ? (
                      <div className="job-skill-row">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="job-skill-chip">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 ? (
                          <span className="job-more-skills">+{job.skills.length - 4}</span>
                        ) : null}
                      </div>
                    ) : null}
                    <p className="job-description">{job.description || "No description available."}</p>
                  </div>
                  <div className="job-actions">
                    <button type="button" onClick={() => saveScrapedJob(job)}>
                      Save
                    </button>
                    <a
                      className="job-apply-link"
                      href={job.applicationLink || job.externalUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Apply
                    </a>
                  </div>
                </div>
                <div className="job-footer">
                  <span>{job.source || "Unknown source"}</span>
                  <span>{formatPostedDate(job.datePosted)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </article>

      {message ? (
        <article className="card">
          <h3>Job Updates</h3>
          <p className="muted">{message}</p>
        </article>
      ) : null}
    </section>
  );
}
