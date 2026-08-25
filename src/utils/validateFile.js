import detectFileType from "./detectFileType";

export const IMAGE_MAX_BYTES = 50 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 500 * 1024 * 1024;

export function validateFile(file) {
  if (!file) {
    return { type: null, errorKey: "unsupported" };
  }

  if (file.size === 0) {
    return { type: null, errorKey: "empty" };
  }

  const type = detectFileType(file);
  if (!type) {
    return { type: null, errorKey: "unsupported" };
  }

  if (type === "image" && file.size > IMAGE_MAX_BYTES) {
    return { type, errorKey: "tooLarge" };
  }

  if (type === "video" && file.size > VIDEO_MAX_BYTES) {
    return { type, errorKey: "tooLarge" };
  }

  return { type, errorKey: null };
}

export function classifyCompressionError(error, type) {
  const message = String(error?.message ?? error ?? "").toLowerCase();

  if (message.includes("empty")) {
    return "empty";
  }

  if (message.includes("too large")) {
    return "tooLarge";
  }

  if (message.includes("timeout")) {
    return "compressionFailure";
  }

  if (message.includes("load image") || message.includes("corrupt")) {
    return "corrupted";
  }

  if (
    type === "video" &&
    (message.includes("codec") ||
      message.includes("libx264") ||
      message.includes("decoder") ||
      message.includes("invalid data") ||
      message.includes("ffmpeg exited") ||
      message.includes("ffprobe") ||
      message.includes("does not contain"))
  ) {
    return "codecMismatch";
  }

  return "compressionFailure";
}
