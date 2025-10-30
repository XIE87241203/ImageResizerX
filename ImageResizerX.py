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
    print("未找到 Pillow 库，请先安装：pip install pillow")
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
        raise FileNotFoundError(f"找不到文件: {path}")

    if original_scale <= 0 or output_scale <= 0:
        raise ValueError("原始倍率与输出倍率必须大于 0")

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
        s = input(prompt).strip().replace("，", ",")
        try:
            v = float(s)
            if v <= 0:
                print("请输入大于 0 的数字。")
                continue
            return v
        except ValueError:
            print("格式错误，请输入数字，例如 1、1.5、2。")


def _prompt_scales(prompt: str) -> list[float]:
    """提示输入多个倍率，逗号分隔，返回有效倍率列表（>0）。"""
    while True:
        raw = input(prompt).strip().replace("，", ",")
        """列表推导式，只有满足条件的p才会被最前方的表达式处理，否则跳过"""
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        values: list[float] = []
        ok = True
        for p in parts:
            try:
                v = float(p)
                if v <= 0:
                    print(f"倍率需大于 0，已忽略无效值: {p}")
                    ok = False
                    continue
                values.append(v)
            except ValueError:
                print(f"无法解析的倍率，已忽略: {p}")
                ok = False
        if values:
            return values
        print("请至少输入一个有效倍率，例如：1.5,2,3。")


def _select_image_via_dialog() -> str | None:
    """调用系统文件选择对话框选择图片，返回路径或 None。"""
    if tk is None or filedialog is None:
        # 兼容无 tkinter 环境：回退为控制台输入
        p = input("请输入图片路径（可拖入）：").strip().strip('"')
        return p or None

    root = tk.Tk()
    root.withdraw()
    root.update()
    filetypes = [
        ("图片文件", "*.png *.jpg *.jpeg *.webp *.bmp *.gif"),
        ("所有文件", "*.*"),
    ]
    path = filedialog.askopenfilename(title="选择图片", filetypes=filetypes)
    try:
        root.destroy()
    except Exception:
        pass
    return path or None


def main():
    # 流程：文件对话框选择图片 → 输入倍率 → 缩放并保存
    img_path = _select_image_via_dialog()
    if not img_path:
        print("未选择图片，已取消。")
        return

    original = _prompt_float("请输入原始倍率（例如 1、2）：")
    targets = _prompt_scales("请输入输出倍率（可多个，用逗号分隔，例如 1.5,2,3）：")

    for t in targets:
        out_path = resize_by_scale(img_path, original, t)
        print(f"已输出：{out_path}")


if __name__ == "__main__":
    main()


