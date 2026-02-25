function isFilled(value) {
  return String(value || "").trim().length > 0;
}

export function normalizeSkills(skillsText) {
  return String(skillsText || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function calculateATS(resume) {
  const suggestions = [];
  let score = 0;
  const hasName = isFilled(resume.name);
  const hasEmail = isFilled(resume.email);
  const hasSummary = String(resume.summary || "").trim().length > 50;
  const skills = normalizeSkills(resume.skillsText);
  const hasSkills = skills.length >= 5;
  const hasExperience = String(resume.experience || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean).length > 0;
  const hasProjects = String(resume.projects || "").trim().length > 15;
  const hasLinkedIn = isFilled(resume.linkedin);
  const hasGitHub = isFilled(resume.github);

  if (hasName) score += 12;
  else suggestions.push("Add your full name.");
  if (hasEmail) score += 12;
  else suggestions.push("Add your email.");
  if (hasSummary) score += 14;
  else suggestions.push("Write a stronger summary (50+ characters).");
  if (hasSkills) score += 16;
  else suggestions.push("Add at least 5 relevant skills.");
  if (hasExperience) score += 16;
  else suggestions.push("Add experience bullets.");
  if (hasProjects) score += 14;
  else suggestions.push("Add at least one strong project.");
  if (hasLinkedIn) score += 8;
  else suggestions.push("Add LinkedIn URL.");
  if (hasGitHub) score += 8;
  else suggestions.push("Add GitHub URL.");

  return { score: Math.min(score, 100), suggestions: suggestions.slice(0, 5), skills };
}
