import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateATS, normalizeSkills } from "../lib/ats";
import { analyzeJD } from "../lib/analysis";
import { computeApplicationProgress, computePlacementScore } from "../lib/readiness";

const STORAGE_KEY = "placement_suite_state_v1";
const SuiteContext = createContext(null);

const seedJobs = [
  { id: "j1", title: "Frontend Developer", company: "Acme Labs", location: "Bengaluru", matchScore: 92, stage: "saved", jdText: "React JavaScript TypeScript REST APIs SQL CI/CD", savedAt: new Date().toISOString() },
  { id: "j2", title: "SDE Intern", company: "ByteWorks", location: "Hyderabad", matchScore: 86, stage: "applied", jdText: "DSA OOP DBMS OS Java Python", savedAt: new Date().toISOString() },
  { id: "j3", title: "Software Engineer", company: "CloudNest", location: "Pune", matchScore: 74, stage: "interview_scheduled", interviewAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), jdText: "Node.js Express MongoDB Docker AWS", savedAt: new Date().toISOString() },
];

const initialResume = {
  name: "Your Name",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: "",
  experience: "",
  projects: "",
  skillsText: "React, JavaScript, HTML, CSS",
  linkedin: "",
  github: "",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildNotificationRules({ jobs, resumeAts, alignmentScore, lastActivityAt }) {
  const alerts = [];
  const highMatch = jobs.find((j) => j.matchScore >= 90);
  if (highMatch) alerts.push(`New high match job found: ${highMatch.title} (${highMatch.matchScore}%)`);
  if (resumeAts < 70) alerts.push("Resume ATS score is below 70.");
  if (alignmentScore !== null && alignmentScore < 40) alerts.push("JD analyzed but resume alignment is low.");

  const now = Date.now();
  const interviewSoon = jobs.find((j) => {
    if (!j.interviewAt) return false;
    const diff = new Date(j.interviewAt).getTime() - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  });
  if (interviewSoon) alerts.push(`Interview in 24h: ${interviewSoon.title} at ${interviewSoon.company}.`);

  const inactiveFor = now - new Date(lastActivityAt).getTime();
  if (inactiveFor > 3 * 24 * 60 * 60 * 1000) alerts.push("No activity for 3 days.");

  return alerts;
}

export function SuiteProvider({ children }) {
  const loaded = loadState();
  const [jobs, setJobs] = useState(loaded?.jobs || seedJobs);
  const [resume, setResume] = useState(loaded?.resume || initialResume);
  const [currentAnalysis, setCurrentAnalysis] = useState(loaded?.currentAnalysis || null);
  const [practiceCompletion, setPracticeCompletion] = useState(loaded?.practiceCompletion || 40);
  const [lastActivityAt, setLastActivityAt] = useState(loaded?.lastActivityAt || new Date().toISOString());
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState(loaded?.lastAnalyzedAt || null);

  const ats = useMemo(() => calculateATS(resume), [resume]);
  const jobMatchQuality = useMemo(() => {
    if (!jobs.length) return 0;
    return Math.round(jobs.reduce((sum, j) => sum + j.matchScore, 0) / jobs.length);
  }, [jobs]);

  const applicationProgress = useMemo(() => computeApplicationProgress(jobs), [jobs]);
  const placementScore = useMemo(
    () =>
      computePlacementScore({
        jobMatchQuality,
        jdSkillAlignment: currentAnalysis?.alignmentScore || 0,
        resumeAtsScore: ats.score,
        applicationProgress,
        practiceCompletion,
      }),
    [jobMatchQuality, currentAnalysis?.alignmentScore, ats.score, applicationProgress, practiceCompletion]
  );

  const notifications = useMemo(
    () =>
      buildNotificationRules({
        jobs,
        resumeAts: ats.score,
        alignmentScore: currentAnalysis?.alignmentScore ?? null,
        lastActivityAt,
      }),
    [jobs, ats.score, currentAnalysis?.alignmentScore, lastActivityAt]
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ jobs, resume, currentAnalysis, practiceCompletion, lastActivityAt, lastAnalyzedAt })
    );
  }, [jobs, resume, currentAnalysis, practiceCompletion, lastActivityAt, lastAnalyzedAt]);

  const markActivity = () => setLastActivityAt(new Date().toISOString());

  const saveNewJob = ({ title, company, location, jdText, matchScore }) => {
    const next = {
      id: `j-${Date.now()}`,
      title,
      company,
      location,
      jdText,
      matchScore: Number(matchScore) || 65,
      stage: "saved",
      savedAt: new Date().toISOString(),
    };
    setJobs((prev) => [next, ...prev]);
    markActivity();
  };

  const analyzeJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return null;
    if (!String(job.jdText || "").trim()) return null;
    const analysis = analyzeJD(job.jdText, normalizeSkills(resume.skillsText));
    setCurrentAnalysis({
      jobId,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      analyzedAt: new Date().toISOString(),
      ...analysis,
    });
    setLastAnalyzedAt(new Date().toISOString());
    markActivity();
    return analysis;
  };

  const updateJobStage = (jobId, stage) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, stage, interviewAt: stage === "interview_scheduled" ? job.interviewAt || new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString() : job.interviewAt } : job
      )
    );
    markActivity();
  };

  const updateResume = (patch) => {
    setResume((prev) => ({ ...prev, ...patch }));
    markActivity();
  };

  const value = {
    jobs,
    resume,
    ats,
    currentAnalysis,
    placementScore,
    jobMatchQuality,
    applicationProgress,
    practiceCompletion,
    setPracticeCompletion,
    notifications,
    lastAnalyzedAt,
    actions: { saveNewJob, analyzeJob, updateJobStage, updateResume, markActivity },
  };

  return <SuiteContext.Provider value={value}>{children}</SuiteContext.Provider>;
}

export function useSuite() {
  const ctx = useContext(SuiteContext);
  if (!ctx) throw new Error("useSuite must be used inside SuiteProvider");
  return ctx;
}
