> 中文说明请见：[`README_ZH.md`](README_ZH.md)

## CollectionOfUsefulTools

CollectionOfUsefulTools is a practical collection of web-based tools, currently including image tools and text tools.

### Key Features

- Pure frontend implementation, no installation required, can be used directly in the browser.
- All processing is done locally in the browser (privacy-friendly).
- Supports drag-and-drop image upload.
- Modern UI design.
- Supports common image formats: PNG/JPG/JPEG/WebP/BMP/GIF. (Image tools only)

### Tool List

This project provides the following web-based tools:

#### Image Tools

1.  **Image Scale Resizing Tool** (`src/page/image/resize/image_resize.html`):
    -   Click or drag to upload images.
    -   Enter an original scale and one or more target scales (comma-separated).
    -   Uses high-quality LANCZOS resampling for scaling.
    -   Save scaled images with names like "original_name-<scale>x.extension".
    -   Supports multi-scale batch processing: for example, entering `1.25,2,3` will generate 1.25x, 2x, and 3x images.
    -   Supports downloading all scaled images as a ZIP file.

2.  **Image Comparison Tool** (`src/page/image/compare/image_compare.html`):
    -   Click or drag to upload two images for comparison.
    -   Supports overlay comparison mode.
    -   In overlay mode, adjust the transparency of the overlay image using a slider to easily spot differences.
    -   Supports a quick compare button to toggle the display/hide of the overlay image.

#### Text Tools

3.  **Text Comparison Tool** (`src/page/text/compare/text_compare.html`):
    -   Enter or paste two text snippets for comparison.
    -   Highlights text differences.

4.  **JSON Formatting Tool** (`src/page/text/json_format/json_format.html`):
    -   Enter or paste JSON text.
    -   Formats JSON text to make it more readable.

#### Web Version Usage

The web version is located in the `src/` directory.

**How to use:**

1.  Directly open `src/index.html` in your browser.
2.  Select the desired tool.
3.  Follow the tool-specific instructions.

### License

MIT

---

Chinese version is available in `README_ZH.md`.