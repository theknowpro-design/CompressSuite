import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { useApp } from "../context/AppContext.jsx";
import { DEFAULT_COMPRESSION_LEVEL, levelToImageQuality, levelToVideoCrf } from "../utils/compressionLevel";
import { getTransferPayload } from "../utils/fileTransfer";
import { formatSize } from "../utils/formatSize";
import { addHistoryEntry } from "../utils/historyStore";
import compressImage from "../utils/imageCompression";
import { classifyCompressionError } from "../utils/validateFile";
import compressVideo from "../utils/videoCompression";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsCompressing } = useApp();
  const transfer = getTransferPayload();
  const file = location.state?.file ?? transfer?.file ?? null;
  const type = location.state?.type ?? transfer?.type ?? null;
  const compressionLevel =
    location.state?.compressionLevel ?? transfer?.compressionLevel ?? DEFAULT_COMPRESSION_LEVEL;
  const [compressionResult, setCompressionResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [metadata, setMetadata] = useState({ width: null, height: null, duration: null });
  const [showDetails, setShowDetails] = useState(false);
  const downloadStateRef = useRef({ timeoutId: null, objectUrl: null });

  useEffect(() => {
    if (!file || (type !== "image" && type !== "video")) {
      setIsCompressing(false);
      setCompressionResult(null);
      setPreviewUrl(null);
      setStatus(null);
      setErrorKey(null);
      setMetadata({ width: null, height: null, duration: null });
      return;
    }

    let cancelled = false;
    setErrorKey(null);
    setMetadata({ width: null, height: null, duration: null });
    setStatus(type === "video" ? "Compressing video…" : "Compressing image…");
    setCompressionResult(null);
    setIsCompressing(true);

    const compress =
      type === "image"
        ? () => compressImage(file, levelToImageQuality(compressionLevel))
        : () => compressVideo(file, levelToVideoCrf(compressionLevel));

    compress()
      .then((result) => {
        if (cancelled) {
          return;
        }
        setCompressionResult(result);
        setStatus(result.message ?? "Done.");
        setMetadata(result.metadata || { width: null, height: null, duration: null });
        addHistoryEntry({
          filename: file.name,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorKey(classifyCompressionError(error, type));
          setStatus(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsCompressing(false);
        }
      });

    return () => {
      cancelled = true;
      setIsCompressing(false);
      setStatus(null);
      setErrorKey(null);
      setMetadata({ width: null, height: null, duration: null });
    };
  }, [file, type, compressionLevel, setIsCompressing, levelToImageQuality, levelToVideoCrf]);

  useEffect(() => {
    if (type !== "image" || !compressionResult?.compressedBlob) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(compressionResult.compressedBlob);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [compressionResult, type]);

  // Cleanup download state on unmount — only clears timeout, doesn't revoke URLs
  // to avoid aborting downloads in progress
  useEffect(() => {
    return () => {
      if (downloadStateRef.current?.timeoutId) {
        clearTimeout(downloadStateRef.current.timeoutId);
      }
      downloadStateRef.current = { timeoutId: null, objectUrl: null };
    };
  }, []);

  function handleDownload() {
    if (!compressionResult?.compressedBlob) {
      return;
    }

    const objectUrl = URL.createObjectURL(compressionResult.compressedBlob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = type === "video" ? "compressed.mp4" : "compressed.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clear any previous timeout and revoke its URL only after a delay
    if (downloadStateRef.current?.timeoutId) {
      clearTimeout(downloadStateRef.current.timeoutId);
      const previousUrl = downloadStateRef.current.objectUrl;
      
      // Schedule revocation of the previous URL after a delay to prevent interference
      // with the current download
      window.setTimeout(() => {
        URL.revokeObjectURL(previousUrl);
      }, 2000);
    }
    
    // Schedule revocation of current URL
    downloadStateRef.current.timeoutId = window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      downloadStateRef.current = { timeoutId: null, objectUrl: null };
    }, 1000);
    
    // Track the current URL
    downloadStateRef.current.objectUrl = objectUrl;
  }

  function handleCompressAnother() {
    navigate("/");
  }

  const originalSize = compressionResult?.originalSize;
  const compressedSize = compressionResult?.compressedSize;
  const percentageReduction =
    originalSize > 0 && compressedSize != null
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : null;
  const hasPreview = Boolean(previewUrl);

  return (
    <main className="page">
      <section className={compressionResult ? "results-panel is-ready" : "results-panel"}>
        <h1>Results</h1>
        <div className="cta-section">
          <a
            className="btn-secondary store-front-link"
            href="https://mindfulinternetp.gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            🛒 Explore the Mindful Internetpreneur Store Front
          </a>
          <a
            className="btn-secondary pcloud-link"
            href="https://partner.pcloud.com/r/157083"
            target="_blank"
            rel="noopener noreferrer"
          >
            🎥📁 Store Your Media & Files Forever with pCloud Lifetime Storage
          </a>
          <a
            className="btn-secondary operating-manual-link"
            href="https://myoperatingmanual.ai"
            target="_blank"
            rel="noopener noreferrer"
            title="See how you actually work for better collaboration."
          >
            📘 My Operating Manual
          </a>
        </div>
        {!file ? (
          <p className="status">
            No file found. <Link to="/">Upload a file</Link> to compress.
          </p>
        ) : null}
        <ErrorBanner errorKey={errorKey} />

        {compressionResult && (
          <>
            {hasPreview ? (
              <div className="card preview-card preview-card-small">
                {previewUrl ? <img src={previewUrl} alt="Compressed preview" /> : null}
              </div>
            ) : null}

            <div className="card">
              <p>After: {formatSize(compressedSize)}</p>
              <p>
                Actual reduction:{" "}
                {percentageReduction == null ? "—" : `${percentageReduction}%`}
              </p>
              {status ? <p className="status">{status}</p> : null}
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
                {type === "image" && metadata.width && metadata.height && (
                  <p><strong>Dimensions:</strong> {metadata.width}x{metadata.height}</p>
                )}
                <p><strong>Original size:</strong> {formatSize(originalSize)}</p>
                <p><strong>Compressed size:</strong> {formatSize(compressedSize)}</p>
              </div>
            )}

            <div className="results-actions">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!compressionResult?.compressedBlob}
                className="btn-download-primary"
              >
                Download File
              </button>
            </div>

            <button type="button" onClick={handleCompressAnother} className="btn-compress-another">
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
