> 中文说明请见：[`README_ZH.md`](README_ZH.md)

## ImageResizerX

ImageResizerX is a simple and practical multi-scale image resizer:

- Pick an image via the system file dialog
- Enter the original scale and one or more target scales (comma-separated)
- Resize with high-quality LANCZOS resampling and save as "name-<scale>x.ext"

### Features

- Multiple scales in one run: e.g., input `1.25,2,3` to generate 1.25x, 2x, 3x
- High-quality resizing: LANCZOS resampling; sensible save params for JPEG/PNG
- Common formats supported: PNG/JPG/JPEG/WebP/BMP/GIF
- Easy to use: pick a file, type scales, done

### Versions

This project provides two versions:

1. **Python CLI Version** (`ImageResizerX.py`): For local use, requires Python and dependencies
2. **Web Version** (`htmlVersion/` directory): Pure frontend implementation, no installation needed, just open in browser

#### Web Version Usage

The web version is located in the `htmlVersion/` directory and includes:

- `index.html` - Main page
- `style.css` - Stylesheet
- `app.js` - Application logic

**How to use:**

1. Simply open `htmlVersion/index.html` in your browser
2. Click or drag & drop to upload an image
3. Enter original scale and target scales (comma-separated, multiple supported)
4. Click "开始处理" (Start Processing), then download individually or as a ZIP

**Web Version Features:**

- ✅ No Python or dependencies required
- ✅ All processing done locally in browser (privacy-friendly)
- ✅ Drag & drop support
- ✅ Modern UI design
- ✅ Batch download as ZIP file

### Requirements

- Python 3.9+
- Dependencies: Pillow (image processing), tkinter (file dialog; usually available on Windows)

Install Pillow:

```bash
pip install pillow
```

### Quick Start

```bash
python ImageResizerX.py
```

Steps:

1. Choose an image via the file dialog
2. Enter the original scale (e.g., 1 or 2)
3. Enter target scales, comma-separated (both English and Chinese commas are supported), e.g.:
   - `1.5,2,3`
   - `1.25，2，3`

The program will generate resized images for each target scale with names like:

- `a.png` + 2 → `a-2x.png`
- `a.png` + 1.5 → `a-1.5x.png`

### Naming Rules

- Uses `name-<scale>x.ext`; trailing zeros are trimmed (e.g., 1.50 → 1.5)
- Keeps original file extension; JPEG: `quality=95`, `optimize=True`, `subsampling=1`; PNG: `optimize=True`

### Example

Input: original scale `1`, target scales `1.25,2,3`; source `banner.png`
Output:

```
banner-1.25x.png
banner-2x.png
banner-3x.png
```

### FAQ

- No file dialog pops up?
  - Your environment might miss tkinter. On Windows it’s usually included. The app falls back to typing the path in the console.
- Why LANCZOS?
  - Typically best visual quality (especially downscaling). If you need faster processing, switch to BICUBIC in code.
- Batch multiple source images?
  - Current version processes one image per run. You can extend `ImageResizerX.py` to support multi-select and loop.

### Entry Point

Main script: `ImageResizerX.py`

Key functions:

- `resize_by_scale(input_path, original_scale, output_scale)`: Resize and save
- `_select_image_via_dialog()`: Open system file dialog
- `_prompt_scales()`: Read multiple target scales (comma-separated)

### License

MIT

---

For the Chinese version of this README, see `README_ZH.md`.
