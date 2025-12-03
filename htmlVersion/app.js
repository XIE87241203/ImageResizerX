// 全局变量
let currentFile = null;
let processedImages = [];

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const imageInfo = document.getElementById('imageInfo');
const removeFile = document.getElementById('removeFile');
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

// 语言切换按钮
const langZhBtn = document.getElementById('langZh');
const langEnBtn = document.getElementById('langEn');

// 格式化倍率字符串（去除多余的0）
function formatScale(scale) {
  const s = scale.toFixed(3).replace(/\.?0+$/, '');
  return s || '1';
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 更新 UI 文本
function updateUI() {
  document.getElementById('title').textContent = `🖼️ ${t('title')}`;
  document.getElementById('subtitle').textContent = t('subtitle');
  document.getElementById('uploadText').textContent = t('uploadText');
  document.getElementById('uploadHint').textContent = t('uploadHint');
  document.getElementById('previewImage').alt = t('previewAlt');
  document.getElementById('removeFile').textContent = t('removeFile');
  document.getElementById('originalScaleLabel').textContent = t('originalScale');
  document.getElementById('originalScale').placeholder = t('originalScalePlaceholder');
  document.getElementById('originalScaleHint').textContent = t('originalScaleHint');
  document.getElementById('outputScalesLabel').textContent = t('outputScales');
  document.getElementById('outputScales').placeholder = t('outputScalesPlaceholder');
  document.getElementById('outputScalesHint').textContent = t('outputScalesHint');
  document.getElementById('processBtn').textContent = t('processBtn');
  document.getElementById('resultTitle').textContent = t('resultTitle');
  document.getElementById('downloadAllBtn').textContent = t('downloadAll');

  // 更新语言按钮状态
  langZhBtn.classList.toggle('active', currentLang === 'zh');
  langEnBtn.classList.toggle('active', currentLang === 'en');

  // 更新文档标题
  document.title = `${t('title')} - Web Version`;

  // 如果已选择文件，更新图片信息
  if (currentFile) {
    const img = new Image();
    img.onload = () => {
      imageInfo.textContent = t('imageInfo', {
        fileName: t('fileName'),
        name: currentFile.name,
        size: t('size'),
        width: img.width,
        height: img.height,
        fileSize: t('fileSize'),
        sizeValue: formatFileSize(currentFile.size),
      });
    };
    img.src = URL.createObjectURL(currentFile);
  }

  // 如果已有结果，更新结果列表
  if (processedImages.length > 0) {
    displayResults();
  }
}

// 显示错误
function showError(messageKey, params = {}) {
  const message =
    typeof messageKey === 'string' && messageKey.startsWith('errors.') ? t(messageKey, params) : messageKey;
  errorMsg.textContent = message;
  errorMsg.classList.add('show');
  setTimeout(() => {
    errorMsg.classList.remove('show');
  }, 5000);
}

// 隐藏错误
function hideError() {
  errorMsg.classList.remove('show');
}

// 处理文件选择
function handleFileSelect(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showError('errors.invalidFile');
    return;
  }

  currentFile = file;
  const reader = new FileReader();

  reader.onload = e => {
    previewImage.src = e.target.result;
    previewSection.classList.add('show');

    // 获取图片尺寸
    const img = new Image();
    img.onload = () => {
      imageInfo.textContent = t('imageInfo', {
        fileName: t('fileName'),
        name: file.name,
        size: t('size'),
        width: img.width,
        height: img.height,
        fileSize: t('fileSize'),
        sizeValue: formatFileSize(file.size),
      });
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
  processBtn.disabled = false;
  hideError();
}

// 上传区域点击
uploadArea.addEventListener('click', () => {
  fileInput.click();
});

// 文件输入变化
fileInput.addEventListener('change', e => {
  handleFileSelect(e.target.files[0]);
});

// 拖拽处理
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  handleFileSelect(e.dataTransfer.files[0]);
});

// 移除文件
removeFile.addEventListener('click', () => {
  currentFile = null;
  previewSection.classList.remove('show');
  resultSection.classList.remove('show');
  processBtn.disabled = true;
  processedImages = [];
  fileInput.value = '';
});

// 使用 Canvas 高质量缩放图片
function resizeImage(image, originalScale, outputScale) {
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

    // 转换为 Blob
    canvas.toBlob(
      blob => {
        resolve({
          blob: blob,
          width: newWidth,
          height: newHeight,
          scale: outputScale,
        });
      },
      'image/png',
      1.0,
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
  if (!currentFile) {
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
  processBtn.disabled = true;
  resultSection.classList.remove('show');
  processedImages = []; // 清空之前的处理结果

  try {
    // 5. 加载原始图片到内存
    const img = new Image();
    img.src = URL.createObjectURL(currentFile);

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

      // 执行图片缩放操作
      const result = await resizeImage(img, originalScale, outputScale);

      // 7. 生成符合命名规则的文件名
      // 格式：原名-倍率x.扩展名（例如：image-2x.png）
      const originalName = currentFile.name;
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

    // 10. 清理资源
    URL.revokeObjectURL(img.src); // 释放图片对象 URL
  } catch (error) {
    // 错误处理：显示错误信息并恢复 UI 状态
    showError('errors.processFailed', { error: error.message });
    progress.classList.remove('show');
    processBtn.disabled = false;
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

  // 使用 JSZip 库（内联）
  if (typeof JSZip === 'undefined') {
    // 如果没有 JSZip，逐个下载
    for (const item of processedImages) {
      downloadImage(item);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  const zip = new JSZip();
  for (const item of processedImages) {
    zip.file(item.fileName, item.blob);
  }

  zip.generateAsync({ type: 'blob' }).then(content => {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized_images_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// 绑定事件
processBtn.addEventListener('click', processImage);
downloadAllBtn.addEventListener('click', downloadAll);

// 语言切换
langZhBtn.addEventListener('click', () => setLanguage('zh'));
langEnBtn.addEventListener('click', () => setLanguage('en'));

// 回车键处理
originalScaleInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') processImage();
});
outputScalesInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') processImage();
});

// 初始化
initLanguage();
updateUI();
