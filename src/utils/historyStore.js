import { formatSize } from "./formatSize";

const HISTORY_KEY = "compresssuite-history";
const HISTORY_EVENT = "compresssuite-history";
const MAX_ENTRIES = 20;

function readRaw() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getHistory() {
  return readRaw();
}

export function addHistoryEntry({ filename, originalSize, compressedSize }) {
  const existing = readRaw();
  const now = Date.now();
  const duplicate = existing.find(
    (entry) =>
      entry.filename === (filename || "Untitled") &&
      entry.originalSize === (originalSize ?? 0) &&
      entry.compressedSize === (compressedSize ?? 0) &&
      now - entry.timestamp < 2500
  );

  if (duplicate) {
    return existing;
  }

  const entries = [
    {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      filename: filename || "Untitled",
      originalSize: originalSize ?? 0,
      compressedSize: compressedSize ?? 0,
      timestamp: now,
      originalLabel: formatSize(originalSize),
      compressedLabel: formatSize(compressedSize),
    },
    ...existing,
  ].slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      window.dispatchEvent(
        new CustomEvent("STORAGE_QUOTA_EXCEEDED", {
          detail: { message: "Storage quota exceeded. Recent compressions may not be saved." },
        })
      );
    }
    return entries;
  }

  window.dispatchEvent(new Event(HISTORY_EVENT));
  return entries;
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore storage failures.
  }
  window.dispatchEvent(new Event(HISTORY_EVENT));
  return [];
}

export function subscribeToHistory(callback) {
  const handler = () => callback(getHistory());
  window.addEventListener(HISTORY_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HISTORY_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
