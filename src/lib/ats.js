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
  const hasPhone = isFilled(resume.phone);
  const hasLocation = isFilled(resume.location);
  const hasSummary = String(resume.summary || "").trim().length > 50;
  const hasEducation = String(resume.education || "").trim().length > 12;
  const skills = normalizeSkills(resume.skillsText);
  const hasSkills = skills.length >= 5;
  const experienceLines = String(resume.experience || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const hasExperience = experienceLines.length > 0;
  const hasImpactBullet = experienceLines.some((line) => /\d|%|x|k\b/i.test(line));
  const hasProjects = String(resume.projects || "").trim().length > 15;
  const hasLinkedIn = isFilled(resume.linkedin);
  const hasGitHub = isFilled(resume.github);

  if (hasName) score += 10;
  else suggestions.push("Add your full name.");
  if (hasEmail) score += 10;
  else suggestions.push("Add your email.");
  if (hasPhone) score += 6;
  else suggestions.push("Add your phone number.");
  if (hasLocation) score += 4;
  else suggestions.push("Add your location.");
  if (hasSummary) score += 14;
  else suggestions.push("Write a stronger summary (50+ characters).");
  if (hasEducation) score += 10;
  else suggestions.push("Add education details.");
  if (hasSkills) score += 16;
  else suggestions.push("Add at least 5 relevant skills.");
  if (hasExperience) score += 14;
  else suggestions.push("Add experience bullets.");
  if (hasImpactBullet) score += 10;
  else suggestions.push("Add measurable impact in experience bullets (numbers/%).");
  if (hasProjects) score += 12;
  else suggestions.push("Add at least one strong project.");
  if (hasLinkedIn) score += 7;
  else suggestions.push("Add LinkedIn URL.");
  if (hasGitHub) score += 7;
  else suggestions.push("Add GitHub URL.");

  return { score: Math.min(score, 100), suggestions: suggestions.slice(0, 6), skills };
}
