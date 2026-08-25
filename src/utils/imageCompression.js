export default function compressImage(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Failed to load image for compression."));
      return;
    }

    const compressionStartTime = performance.now();
    let objectUrl;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
      return;
    }

    const image = new Image();
    const loadTimeoutId = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load timeout. The image took too long to decode."));
    }, 10000);

    image.onload = () => {
      clearTimeout(loadTimeoutId);
      URL.revokeObjectURL(objectUrl);

      try {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;

        if (!width || !height) {
          reject(new Error("Failed to load image for compression."));
          return;
        }

        const MAX_DIMENSION = 10000;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          reject(new Error("Image dimensions are too large for compression."));
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Failed to create canvas context."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed."));
              return;
            }

            const compressionEndTime = performance.now();
            const duration = Math.max(0.001, compressionEndTime - compressionStartTime);

            resolve({
              originalSize: file.size,
              compressedSize: blob.size,
              compressedBlob: blob,
              message: "Image compressed successfully.",
              metadata: {
                width: width,
                height: height,
                duration: duration / 1000,
              },
            });
          },
          "image/jpeg",
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      clearTimeout(loadTimeoutId);
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression."));
    };

    image.src = objectUrl;
  });
}
