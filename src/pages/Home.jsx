import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompressionSlider from "../components/CompressionSlider.jsx";
import DropZone from "../components/DropZone.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { DEFAULT_COMPRESSION_LEVEL } from "../utils/compressionLevel";
import { setTransferPayload } from "../utils/fileTransfer";
import { validateFile } from "../utils/validateFile";

function Home() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const continuingRef = useRef(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedType, setDetectedType] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(DEFAULT_COMPRESSION_LEVEL);
  const dragCountRef = useRef(0);

  function applyFile(file) {
    if (!file) {
      return;
    }

    const { type, errorKey: nextError } = validateFile(file);
    continuingRef.current = false;
    
    // Ensure type is valid before proceeding
    const isValid = !nextError && type !== null;
    setErrorKey(nextError);
    setSelectedFile(isValid ? file : null);
    setDetectedType(isValid ? type : null);
  }

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    applyFile(file);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    dragCountRef.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    dragCountRef.current = Math.max(0, dragCountRef.current - 1);
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    dragCountRef.current = 0;
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    if (!file) {
      setErrorKey("unsupported");
      return;
    }
    applyFile(file);
  }, []);

  const handleDragEnd = useCallback((event) => {
    event.preventDefault();
    dragCountRef.current = 0;
    setIsDragging(false);
  }, []);

  const handleZoneClick = useCallback((event) => {
    if (!fileInputRef.current || event.target === fileInputRef.current) {
      return;
    }
    fileInputRef.current.click();
  }, []);

  function handleClearSelection() {
    setSelectedFile(null);
    setDetectedType(null);
    setCompressionLevel(DEFAULT_COMPRESSION_LEVEL);
    setErrorKey(null);
    continuingRef.current = false;
    setTransferPayload(null);
  }

  function handleContinue() {
    if (!selectedFile || continuingRef.current) {
      return;
    }

    continuingRef.current = true;
    const payload = {
      file: selectedFile,
      type: detectedType,
      compressionLevel,
    };
    setTransferPayload(payload);

    try {
      navigate("/results", { state: payload });
    } catch {
      continuingRef.current = false;
      setErrorKey("compressionFailure");
    }
  }

  return (
    <main className="page page--home">
      <DropZone
        fileInputRef={fileInputRef}
        selectedFile={selectedFile}
        detectedType={detectedType}
        isDragging={isDragging}
        onZoneClick={handleZoneClick}
        onFileChange={handleFileChange}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      {selectedFile ? (
        <CompressionSlider
          value={compressionLevel}
          onChange={setCompressionLevel}
          onContinue={handleContinue}
          onClear={handleClearSelection}
        />
      ) : null}
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
      <ErrorBanner errorKey={errorKey} />
      <HistoryList />
    </main>
  );
}

export default Home;
