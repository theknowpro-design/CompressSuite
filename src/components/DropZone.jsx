import { FILE_ACCEPT, SUPPORTED_FORMATS_LABEL } from "../utils/supportedFormats";

function UploadIcon() {
  return (
    <svg className="drop-zone__icon" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="8" width="48" height="48" rx="14" className="drop-zone__icon-plate" />
      <path
        d="M32 42 V22 M32 22 L24 30 M32 22 L40 30"
        className="drop-zone__icon-arrow"
      />
      <path d="M20 44 H44" className="drop-zone__icon-base" />
    </svg>
  );
}

function DropZone({
  fileInputRef,
  selectedFile,
  detectedType,
  isDragging,
  onZoneClick,
  onFileChange,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
}) {
  const className = isDragging ? "drop-zone is-dragging" : "drop-zone";

  return (
    <div
      className={className}
      onClick={onZoneClick}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <input
        type="file"
        accept={FILE_ACCEPT}
        ref={fileInputRef}
        hidden
        onClick={(event) => event.stopPropagation()}
        onChange={onFileChange}
      />
      <UploadIcon />
      <p className="drop-zone__title">
        Drag & drop your media here or tap to select a file. Supports {SUPPORTED_FORMATS_LABEL}. Images up to 50 MB · Videos up to 500 MB.
      </p>
      {selectedFile ? <p className="drop-zone__file">{selectedFile.name}</p> : null}
      {detectedType ? <p className="drop-zone__type">Detected type: {detectedType}</p> : null}
    </div>
  );
}

export default DropZone;
