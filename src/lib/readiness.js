const STAGE_SCORE = {
  saved: 20,
  applied: 45,
  interview_scheduled: 70,
  interview_completed: 82,
  offer: 100,
  rejected: 30,
};

export function computeApplicationProgress(jobs) {
  if (!jobs.length) return 0;
  const total = jobs.reduce((sum, job) => sum + (STAGE_SCORE[job.stage] || 0), 0);
  return Math.round(total / jobs.length);
}

export function computePlacementScore({ jobMatchQuality, jdSkillAlignment, resumeAtsScore, applicationProgress, practiceCompletion }) {
  return Math.round(
    jobMatchQuality * 0.3 +
      jdSkillAlignment * 0.25 +
      resumeAtsScore * 0.25 +
      applicationProgress * 0.1 +
      practiceCompletion * 0.1
  );
}

export function getStageLabel(stage) {
  return {
    saved: "Saved",
    applied: "Applied",
    interview_scheduled: "Interview Scheduled",
    interview_completed: "Interview Completed",
    offer: "Offer",
    rejected: "Rejected",
  }[stage];
}

export const PIPELINE_STAGES = Object.keys(STAGE_SCORE);
