import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HistoryList from "../components/HistoryList.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatSize } from "../utils/formatSize";

function Results() {
  const { compressionResult } = useApp();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const downloadStateRef = useRef({ timeoutId: null, objectUrl: null });

  const result = compressionResult;
  const type = result?.type ?? null;
  const file = result?.file ?? null;
  const originalSize = result?.originalSize ?? null;
  const compressedSize = result?.compressedSize ?? null;
  const metadata = result?.metadata ?? { width: null, height: null, duration: null };

  const percentageReduction =
    originalSize > 0 && compressedSize != null
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : null;

  // Generate image preview URL from compressed blob
  useEffect(() => {
    if (type !== "image" || !result?.compressedBlob) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(result.compressedBlob);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [result, type]);

  // Cleanup download object URLs on unmount — delay to avoid aborting active downloads
  useEffect(() => {
    return () => {
      if (downloadStateRef.current?.timeoutId) {
        clearTimeout(downloadStateRef.current.timeoutId);
      }
      downloadStateRef.current = { timeoutId: null, objectUrl: null };
    };
  }, []);

  function handleDownload() {
    if (!result?.compressedBlob) return;

    const objectUrl = URL.createObjectURL(result.compressedBlob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = type === "video" ? "compressed.mp4" : "compressed.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Revoke previous URL after a delay so in-flight downloads aren't interrupted
    if (downloadStateRef.current?.timeoutId) {
      clearTimeout(downloadStateRef.current.timeoutId);
      const prev = downloadStateRef.current.objectUrl;
      window.setTimeout(() => URL.revokeObjectURL(prev), 2000);
    }

    downloadStateRef.current.timeoutId = window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      downloadStateRef.current = { timeoutId: null, objectUrl: null };
    }, 1000);
    downloadStateRef.current.objectUrl = objectUrl;
  }

  return (
    <main className="page">
      <section className={result ? "results-panel is-ready" : "results-panel"}>
        <h1>Results</h1>

        {!result ? (
          <p className="status">
            No file found. <Link to="/upload">Upload a file</Link> to compress.
          </p>
        ) : (
          <>
            {previewUrl ? (
              <div className="card preview-card preview-card-small">
                <img src={previewUrl} alt="Compressed preview" />
              </div>
            ) : null}

            <div className="card">
              <p>Before: {formatSize(originalSize)}</p>
              <p>After: {formatSize(compressedSize)}</p>
              <p>
                Reduction:{" "}
                {percentageReduction == null ? "—" : `${percentageReduction}%`}
              </p>
              {result.message ? <p className="status">{result.message}</p> : null}
            </div>

            <button
              type="button"
              className="btn-details-toggle"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
              <div className="card details-card">
                <p><strong>Name:</strong> {file?.name ?? "—"}</p>
                <p><strong>Type:</strong> {type ?? "—"}</p>
                {metadata.width && metadata.height ? (
                  <p><strong>Dimensions:</strong> {metadata.width}×{metadata.height}</p>
                ) : null}
                {type === "video" && metadata.duration ? (
                  <p><strong>Duration:</strong> {metadata.duration.toFixed(1)}s</p>
                ) : null}
                <p><strong>Original size:</strong> {formatSize(originalSize)}</p>
                <p><strong>Compressed size:</strong> {formatSize(compressedSize)}</p>
              </div>
            )}

            <div className="results-actions">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!result?.compressedBlob}
                className="btn-download-primary"
              >
                Download File
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="btn-compress-another"
            >
              Compress Another File
            </button>
          </>
        )}
      </section>
      <HistoryList />
    </main>
  );
}

export default Results;
