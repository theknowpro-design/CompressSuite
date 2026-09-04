import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompressionSlider from "../components/CompressionSlider.jsx";
import DropZone from "../components/DropZone.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { useApp } from "../context/AppContext.jsx";
import { DEFAULT_COMPRESSION_LEVEL } from "../utils/compressionLevel";
import { validateFile } from "../utils/validateFile";

function UploadPage() {
  const { setCompressionJob } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const continuingRef = useRef(false);
  const dragCountRef = useRef(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedType, setDetectedType] = useState(null);
  const [errorKey, setErrorKey] = useState(location.state?.errorKey ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(DEFAULT_COMPRESSION_LEVEL);

  function applyFile(file) {
    if (!file) return;
    const { type, errorKey: nextError } = validateFile(file);
    continuingRef.current = false;
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
    if (dragCountRef.current === 0) setIsDragging(false);
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
    if (!fileInputRef.current || event.target === fileInputRef.current) return;
    fileInputRef.current.click();
  }, []);

  function handleClearSelection() {
    setSelectedFile(null);
    setDetectedType(null);
    setCompressionLevel(DEFAULT_COMPRESSION_LEVEL);
    setErrorKey(null);
    continuingRef.current = false;
  }

  function handleContinue() {
    if (!selectedFile || continuingRef.current) return;
    continuingRef.current = true;
    setCompressionJob({ file: selectedFile, type: detectedType, compressionLevel });
    navigate("/compressing");
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
      <ErrorBanner errorKey={errorKey} />
      <HistoryList />
    </main>
  );
}

export default UploadPage;
