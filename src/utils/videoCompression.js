let ffmpeg = null;
let fetchFile = null;
let loadPromise = null;
let runQueue = Promise.resolve();

function promiseWithTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), timeoutMs)
    ),
  ]);
}

async function getFFmpeg() {
  if (ffmpeg?.isLoaded()) {
    return { ffmpeg, fetchFile };
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      const ffmpegModule = await promiseWithTimeout(
        import("@ffmpeg/ffmpeg"),
        15000,
        "FFmpeg CDN load timeout. Please check your internet connection and try again."
      );
      fetchFile = ffmpegModule.fetchFile;
      ffmpeg = ffmpegModule.createFFmpeg({
        log: false,
        corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
      });
      await promiseWithTimeout(
        ffmpeg.load(),
        15000,
        "FFmpeg initialization timeout. Please try again."
      );
      return { ffmpeg, fetchFile };
    })().catch((error) => {
      loadPromise = null;
      ffmpeg = null;
      fetchFile = null;
      throw error;
    });
  }

  return loadPromise;
}

function safeUnlink(ffmpegInstance, path) {
  try {
    ffmpegInstance.FS("unlink", path);
  } catch {
    // File may not exist from a previous failed run.
  }
}

function blobFromFsData(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  return new Blob([bytes.slice()], { type: "video/mp4" });
}

function extractVideoMetadata(blobOrUrl, isUrl = false) {
  return new Promise((resolve) => {
    const url = isUrl ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    
    let resolved = false;
    let retryCount = 0;
    const maxRetries = 2;
    
    function attemptMetadataExtraction() {
      // Create a fresh video element for each attempt
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          video.onloadedmetadata = null;
          video.onerror = null;
          
          if (retryCount < maxRetries) {
            retryCount++;
            attemptMetadataExtraction();
          } else {
            resolved = true;
            if (!isUrl) URL.revokeObjectURL(url);
            resolve({ width: null, height: null, duration: null });
          }
        }
      }, 3000);
      
      video.onloadedmetadata = () => {
        if (!resolved) {
          clearTimeout(timeoutId);
          resolved = true;
          if (!isUrl) URL.revokeObjectURL(url);
          resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
          });
        }
      };
      
      video.onerror = () => {
        if (!resolved) {
          clearTimeout(timeoutId);
          
          if (retryCount < maxRetries) {
            retryCount++;
            attemptMetadataExtraction();
          } else {
            resolved = true;
            if (!isUrl) URL.revokeObjectURL(url);
            resolve({ width: null, height: null, duration: null });
          }
        }
      };
      
      video.src = url;
    }
    
    attemptMetadataExtraction();
  });
}

export default async function compressVideo(file, crf = "28") {
  const task = runQueue.then(async () => {
    const { ffmpeg: ffmpegInstance, fetchFile: readFile } = await getFFmpeg();

    safeUnlink(ffmpegInstance, "input.mp4");
    safeUnlink(ffmpegInstance, "output.mp4");

    ffmpegInstance.FS("writeFile", "input.mp4", await readFile(file));

    // Extract metadata from input video
    let metadata = { width: null, height: null, duration: null };
    try {
      await ffmpegInstance.run(
        "-i",
        "input.mp4",
        "-f",
        "null",
        "-"
      );
    } catch {
      // This command may fail but metadata will be in logs
    }

    // Try to extract dimensions and duration from the input file using a video element
    // with retry logic to ensure loadedmetadata fires reliably
    const inputBlob = new Blob([new Uint8Array(ffmpegInstance.FS("readFile", "input.mp4"))], { type: "video/mp4" });
    let videoMetadata = await extractVideoMetadata(inputBlob);

    metadata = videoMetadata;

    try {
      await ffmpegInstance.run(
        "-i",
        "input.mp4",
        "-vcodec",
        "libx264",
        "-crf",
        String(crf),
        "output.mp4"
      );

      const data = ffmpegInstance.FS("readFile", "output.mp4");
      const compressedBlob = blobFromFsData(data);

      // Final metadata extraction pass: if any dimension or duration is missing,
      // extract from the compressed output blob as a fallback
      if (metadata.width == null || metadata.height == null || metadata.duration == null) {
        const fallbackMetadata = await extractVideoMetadata(compressedBlob);
        metadata = {
          width: metadata.width ?? fallbackMetadata.width,
          height: metadata.height ?? fallbackMetadata.height,
          duration: metadata.duration ?? fallbackMetadata.duration,
        };
      }

      return {
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressedBlob,
        message: "Video compressed successfully.",
        metadata: {
          width: metadata.width,
          height: metadata.height,
          duration: metadata.duration,
        },
      };
    } catch (error) {
      const message = String(error?.message ?? error ?? "Video compression failed.");
      throw new Error(message);
    } finally {
      safeUnlink(ffmpegInstance, "input.mp4");
      safeUnlink(ffmpegInstance, "output.mp4");
    }
  });

  runQueue = task.then(
    () => undefined,
    () => undefined
  );

  return task;
}
