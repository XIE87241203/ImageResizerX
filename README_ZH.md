## CollectionOfUsefulTools

CollectionOfUsefulTools 是一个实用的网页版工具合集，目前包含图片工具和文本工具。

### 主要特性

- 纯前端实现，无需安装，浏览器中直接打开即可使用。
- 所有处理均在浏览器本地完成（隐私友好）。
- 支持拖拽上传图片。
- 现代化 UI 设计。
- 支持常见图片格式：PNG/JPG/JPEG/WebP/BMP/GIF。（仅图片工具）

### 工具列表

本项目提供以下网页版工具：

#### 图片工具

1.  **图片倍率缩放工具** (`src/page/image/resize/image_resize.html`):
    -   点击或拖拽上传图片。
    -   输入原始倍率和一个或多个目标倍率（逗号分隔）。
    -   使用高质量 LANCZOS 重采样进行缩放。
    -   保存缩放后的图片，命名格式为“原名-<倍率>x.扩展名”。
    -   支持多倍率一次性处理：例如，输入 `1.25,2,3` 会生成 1.25x、2x、3x 的图片。
    -   支持将所有缩放后的图片打包下载为 ZIP 文件。

2.  **图片对比工具** (`src/page/image/compare/image_compare.html`):
    -   点击或拖拽上传两张图片进行对比。
    -   支持叠加对比模式。
    -   在叠加模式下，可以通过滑动条调整叠加图片的透明度，方便发现差异。
    -   支持快速对比按钮，切换叠加图片的显示/隐藏。

#### 文本工具

3.  **文本对比工具** (`src/page/text/compare/text_compare.html`):
    -   输入或粘贴两段文本进行对比。
    -   高亮显示文本差异。

4.  **JSON格式化工具** (`src/page/text/json_format/json_format.html`):
    -   输入或粘贴JSON文本。
    -   格式化JSON文本，使其更易读。

#### 网页版本使用

网页版本位于 `src/` 目录。

**使用方法：**

1.  直接在浏览器中打开 `src/index.html`。
2.  选择所需的工具。
3.  遵循工具 specific 的说明。

### 许可协议

MIT

---

English version is available in `README.md`.
