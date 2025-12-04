// 导入 ImageUploader 模块
import { ImageUploader } from '../common/imageUploadModule.js';

const controls = document.getElementById('controls');
const compareMode = document.getElementById('compareMode');
const opacityControl = document.getElementById('opacityControl');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

const compareView = document.getElementById('compareView');
const imgBase = document.getElementById('imgBase');
const imgOverlay = document.getElementById('imgOverlay');

const sideBySideView = document.getElementById('sideBySideView');
const imgLeftDisplay = document.getElementById('imgLeftDisplay');
const imgRightDisplay = document.getElementById('imgRightDisplay');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');

let leftFile = null;
let rightFile = null;

let leftImageUploader;
let rightImageUploader;

/**
 * 处理文件上传或移除的回调函数
 * @param {string} side - 'left' 或 'right'
 * @param {File|null} file - 上传的文件对象，如果移除则为 null
 * @param {string} imageUrl - 图片的 Data URL，如果移除则为空字符串
 */
function handleFileUploadChange(side, file, imageUrl) {
    if (side === 'left') {
        leftFile = file;
        imgBase.src = imageUrl;
        imgLeftDisplay.src = imageUrl;
    } else {
        rightFile = file;
        imgOverlay.src = imageUrl;
        imgRightDisplay.src = imageUrl;
    }
    checkReady();
}

/**
 * 检查是否两个图片都已上传
 */
function checkReady() {
    if (leftImageUploader.getFile() && rightImageUploader.getFile()) {
        controls.style.display = 'flex';
        updateViewMode();
    } else {
        controls.style.display = 'none';
        compareView.style.display = 'none';
        sideBySideView.style.display = 'none';
    }
}

/**
 * 更新视图模式 (叠加或并排)
 */
function updateViewMode() {
    const mode = compareMode.value;
    if (mode === 'overlay') {
        compareView.style.display = 'block';
        sideBySideView.style.display = 'none';
        opacityControl.style.display = 'flex';
    } else {
        compareView.style.display = 'none';
        sideBySideView.style.display = 'flex';
        opacityControl.style.display = 'none';
    }
}

compareMode.addEventListener('change', updateViewMode);

opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    imgOverlay.style.opacity = val;
    opacityValue.textContent = `${Math.round(val * 100)}%`;
});

/**
 * 更新 UI 文本，支持国际化
 */
function updateCompareUI() {
    if (document.getElementById('compareTitle')) document.getElementById('compareTitle').textContent = `🖼️ ${t('compareTitle')}`;
    if (document.getElementById('compareSubtitle')) document.getElementById('compareSubtitle').textContent = t('compareSubtitle');

    if (document.getElementById('compareModeLabel')) document.getElementById('compareModeLabel').textContent = `${t('compareMode')}:`;
    if (document.getElementById('opacityLabel')) document.getElementById('opacityLabel').textContent = `${t('opacity')}:`;

    const options = compareMode.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === 'overlay') options[i].text = t('modeOverlay');
        if (options[i].value === 'side') options[i].text = t('modeSideBySide');
    }

    if (leftLabel) leftLabel.textContent = t('leftImage');
    if (rightLabel) rightLabel.textContent = t('rightImage');
}

/**
 * 页面初始化函数
 */
async function initComparePage() {
    await loadCommonHeader('commonHeaderPlaceholder');

    initLanguage();
    updateCompareUI();

    leftImageUploader = new ImageUploader('leftImageUploaderContainer', 'left', handleFileUploadChange);
    rightImageUploader = new ImageUploader('rightImageUploaderContainer', 'right', handleFileUploadChange);
}

window.addEventListener('languageChanged', updateCompareUI);

document.addEventListener('DOMContentLoaded', initComparePage);