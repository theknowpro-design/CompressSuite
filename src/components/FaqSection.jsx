import { useEffect } from "react";
import faqMarkdown from "../content/faq.md?raw";
import { parseFaqMarkdown } from "../utils/parseFaqMarkdown.js";

function stripInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1");
}

const FAQ_SECTIONS = parseFaqMarkdown(faqMarkdown);
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.map((section) => ({
    "@type": "Question",
    name: section.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: section.answers.map(stripInlineMarkdown).join(" "),
    },
  })),
};

function styledText(text, id) {
  const nodes = [];
  const pattern = /(\[([^\]]+)\]\((https?:[^)]+)\))|(\*\*(.+?)\*\*)/g;
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2] && match[3]) {
      nodes.push(
        <a
          key={`${id}-${index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[2]}
        </a>
      );
    } else if (match[5]) {
      nodes.push(<strong key={`${id}-${index}`}>{match[5]}</strong>);
    }
    lastIndex = pattern.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function FaqSection() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "compresssuite-faq-jsonld";
    document.getElementById(script.id)?.remove();
    script.textContent = JSON.stringify(FAQ_JSON_LD);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently asked questions</h2>
      {FAQ_SECTIONS.map((section) => (
        <article key={section.question} className="faq__item">
          <h3>{section.question}</h3>
          {section.answers.map((answer, index) => (
            <p key={`${section.question}-${index}`}>{styledText(answer, `${section.question}-${index}`)}</p>
          ))}
        </article>
      ))}
    </section>
  );
}

export default FaqSection;
