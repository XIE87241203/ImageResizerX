> 中文说明请见：[`README_ZH.md`](README_ZH.md)

## MyImageUtils

MyImageUtils is a collection of useful web-based image tools, currently including a multi-scale image resizer and an image comparison tool.

### Features

- Pure frontend implementation, no installation needed, just open in a browser.
- All processing done locally in the browser (privacy-friendly).
- Drag & drop support for image uploads.
- Modern UI design.
- Common formats supported: PNG/JPG/JPEG/WebP/BMP/GIF.

### Tools

This project provides the following web-based tools:

1.  **Image Resizer Tool** (`htmlVersion/image_resize/resize.html`):
    -   Pick an image via click or drag & drop.
    -   Enter the original scale and one or more target scales (comma-separated).
    -   Resize with high-quality LANCZOS resampling.
    -   Save resized images as "name-<scale>x.ext".
    -   Multiple scales in one run: e.g., input `1.25,2,3` to generate 1.25x, 2x, 3x.
    -   Batch download all resized images as a ZIP file.

2.  **Image Comparison Tool** (`htmlVersion/image_compare/compare.html`):
    -   Upload two images via click or drag & drop for comparison.
    -   Supports two comparison modes: Overlay Comparison and Side-by-Side Comparison.
    -   In Overlay mode, adjust the transparency of the overlay image using a slider to easily spot differences.

#### Web Version Usage

The web version is located in the `htmlVersion/` directory.

**How to use:**

1.  Simply open `htmlVersion/index.html` in your browser.
2.  Select the desired tool (Image Resizer or Image Comparison).
3.  Follow the tool-specific instructions:
    -   **Image Resizer**: Click or drag & drop to upload an image, enter original and target scales, then click "开始处理" (Start Processing) to download individually or as a ZIP.
    -   **Image Comparison**: Upload two images to compare them using overlay or side-by-side modes.

### License

MIT

---

For the Chinese version of this README, see `README_ZH.md`.
