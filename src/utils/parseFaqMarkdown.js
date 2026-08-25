export function parseFaqMarkdown(markdown) {
  if (typeof markdown !== "string" || markdown.length === 0) {
    return [];
  }

  const sections = [];
  let current = null;

  markdown.replace(/\r\n/g, "\n").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("# ")) {
      return;
    }
    if (trimmed.startsWith("## ")) {
      if (current) {
        sections.push(current);
      }
      current = { question: trimmed.slice(3).trim(), answers: [] };
      return;
    }
    if (current) {
      current.answers.push(trimmed);
    }
  });

  if (current) {
    sections.push(current);
  }

  return sections;
}
