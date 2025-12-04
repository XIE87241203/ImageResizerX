// image_resize.js
import { ImageUploader } from '../common/imageUploadModule.js';

// 全局变量
let currentFile = null;
let processedImages = [];
let currentFileDimensions = { width: 0, height: 0 }; // 存储当前图片的尺寸信息，避免重复加载图片获取宽高
let imageUploader; // ImageUploader 实例

// DOM 元素
const originalScaleInput = document.getElementById('originalScale');
const outputScalesInput = document.getElementById('outputScales');
const processBtn = document.getElementById('processBtn');
const errorMsg = document.getElementById('errorMsg');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultSection = document.getElementById('resultSection');
const resultList = document.getElementById('resultList');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// 格式化倍率字符串（去除多余的0）
function formatScale(scale) {
  const s = scale.toFixed(3).replace(/\.?0+$/, '');
  return s || '1';
}

// 处理文件选择或移除的回调函数
function handleFileChangeCallback(id, file, dataUrl) {
  currentFile = file; // 更新全局 currentFile

  if (file) {
    // 如果选择了文件，加载图片以获取尺寸
    const img = new Image();
    img.onload = () => {
      currentFileDimensions.width = img.width;
      currentFileDimensions.height = img.height;
    };
    img.src = dataUrl;
    processBtn.disabled = false;
    hideError();
  } else {
    // 如果移除了文件，清空尺寸信息并禁用处理按钮
    currentFileDimensions = { width: 0, height: 0 };
    processBtn.disabled = true;
    resultSection.classList.remove('show'); // 移除文件时隐藏结果区域
    processedImages = []; // 清空之前的处理结果
  }
  updateUI(); // 触发 UI 更新以反映文件变化
}


// 更新 UI 文本
function updateUI() {
  if (document.getElementById('title')) document.getElementById('title').textContent = `🖼️ ${t('title')}`;
  if (document.getElementById('subtitle')) document.getElementById('subtitle').textContent = t('subtitle');
  // uploadText, uploadHint, previewImage.alt, removeFile 的文本更新由 ImageUploader 内部处理
  if (document.getElementById('originalScaleLabel')) document.getElementById('originalScaleLabel').textContent = t('originalScale');
  if (document.getElementById('originalScale')) document.getElementById('originalScale').placeholder = t('originalScalePlaceholder');
  if (document.getElementById('originalScaleHint')) document.getElementById('originalScaleHint').textContent = t('originalScaleHint');
  if (document.getElementById('outputScalesLabel')) document.getElementById('outputScalesLabel').textContent = t('outputScales');
  if (document.getElementById('outputScales')) document.getElementById('outputScales').placeholder = t('outputScalesPlaceholder');
  if (document.getElementById('outputScalesHint')) document.getElementById('outputScalesHint').textContent = t('outputScalesHint');
  if (document.getElementById('processBtn')) document.getElementById('processBtn').textContent = t('processBtn');
  if (document.getElementById('resultTitle')) document.getElementById('resultTitle').textContent = t('resultTitle');
  if (document.getElementById('downloadAllBtn')) document.getElementById('downloadAllBtn').textContent = t('downloadAll');

  // 更新文档标题
  document.title = `${t('title')} - Web Version`;

  // 如果已有结果，更新结果列表
  if (processedImages.length > 0) {
    displayResults();
  }
}

// 使用 Canvas 高质量缩放图片
function resizeImage(image, originalScale, outputScale, mimeType = 'image/png') {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 计算缩放因子
    const scaleFactor = outputScale / originalScale;
    const newWidth = Math.max(1, Math.round(image.width * scaleFactor));
    const newHeight = Math.max(1, Math.round(image.height * scaleFactor));

    canvas.width = newWidth;
    canvas.height = newHeight;

    // 使用高质量缩放（浏览器会自动使用高质量算法）
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    // 根据 MIME 类型确定质量参数
    // JPEG 使用质量参数，其他格式使用默认值
    const quality = mimeType === 'image/jpeg' ? 0.95 : undefined;

    // 转换为 Blob，使用检测到的 MIME 类型
    canvas.toBlob(
      blob => {
        resolve({
          blob: blob,
          width: newWidth,
          height: newHeight,
          scale: outputScale,
        });
      },
      mimeType,
      quality,
    );
  });
}

/**
 * 处理图片缩放
 *
 * 该函数负责处理用户上传的图片，根据输入的原始倍率和输出倍率列表，
 * 使用 Canvas API 进行高质量缩放，并生成多个不同倍率的图片文件。
 *
 * @returns {Promise<void>} 异步函数，不返回具体值
 *
 * @throws {Error} 当图片加载失败或处理过程中出现错误时，会显示错误信息并恢复 UI 状态
 */
