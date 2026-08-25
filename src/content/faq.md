# CompressSuite FAQ

## What is CompressSuite?
CompressSuite is a free, browser-based image and video compressor. Your files stay on your device while the engine reduces size and keeps visual clarity.

## Is CompressSuite really always free?
Yes. CompressSuite is always free to use. You can compress images and videos without an account, subscription, or upload to a remote server.

## What file types can I compress?
CompressSuite supports the most common image and video formats:

**Images:** JPG, JPEG, PNG, WEBP, GIF (first frame), BMP, TIFF  
**Videos:** MP4, MOV, WEBM, MKV, AVI, MPEG

Images must be **50 MB or smaller**.  
Videos must be **500 MB or smaller**.

Unsupported, corrupted, or undecodable files will show a clear error message.

## How large can my files be?
Images can be up to 50 MB. Videos can be up to 500 MB. If a file is larger, CompressSuite will ask you to choose a smaller export.

## Why is the actual reduction different from the compression level I selected?
The compression level you choose controls quality, not file size. The "Selected Compression Level" sets how aggressively the engine compresses your file, but the "Actual Reduction" depends on how compressible your original file already is.

This means the two numbers will almost never match exactly.

Why they differ:
- Your selected compression level sets a target quality (e.g., 40%, 55%, 80%).
- The actual reduction depends on the file's structure, including:
  • original bitrate
  • noise and motion complexity (videos)
  • color gradients and entropy (images)
  • PNG → JPEG conversion behavior
  • codec efficiency
  • metadata overhead
  • audio bitrate (videos)

So a 60% compression level might produce an 86% reduction, while a 55% compression level might produce a 37% reduction. This is normal and expected — your selected compression level controls how hard the engine compresses, while the actual reduction reflects how much the file could realistically shrink.

## Does compression reduce resolution?
Short answer: No. CompressSuite's engine preserves the original width × height. Compression reduces file size by adjusting quality and encoding efficiency, not by lowering resolution.

## Why did my file get bigger after compression?
In rare cases, a file may increase in size after compression. This usually happens when the original file is already highly optimized, or when PNG images are converted to JPEG. Compression rewrites metadata, quantization tables, and container structure, which can result in a slightly larger file when the compression level is very low. This is normal and expected.

## Why does video compression take longer than image compression?
Videos require significantly more processing than images. CompressSuite must decode frames, re-encode them, handle audio, and rebuild the container. Images compress in milliseconds because they contain no frames or audio. Video compression time depends on resolution, bitrate, motion complexity, and length.

## Does compression remove audio?
No. CompressSuite preserves your audio tracks during compression. The audio stream is re-muxed into the final MP4 file along with the compressed video stream.

## Does compression change the file format?
Images are converted to JPEG for optimal compression. Videos remain MP4. This ensures maximum compatibility and efficient compression results.

## Does my media leave my computer?
Compression runs in your browser. CompressSuite does not require you to upload files to the Mindful Internetpreneur servers to complete a compression.

## Where can I find more Mindful Internetpreneur tools?
Explore templates, journals, and digital products in the [Mindful Internetpreneur Store Front](https://mindfulinternetp.gumroad.com).
