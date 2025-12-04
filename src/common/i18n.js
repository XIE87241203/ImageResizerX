// 多语言支持
const i18n = {
  zh: {
    common: {
      indexSubtitle: '多种实用小工具，助您轻松解决日常问题',
      imageToolsTitle: '🖼️ 图片工具',
      textToolsTitle: '📝 文本工具',
      resizeToolLink: '图片倍率缩放工具',
      compareToolLink: '图片对比工具',
      textCompareToolLink: '文本对比工具',
      jsonFormatToolLink: 'JSON格式化工具',
      indexPageTitle: '️🛠️ 常用小工具合集',
      backToHome: '← 返回首页',
      langZh: '中文',
      langEn: 'English',
      image: {
        fileName: '文件名',
        size: '尺寸',
        fileSize: '大小',
        imageInfo: '{fileName}: {name} | {size}: {width} × {height} | {fileSize}: {sizeValue}',
        errors: {
          invalidFile: '请选择图片文件',
        },
        uploadText: '点击或拖拽图片到此处',
        uploadHint: '支持 PNG、JPG、JPEG、WebP、BMP、GIF',
        previewAlt: '预览',
        removeFile: '移除图片',
      },
    },
    imageResize: {
      title: '🖼️ 图片倍率缩放工具',
      subtitle: '支持多倍率批量处理，高质量缩放算法',
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
      errors: {
        invalidOriginalScale: '原始倍率必须是大于 0 的数字',
        noOutputScales: '请至少输入一个输出倍率',
        invalidOutputScales: '没有有效的输出倍率',
        processFailed: '处理失败: {error}',
        noFile: '请先选择图片',
      },
    },
    imageCompare: {
      title: '🖼️ 图片对比工具',
      subtitle: '左右对比或叠加对比，快速发现差异',
      leftImage: '左侧图片 (基准)',
      rightImage: '右侧图片 (对比)',
      opacity: '叠加透明度',
      quickCompare: '快速对比',
      compareMode: '对比模式',
      modeSideBySide: '左右并排',
      modeOverlay: '叠加对比',
      modeSlider: '滑动对比',
    },
    textCompare: {
      title: '📝 文本对比工具',
      subtitle: '轻松对比两段文字的差异',
      text1Label: '文本一:',
      text2Label: '文本二:',
      compareButton: '对比',
      resultTitle: '对比结果:',
      text1Placeholder: '在此输入第一段文字...',
      text2Placeholder: '在此输入第二段文字...',
    },
    jsonFormat: {
      title: '📝 JSON格式化工具',
      subtitle: '粘贴JSON文本，点击格式化按钮进行美化或校验。',
      jsonInputLabel: '输入JSON文本',
      jsonInputPlaceholder: '在此处粘贴您的JSON文本',
      formatBtn: '格式化',
      jsonOutputLabel: '输出结果',
      jsonOutputPlaceholder: '格式化后的JSON或错误信息将显示在此处',
      errorPrefix: 'JSON格式错误：',
    },
  },
  en: {
    common: {
      indexSubtitle: 'A collection of practical tools to easily solve your daily problems',
      imageToolsTitle: '🖼️Image Tools',
      textToolsTitle: '📝 Text Tools',
      resizeToolLink: 'Image Scale Resize Tool',
      compareToolLink: 'Image Compare Tool',
      textCompareToolLink: 'Text Compare Tool',
      jsonFormatToolLink: 'JSON Format Tool',
      indexPageTitle: '🛠️ Common Utility Tools',
      backToHome: '← Back to Home',
      langZh: '中文',
      langEn: 'English',
      image: {
        fileName: 'File Name',
        size: 'Size',
        fileSize: 'File Size',
        imageInfo: '{fileName}: {name} | {size}: {width} × {height} | {fileSize}: {sizeValue}',
        errors: {
          invalidFile: 'Please select an image file',
        },
        uploadText: 'Click or drag image here',
        uploadHint: 'Supports PNG, JPG, JPEG, WebP, BMP, GIF',
        previewAlt: 'Preview',
        removeFile: 'Remove Image',
      },
    },
    imageResize: {
      title: '🖼️ Image Scale Resizer',
      subtitle: 'Batch processing with multiple scales, high-quality resizing algorithm',
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
      errors: {
        invalidOriginalScale: 'Original scale must be a number greater than 0',
        noOutputScales: 'Please enter at least one output scale',
        invalidOutputScales: 'No valid output scales',
        processFailed: 'Processing failed: {error}',
        noFile: 'Please select an image first',
      },
    },
    imageCompare: {
      title: '🖼️ Image Comparison Tool',
      subtitle: 'Side-by-side or overlay comparison to spot differences',
      leftImage: 'Left Image (Base)',
      rightImage: 'Right Image (Compare)',
      opacity: 'Overlay Opacity',
      quickCompare: 'Quick Compare',
      compareMode: 'Compare Mode',
      modeSideBySide: 'Side by Side',
      modeOverlay: 'Overlay',
      modeSlider: 'Slider',
    },
    textCompare: {
      title: '📝 Text Compare Tool',
      subtitle: 'Easily compare differences between two texts',
      text1Label: 'Text One:',
      text2Label: 'Text Two:',
      compareButton: 'Compare',
      resultTitle: 'Comparison Result:',
      text1Placeholder: 'Enter the first text here...',
      text2Placeholder: 'Enter the second text here...',
    },
    jsonFormat: {
      title: '📝 JSON Format Tool',
      subtitle: 'Paste JSON text, click format button to beautify or validate.',
      jsonInputLabel: 'Input JSON Text',
      jsonInputPlaceholder: 'Paste your JSON text here',
      formatBtn: 'Format',
      jsonOutputLabel: 'Output Result',
      jsonOutputPlaceholder: 'Formatted JSON or error message will be displayed here',
      errorPrefix: 'JSON Format Error:',
    },
  },
};

// 当前语言
let currentLang = 'zh';

// 获取翻译文本
function translation(key, params = {}) {
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

    // 触发语言改变事件
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }
}

// 初始化语言（从 localStorage 或浏览器语言）
function initLanguage() {
  const saved = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language || navigator.userLanguage;

  let initialLang = 'zh'; // Default to Chinese

  if (saved && i18n[saved]) {
    initialLang = saved;
  } else if (browserLang.startsWith('zh')) {
    initialLang = 'zh';
  }
  else {
    initialLang = 'en';
  }

  // Set currentLang and update document element language
  currentLang = initialLang;
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

  // Dispatch languageChanged event after initialization to update UI elements
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}
