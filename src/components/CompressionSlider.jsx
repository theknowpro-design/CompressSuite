function CompressionSlider({ value, onChange, onContinue, onClear }) {
  return (
    <section className="compression-slider" aria-label="Compression level">
      <label className="compression-slider__label" htmlFor="compression-level">
        Compression level
      </label>
      <div className="compression-slider__value-display">
        Compression: {value}%
      </div>
      <input
        id="compression-level"
        type="range"
        min="0"
        max="80"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="compression-slider__text">
        Select your preferred compression level. The engine maintains full visual clarity.
      </p>
      <div className="compression-slider__actions" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {onContinue ? (
          <button type="button" className="compression-slider__continue" onClick={() => {
            console.log("COMPRESS CLICKED");
            onContinue();
          }}>
            Continue
          </button>
        ) : null}
        {onClear ? (
          <button type="button" className="compression-slider__clear" onClick={onClear} style={{ flex: 1 }}>
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default CompressionSlider;
