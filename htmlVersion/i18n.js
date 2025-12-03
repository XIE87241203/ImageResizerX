// 多语言支持
const i18n = {
  zh: {
    title: '图片倍率缩放工具',
    subtitle: '支持多倍率批量处理，高质量缩放算法',
    uploadText: '点击或拖拽图片到此处',
    uploadHint: '支持 PNG、JPG、JPEG、WebP、BMP、GIF',
    previewAlt: '预览',
    removeFile: '移除图片',
    originalScale: '原始倍率',
    originalScalePlaceholder: '例如: 1 或 2',
    originalScaleHint: '输入图片的原始倍率（例如：1x、2x）',
    outputScales: '输出倍率（多个用逗号分隔）',
    outputScalesPlaceholder: '例如: 1.5,2,3 或 1.25，2，3',
    outputScalesHint: '支持多个倍率，用英文或中文逗号分隔',
    processBtn: '开始处理',
    processing: '处理中...',
    processingScale: '正在处理 {scale}x ({current}/{total})...',
    resultTitle: '处理结果',
    download: '下载',
    downloadAll: '下载全部（ZIP）',
    fileName: '文件名',
    size: '尺寸',
    fileSize: '大小',
    errors: {
      noFile: '请先选择图片',
      invalidFile: '请选择图片文件',
      invalidOriginalScale: '原始倍率必须是大于 0 的数字',
      noOutputScales: '请至少输入一个输出倍率',
      invalidOutputScales: '没有有效的输出倍率',
      processFailed: '处理失败: {error}',
    },
    imageInfo: '{fileName}: {name} | {size}: {width} × {height} | {fileSize}: {sizeValue}',
  },
  en: {
    title: 'Image Scale Resizer',
    subtitle: 'Batch processing with multiple scales, high-quality resizing algorithm',
    uploadText: 'Click or drag image here',
    uploadHint: 'Supports PNG, JPG, JPEG, WebP, BMP, GIF',
    previewAlt: 'Preview',
    removeFile: 'Remove Image',
    originalScale: 'Original Scale',
    originalScalePlaceholder: 'e.g.: 1 or 2',
    originalScaleHint: 'Enter the original scale of the image (e.g.: 1x, 2x)',
    outputScales: 'Output Scales (comma-separated)',
    outputScalesPlaceholder: 'e.g.: 1.5,2,3 or 1.25,2,3',
    outputScalesHint: 'Multiple scales supported, separated by comma (English or Chinese)',
    processBtn: 'Start Processing',
    processing: 'Processing...',
    processingScale: 'Processing {scale}x ({current}/{total})...',
    resultTitle: 'Results',
    download: 'Download',
    downloadAll: 'Download All (ZIP)',
    fileName: 'File Name',
    size: 'Size',
    fileSize: 'File Size',
    errors: {
      noFile: 'Please select an image first',
      invalidFile: 'Please select an image file',
      invalidOriginalScale: 'Original scale must be a number greater than 0',
      noOutputScales: 'Please enter at least one output scale',
      invalidOutputScales: 'No valid output scales',
      processFailed: 'Processing failed: {error}',
    },
    imageInfo: '{fileName}: {name} | {size}: {width} × {height} | {fileSize}: {sizeValue}',
  },
};

// 当前语言
let currentLang = 'zh';

// 获取翻译文本
function t(key, params = {}) {
  const keys = key.split('.');
  let value = i18n[currentLang];

  for (const k of keys) {
    value = value?.[k];
  }

  if (value === undefined) {
    // 如果当前语言没有，尝试使用中文
    value = i18n.zh;
    for (const k of keys) {
      value = value?.[k];
    }
  }

  // 替换参数
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  return value || key;
}

// 设置语言
function setLanguage(lang) {
  if (i18n[lang]) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateUI();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }
}

// 初始化语言（从 localStorage 或浏览器语言）
function initLanguage() {
  const saved = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language || navigator.userLanguage;

  if (saved && i18n[saved]) {
    currentLang = saved;
  } else if (browserLang.startsWith('zh')) {
    currentLang = 'zh';
  } else {
    currentLang = 'en';
  }

  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}
