"""
简单的图片倍率缩放工具：
1) 通过系统文件选择对话框选择图片；
2) 在控制台输入原始倍率与输出倍率；
   - 输出倍率支持多个值，用英文或中文逗号分隔（如：1.5,2,3 或 1.5，2，3）
3) 按高质量算法缩放，并以“原名-倍率x.扩展名”保存。

示例：输入 a.png、原始倍率 1、输出倍率 2 → 输出 a-2x.png
依赖：Pillow（pip install pillow）；tkinter（Windows 通常自带，缺失时会回退为手动输入路径）
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image, ImageOps
except Exception as exc:  # Pillow 依赖缺失或导入失败
    print("Pillow not found. Please install it first: pip install pillow")
    raise

try:
    import tkinter as tk
    from tkinter import filedialog
except Exception:
    tk = None
    filedialog = None


def _format_scale_for_name(scale: float) -> str:
    """将倍率格式化为文件名友好的字符串，例如 2 -> '2', 1.50 -> '1.5'."""
    # 使用最多三位小数，去除末尾多余的 0 与小数点
    s = f"{scale:.3f}".rstrip("0").rstrip(".")
    return s if s else "1"


def resize_by_scale(input_path: str, original_scale: float, output_scale: float) -> Path:
    """
    按倍率缩放图片并保存。

    - input_path: 输入图片路径
    - original_scale: 原始倍率（例如 1.0、2.0）
    - output_scale: 目标倍率（例如 2.0、1.5）

    返回输出文件的 Path。
    """
    # 规范化并检查路径
    path = Path(input_path).expanduser()
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    if original_scale <= 0 or output_scale <= 0:
        raise ValueError("Original scale and target scale must be greater than 0")

    with Image.open(path) as im:
        width, height = im.size

        # 计算同比例缩放因子（目标倍率 / 原始倍率）
        scale_factor = output_scale / original_scale
        new_w = max(1, int(round(width * scale_factor)))
        new_h = max(1, int(round(height * scale_factor)))

        # 使用 LANCZOS 高质量重采样算法进行缩放
        im_resized = im.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)

        # 生成输出文件名：原名-倍率x.扩展名（倍率为输出倍率）
        stem = path.stem
        suffix = path.suffix  # 保持原拓展名
        scale_str = _format_scale_for_name(output_scale)
        out_name = f"{stem}-{scale_str}x{suffix}"
        out_path = path.with_name(out_name)

        # 按常见格式设置保存参数，尽量在保证质量的同时优化体积
        save_params = {}
        fmt = (im.format or '').upper()
        if fmt == 'JPEG' or suffix.lower() in {'.jpg', '.jpeg'}:
            save_params.update({
                'quality': 95,
                'optimize': True,
                'subsampling': 1,
            })
        if fmt == 'PNG' or suffix.lower() == '.png':
            save_params.update({'optimize': True})

        im_resized.save(out_path, **save_params)
        return out_path


def _prompt_float(prompt: str) -> float:
    while True:
        s = input(prompt).strip().replace(",", ",")
        try:
            v = float(s)
            if v <= 0:
                print("Please enter a number greater than 0.")
                continue
            return v
        except ValueError:
            print("Invalid format. Please enter a number, e.g., 1, 1.5, 2.")


def _prompt_scales(prompt: str) -> list[float]:
    """Prompt for multiple target scales (comma-separated) and return valid scales (>0)."""
    while True:
        raw = input(prompt).strip().replace("，", ",")
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        values: list[float] = []
        ok = True
        for p in parts:
            try:
                v = float(p)
                if v <= 0:
                    print(f"Scale must be > 0. Ignored invalid value: {p}")
                    ok = False
                    continue
                values.append(v)
            except ValueError:
                print(f"Unable to parse scale. Ignored: {p}")
                ok = False
        if values:
            return values
        print("Please enter at least one valid scale, e.g., 1.5,2,3.")


def _select_image_via_dialog() -> str | None:
    """Open system file dialog to choose an image. Return path or None."""
    if tk is None or filedialog is None:
        # Fallback when tkinter is unavailable: ask for the path in console
        p = input("Please enter the image path: ").strip().strip('"')
        return p or None

    root = tk.Tk()
    root.withdraw()
    root.update()
    filetypes = [
        ("Image files", "*.png *.jpg *.jpeg *.webp *.bmp *.gif"),
        ("All files", "*.*"),
    ]
    path = filedialog.askopenfilename(title="Choose Image", filetypes=filetypes)
    try:
        root.destroy()
    except Exception:
        pass
    return path or None


def main():
    # Flow: choose image via dialog → input scales → resize and save
    img_path = _select_image_via_dialog()
    if not img_path:
        print("No image selected. Cancelled.")
        return

    original = _prompt_float("Enter original scale (e.g., 1 or 2): ")
    targets = _prompt_scales("Enter target scales (comma-separated, e.g., 1.5,2,3): ")

    for t in targets:
        out_path = resize_by_scale(img_path, original, t)
        print(f"Saved: {out_path}")


if __name__ == "__main__":
    main()


