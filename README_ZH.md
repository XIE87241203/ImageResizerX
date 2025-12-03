## ImageResizerX

一个简单实用的多倍率图片缩放工具（切图工具）：

- 通过系统文件选择对话框选择图片
- 在控制台输入原始倍率与多个输出倍率（逗号分隔）
- 使用高质量 LANCZOS 重采样缩放，输出文件按“原名-倍率x.扩展名”命名

### 主要特性

- 多倍率一次处理：输入如 1.25,2,3，会依次生成 1.25x、2x、3x 的图片
- 高质量缩放：使用 LANCZOS 重采样，JPEG/PNG 自动使用合理保存参数
- 兼容常见格式：PNG/JPG/JPEG/WebP/BMP/GIF
- 简单易用：文件对话框选图，命令行输入倍率即可

### 版本说明

本项目提供两个版本：

1. **Python 命令行版本**（`ImageResizerX.py`）：适合在本地环境使用，需要安装 Python 和依赖
2. **网页版本**（`htmlVersion/` 目录）：纯前端实现，无需安装任何依赖，直接在浏览器中打开即可使用

#### 网页版本使用

网页版本位于 `htmlVersion/` 目录，包含以下文件：

- `index.html` - 主页面
- `style.css` - 样式文件
- `app.js` - 功能逻辑

**使用方法：**

1. 直接在浏览器中打开 `htmlVersion/index.html`
2. 点击或拖拽上传图片
3. 输入原始倍率和输出倍率（支持多个，逗号分隔）
4. 点击"开始处理"，完成后可单独下载或打包下载

**网页版本特点：**

- ✅ 无需安装 Python 或任何依赖
- ✅ 所有处理在浏览器本地完成，保护隐私
- ✅ 支持拖拽上传
- ✅ 现代化 UI 界面
- ✅ 支持批量下载为 ZIP 文件

### 环境要求

- Python 3.9+
- 依赖：Pillow（图像处理），tkinter（文件对话框，Windows 通常自带）

安装 Pillow：

```bash
pip install pillow
```

### 快速开始

```bash
python ImageResizerX.py
```

步骤：

1. 弹出文件选择对话框，选择要缩放的图片
2. 输入“原始倍率”（例如 1 或 2）
3. 输入“输出倍率”，可多个，用逗号分隔（支持中文逗号），例如：
   - 1.5,2,3
   - 1.25，2，3

程序将依次生成对应倍率的图片，文件命名如下：

- a.png + 输出倍率 2 → a-2x.png
- a.png + 输出倍率 1.5 → a-1.5x.png

### 命名规则

- 采用“原名-倍率x.扩展名”，倍率会自动去除多余的 0（如 1.50 → 1.5）
- 保留原始扩展名；JPEG 使用 quality=95、optimize=True、subsampling=1；PNG 使用 optimize=True

### 示例

输入：原始倍率 1，输出倍率 1.25,2,3；原图为 `banner.png`
输出：

```
banner-1.25x.png
banner-2x.png
banner-3x.png
```

### 常见问题（FAQ）

- 没有弹出文件对话框？
  - 可能是环境缺少 tkinter；Windows 自带，一些最小化 Python 发行版可能未包含。此时程序会回退为控制台输入路径。
- 为什么选择 LANCZOS？
  - 质量通常最佳，尤其缩小时细节保持更好；但速度略慢。若对性能更敏感，可在代码中改为 BICUBIC。
- 支持批量选择多张图片吗？
  - 当前版本一次处理单张图片；如有需要可在 `ImageResizerX.py` 上扩展为多选并循环处理。

### 开发脚本入口

代码文件：`ImageResizerX.py`

主要函数：

- `resize_by_scale(input_path, original_scale, output_scale)`：按倍率缩放并保存
- `_select_image_via_dialog()`：弹出系统文件选择对话框
- `_prompt_scales()`：读取多个输出倍率（逗号分隔）

### 许可协议

MIT

---

English version is available in `README.md`.