async function processImage() {
  // 1. 验证是否已选择文件
  const fileToProcess = imageUploader.getFile();
  if (!fileToProcess) {
    showError('errors.noFile');
    return;
  }

  // 2. 获取并验证原始倍率
  const originalScale = parseFloat(originalScaleInput.value);
  const outputScalesStr = outputScalesInput.value.trim();

  // 验证原始倍率是否为有效数字且大于 0
  if (isNaN(originalScale) || originalScale <= 0) {
    showError('errors.invalidOriginalScale');
    return;
  }

  // 验证是否输入了输出倍率
  if (!outputScalesStr) {
    showError('errors.noOutputScales');
    return;
  }

  // 3. 解析输出倍率列表
  // 将中文逗号替换为英文逗号，统一处理
  const outputScalesStrClean = outputScalesStr.replace(/，/g, ',');
  const outputScales = [];

  // 分割字符串并解析每个倍率值
  for (const scaleStr of outputScalesStrClean.split(',')) {
    const scale = parseFloat(scaleStr.trim());
    // 只添加有效的正数倍率
    if (!isNaN(scale) && scale > 0) {
      outputScales.push(scale);
    }
  }

  // 验证是否至少有一个有效的输出倍率
  if (outputScales.length === 0) {
    showError('errors.invalidOutputScales');
    return;
  }

  // 4. 初始化 UI 状态
  // 显示进度条，禁用处理按钮，隐藏之前的结果
  progress.classList.add('show');
  progressFill.style.width = '0%';
  // 修正进度文本中 current 的初始值，使其从 1 开始
  progressText.textContent = t('processingScale', {
    scale: formatScale(outputScales[0] || 1), // 假设第一个输出倍率，如果不存在则默认为1
    current: 0,
    total: outputScales.length,
  });
  processBtn.disabled = true;
  resultSection.classList.remove('show');
  processedImages = []; // 清空之前的处理结果

  // 5. 加载原始图片到内存
  const img = new Image();
  let objectURL = null;

  try {
    objectURL = URL.createObjectURL(fileToProcess);
    img.src = objectURL;

    // 等待图片加载完成
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // 6. 遍历处理每个输出倍率
    for (let i = 0; i < outputScales.length; i++) {
      const outputScale = outputScales[i];

      // 更新进度条和进度文本
      progressFill.style.width = `${((i + 1) / outputScales.length) * 100}%`;
      progressText.textContent = t('processingScale', {
        scale: formatScale(outputScale),
        current: i + 1,
        total: outputScales.length,
      });

      // 检测原始文件的 MIME 类型
      const originalMimeType = getMimeType(fileToProcess.name, fileToProcess.type);

      // 执行图片缩放操作
      const result = await resizeImage(img, originalScale, outputScale, originalMimeType);

      // 7. 生成符合命名规则的文件名
      // 格式：原名-倍率x.扩展名（例如：image-2x.png）
      const originalName = fileToProcess.name;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const ext = originalName.substring(originalName.lastIndexOf('.')) || '.png';
      const scaleStr = formatScale(outputScale);
      const newFileName = `${nameWithoutExt}-${scaleStr}x${ext}`;

      // 8. 保存处理结果到数组
      processedImages.push({
        blob: result.blob, // 图片的 Blob 对象
        fileName: newFileName, // 生成的文件名
        scale: outputScale, // 输出倍率
        width: result.width, // 缩放后的宽度
        height: result.height, // 缩放后的高度
        size: result.blob.size, // 文件大小（字节）
      });
    }

    // 9. 处理完成，更新 UI
    displayResults(); // 显示处理结果列表
    progress.classList.remove('show'); // 隐藏进度条
    processBtn.disabled = false; // 恢复处理按钮
  } catch (error) {
    // 错误处理：显示错误信息并恢复 UI 状态
    showError('errors.processFailed', { error: error.message });
    progress.classList.remove('show');
    processBtn.disabled = false;
  } finally {
    // 10. 清理资源：无论成功或失败都要释放 object URL，防止内存泄漏
    if (objectURL) {
      URL.revokeObjectURL(objectURL);
    }
  }
}

// 显示处理结果
function displayResults() {
  resultList.innerHTML = '';
  processedImages.forEach((item, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = `
                    <div class="result-info">
                        <div class="result-name">${item.fileName}</div>
                        <div class="result-size">${item.width} × ${item.height} | ${formatFileSize(item.size)}</div>
                    </div>
                    <button class="download-btn" data-index="${index}">${t('download')}</button>
                `;
    resultList.appendChild(resultItem);
  });

  // 绑定下载按钮
  resultList.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      downloadImage(processedImages[index]);
    });
  });

  resultSection.classList.add('show');
}

// 下载单个图片
function downloadImage(item) {
  const url = URL.createObjectURL(item.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 下载全部（ZIP）
async function downloadAll() {
  if (processedImages.length === 0) return;

  // 检查是否加载了 JSZip 库
  if (typeof JSZip === 'undefined') {
    // 如果没有 JSZip，逐个下载
    for (const item of processedImages) {
      downloadImage(item);
      // 增加一个小的延迟，避免浏览器下载管理器阻塞
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  const zip = new JSZip();
  for (const item of processedImages) {
    zip.file(item.fileName, item.blob);
  }

  let objectURL = null;
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    objectURL = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = objectURL;
    a.download = `resized_images_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    showError('errors.processFailed', { error: error.message });
  } finally {
    // 确保无论成功或失败都释放 object URL，防止内存泄漏
    if (objectURL) {
      URL.revokeObjectURL(objectURL);
    }
  }
}

// 绑定事件
if (processBtn) processBtn.addEventListener('click', processImage);
if (downloadAllBtn) downloadAllBtn.addEventListener('click', downloadAll);

// 回车键处理
if (originalScaleInput) {
  originalScaleInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') processImage();
  });
}
if (outputScalesInput) {
  outputScalesInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') processImage();
  });
}

// 页面初始化函数
async function initResizePage() {
    // 首先加载通用头部
    await loadCommonHeader('commonHeaderPlaceholder');

    // 初始化语言设置
    initLanguage();

    // 初始化 ImageUploader
    imageUploader = new ImageUploader('imageUploadContainer', 'main', handleFileChangeCallback);

    // 更新 UI 文本，依赖于语言设置和头部元素
    updateUI();
}

// 绑定语言改变事件，确保在头部加载后绑定
window.addEventListener('languageChanged', updateUI);

// 页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initResizePage);