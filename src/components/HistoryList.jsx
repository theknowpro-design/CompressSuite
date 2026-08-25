import { useEffect, useState } from "react";
import { clearHistory, getHistory, subscribeToHistory } from "../utils/historyStore";

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function HistoryList() {
  const [entries, setEntries] = useState(getHistory);

  useEffect(() => subscribeToHistory(setEntries), []);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="history-card" aria-label="Compression history">
      <div className="history-card__header">
        <h2>Recent compressions</h2>
        <button type="button" className="btn-secondary" onClick={clearHistory}>
          Clear History
        </button>
      </div>
      <ul className="history-list">
        {entries.map((entry) => (
          <li key={entry.id} className="history-list__item">
            <span className="history-list__name">{entry.filename}</span>
            <span className="history-list__meta">
              {entry.originalLabel} → {entry.compressedLabel}
            </span>
            <time dateTime={new Date(entry.timestamp).toISOString()}>
              {formatTimestamp(entry.timestamp)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HistoryList;
