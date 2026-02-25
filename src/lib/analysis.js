const SKILL_TAXONOMY = [
  { category: "Core CS", skills: [{ name: "DSA", patterns: [/\bdsa\b/i, /data structures?/i, /algorithms?/i] }, { name: "DBMS", patterns: [/\bdbms\b/i, /database/i] }, { name: "OS", patterns: [/\bos\b/i, /operating systems?/i] }] },
  { category: "Languages", skills: [{ name: "Java", patterns: [/\bjava\b/i] }, { name: "Python", patterns: [/\bpython\b/i] }, { name: "JavaScript", patterns: [/\bjavascript\b/i, /\bjs\b/i] }] },
  { category: "Web", skills: [{ name: "React", patterns: [/\breact\b/i] }, { name: "Node.js", patterns: [/\bnode\.?js\b/i] }, { name: "Express", patterns: [/\bexpress\b/i] }] },
  { category: "Data", skills: [{ name: "SQL", patterns: [/\bsql\b/i] }, { name: "MongoDB", patterns: [/\bmongodb\b/i] }, { name: "PostgreSQL", patterns: [/\bpostgres(?:ql)?\b/i] }] },
  { category: "Cloud/DevOps", skills: [{ name: "AWS", patterns: [/\baws\b/i] }, { name: "Docker", patterns: [/\bdocker\b/i] }, { name: "Kubernetes", patterns: [/\bkubernetes\b/i, /\bk8s\b/i] }] },
];

function extractFlatSkills(text = "") {
  const found = [];
  SKILL_TAXONOMY.forEach((group) => {
    group.skills.forEach((skill) => {
      if (skill.patterns.some((re) => re.test(text)) && !found.includes(skill.name)) {
        found.push(skill.name);
      }
    });
  });
  return found;
}

function buildRecommendations({ missing, alignmentScore }) {
  const suggestions = [];
  if (alignmentScore < 40) {
    suggestions.push("Rewrite resume summary with role-specific keywords from JD.");
  }
  if (missing.length) {
    suggestions.push(`Add project bullets that prove: ${missing.slice(0, 3).join(", ")}.`);
    suggestions.push("Include matching skills in resume Skills section with real evidence.");
  }
  if (!missing.length && alignmentScore >= 70) {
    suggestions.push("Good alignment. Move this job to Applied stage and prepare interview notes.");
  }
  return suggestions.slice(0, 4);
}

export function analyzeJD(jdText, resumeSkills) {
  const jdSkills = extractFlatSkills(jdText || "");
  const normalizedResume = (resumeSkills || []).map((s) => s.toLowerCase());
  const matched = jdSkills.filter((skill) => normalizedResume.includes(skill.toLowerCase()));
  const missing = jdSkills.filter((skill) => !normalizedResume.includes(skill.toLowerCase()));
  const alignmentScore = jdSkills.length ? Math.round((matched.length / jdSkills.length) * 100) : 0;
  const recommendations = buildRecommendations({ missing, alignmentScore });

  return { jdSkills, matched, missing, alignmentScore, recommendations };
}
