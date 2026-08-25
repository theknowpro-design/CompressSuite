export const ERROR_MESSAGES = {
  empty: {
    title: "This file is empty",
    detail: "The file you uploaded is empty (0 bytes). Please choose a file with actual content.",
  },
  unsupported: {
    title: "This file isn’t supported",
    detail:
      "Please choose a supported file: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, MP4, MOV, WEBM, MKV, AVI, or MPEG. Images can be up to 50 MB and videos up to 500 MB.",
  },
  tooLarge: {
    title: "This file is too large",
    detail: "Images can be up to 50 MB and videos up to 500 MB.",
  },
  corrupted: {
    title: "This file couldn’t be read",
    detail: "The file may be damaged. Try exporting it again, then upload it once more.",
  },
  compressionFailure: {
    title: "Compression didn’t finish",
    detail: "Something went wrong while compressing. Please try again in a moment.",
  },
  codecMismatch: {
    title: "This video format isn’t compatible",
    detail: "Try exporting the video as MP4 (H.264), then upload it again.",
  },
};
