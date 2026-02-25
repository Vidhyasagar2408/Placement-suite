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

export function analyzeJD(jdText, resumeSkills) {
  const jdSkills = extractFlatSkills(jdText || "");
  const normalizedResume = (resumeSkills || []).map((s) => s.toLowerCase());
  const matched = jdSkills.filter((skill) => normalizedResume.includes(skill.toLowerCase()));
  const missing = jdSkills.filter((skill) => !normalizedResume.includes(skill.toLowerCase()));
  const alignmentScore = jdSkills.length ? Math.round((matched.length / jdSkills.length) * 100) : 0;

  return { jdSkills, matched, missing, alignmentScore };
}
