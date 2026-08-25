export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tif", "tiff"];
export const VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "mkv", "avi", "mpeg", "mpg"];

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/x-ms-bmp",
  "image/tiff",
  "image/tif",
];

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/mkv",
  "video/x-msvideo",
  "video/avi",
  "video/mpeg",
  "video/mpg",
];

export const FILE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff,.mp4,.mov,.webm,.mkv,.avi,.mpeg,.mpg";

export const SUPPORTED_FORMATS_LABEL =
  "JPG, JPEG, PNG, WEBP, GIF (first frame), BMP, TIFF, MP4, MOV, WEBM, MKV, AVI, MPEG, and MPG";

function extensionOf(filename) {
  const match = String(filename || "").toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

export function detectFileType(file) {
  if (!file) {
    return null;
  }

  const mime = String(file.type || "").toLowerCase();
  if (IMAGE_MIME_TYPES.includes(mime)) {
    return "image";
  }
  if (VIDEO_MIME_TYPES.includes(mime)) {
    return "video";
  }

  const extension = extensionOf(file.name);
  if (IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }
  if (VIDEO_EXTENSIONS.includes(extension)) {
    return "video";
  }

  return null;
}

export default detectFileType;
