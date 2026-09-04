import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { levelToImageQuality, levelToVideoCrf } from "../utils/compressionLevel";
import { addHistoryEntry } from "../utils/historyStore";
import compressImage from "../utils/imageCompression";
import { classifyCompressionError } from "../utils/validateFile";

/**
 * Clean FFmpeg video compression.
 * Replaces the corrupted singleton-based videoCompression.js.
 * Each call creates its own isolated FFmpeg instance — no shared queue, no stale state.
 */
async function runVideoCompression(file, crf) {
  const { createFFmpeg, fetchFile } = await import("@ffmpeg/ffmpeg");
  const ff = createFFmpeg({
    log: false,
    corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  });
  await ff.load();

  ff.FS("writeFile", "input.mp4", await fetchFile(file));
  await ff.run("-i", "input.mp4", "-vcodec", "libx264", "-crf", String(crf), "output.mp4");

  const raw = ff.FS("readFile", "output.mp4");
  const blob = new Blob([new Uint8Array(raw)], { type: "video/mp4" });

  try { ff.FS("unlink", "input.mp4"); } catch { /* best-effort cleanup */ }
  try { ff.FS("unlink", "output.mp4"); } catch { /* best-effort cleanup */ }

  return {
    originalSize: file.size,
    compressedSize: blob.size,
    compressedBlob: blob,
    message: "Video compressed successfully.",
    metadata: { width: null, height: null, duration: null },
  };
}

/**
 * Compressing page — interstitial stage between UploadPage and Results.
 * Reads compressionJob from context, runs the appropriate pipeline,
 * stores the result in context, then navigates to /results.
 */
function Compressing() {
  const { compressionJob, setCompressionResult, setIsCompressing } = useApp();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard: run exactly once per mount (prevents double-fire in React Strict Mode dev builds)
    if (hasRun.current) return;
    hasRun.current = true;

    const job = compressionJob;

    if (!job?.file || (job.type !== "image" && job.type !== "video")) {
      navigate("/upload", { replace: true });
      return;
    }

    const { file, type, compressionLevel } = job;
    setIsCompressing(true);

    const pipeline =
      type === "image"
        ? compressImage(file, levelToImageQuality(compressionLevel))
        : runVideoCompression(file, levelToVideoCrf(compressionLevel));

    pipeline
      .then((result) => {
        addHistoryEntry({
          filename: file.name,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
        });
        // Store full result (including original File ref and type) in context
        setCompressionResult({ ...result, file, type });
        navigate("/results", { replace: true });
      })
      .catch((error) => {
        const errorKey = classifyCompressionError(error, type);
        navigate("/upload", { state: { errorKey }, replace: true });
      })
      .finally(() => {
        setIsCompressing(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs once on mount

  return (
    <main
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
      }}
    >
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "3rem 4rem",
          borderRadius: "12px",
          background: "var(--surface, #fff)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        }}
      >
        <style>{`@keyframes cs-spin { to { transform: rotate(360deg); } }`}</style>
        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid var(--border, #e5e7eb)",
            borderTopColor: "var(--accent, #6366f1)",
            borderRadius: "50%",
            animation: "cs-spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Compressing…</p>
      </div>
    </main>
  );
}

export default Compressing;
