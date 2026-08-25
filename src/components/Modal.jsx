function Modal({ selectedFile, detectedType, onClose, onContinue }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p>{selectedFile?.name}</p>
        <p>{detectedType}</p>
        <div className="modal-card__actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
          <button type="button" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
