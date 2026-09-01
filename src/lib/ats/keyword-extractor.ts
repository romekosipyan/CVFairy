const STOP = new Set([
  "a",
  "an",
  "and",
  "the",
  "to",
  "of",
  "in",
  "for",
  "with",
  "on",
  "at",
  "as",
  "by",
  "or",
  "is",
  "are",
  "be",
  "you",
  "we",
  "our",
  "your",
]);

export function extractKeywords(text: string): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z0-9+#.]{1,}/g) ?? []) {
    if (STOP.has(raw)) {
      continue;
    }
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word);
}

export function keywordGap(jobDescription: string, resumeText: string) {
  const fromJD = extractKeywords(jobDescription);
  const inResume = new Set(extractKeywords(resumeText));
  const missing = fromJD.filter((word) => !inResume.has(word));
  const matched = fromJD.filter((word) => inResume.has(word));
  const matchPercentage =
    fromJD.length === 0 ? 0 : Math.round((matched.length / fromJD.length) * 100);
  return {
    fromJD,
    inResume: [...inResume],
    missing,
    matchPercentage,
  };
}
