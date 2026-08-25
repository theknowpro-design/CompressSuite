// Default slider position: 40% (half of max 80% compression)
export const DEFAULT_COMPRESSION_LEVEL = 40;
// Maximum compression percentage achievable (slider max)
export const MAX_COMPRESSION_PERCENT = 80;

function clampLevel(level) {
  const numeric = Number(level);
  const value = Number.isFinite(numeric) ? numeric : DEFAULT_COMPRESSION_LEVEL;
  return Math.min(MAX_COMPRESSION_PERCENT, Math.max(0, value));
}

// Convert compression percentage (0-80) to image quality (1.0-0.2)
// 0% compression = 1.0 quality (no compression)
// 80% compression = 0.2 quality (maximum compression)
export function levelToImageQuality(level = DEFAULT_COMPRESSION_LEVEL) {
  const compressionPercent = clampLevel(level);
  const quality = 1.0 - compressionPercent / 100;
  return Number(quality.toFixed(3));
}

// Convert compression percentage (0-80) to video CRF (18-38)
// 0% compression = 18 CRF (best quality, minimal compression)
// 80% compression = 38 CRF (maximum compression)
export function levelToVideoCrf(level = DEFAULT_COMPRESSION_LEVEL) {
  const compressionPercent = clampLevel(level);
  const crf = 18 + (compressionPercent / 100) * 20;
  return String(Math.round(crf));
}
