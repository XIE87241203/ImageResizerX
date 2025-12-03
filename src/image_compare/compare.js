// 对比工具逻辑

// DOM 元素
const uploadAreaLeft = document.getElementById('uploadAreaLeft');
const fileInputLeft = document.getElementById('fileInputLeft');
const previewSectionLeft = document.getElementById('previewSectionLeft');
const previewImageLeft = document.getElementById('previewImageLeft');
const imageInfoLeft = document.getElementById('imageInfoLeft');
const removeFileLeft = document.getElementById('removeFileLeft');

const uploadAreaRight = document.getElementById('uploadAreaRight');
const fileInputRight = document.getElementById('fileInputRight');
const previewSectionRight = document.getElementById('previewSectionRight');
const previewImageRight = document.getElementById('previewImageRight');
const imageInfoRight = document.getElementById('imageInfoRight');
const removeFileRight = document.getElementById('removeFileRight');

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

// 语言切换按钮 - Removed, handled by common.js

// 状态
let leftFile = null;
let rightFile = null;



// 处理文件选择
function handleCompareFileSelect(file, side) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        // 使用 common.js 中的 showError
        if (typeof showError === 'function') showError('errors.invalidFile');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            if (side === 'left') {
                leftFile = file;
                imgBase.src = e.target.result;
                imgLeftDisplay.src = e.target.result;
                previewImageLeft.src = e.target.result;

                // 显示预览区域，隐藏上传区域
                uploadAreaLeft.style.display = 'none';
                previewSectionLeft.style.display = 'block';

                // 显示图片信息
                const sizeKB = (file.size / 1024).toFixed(2);
                imageInfoLeft.textContent = `${file.name} - ${img.width} × ${img.height} - ${sizeKB} KB`;
            } else {
                rightFile = file;
                imgOverlay.src = e.target.result;
                imgRightDisplay.src = e.target.result;
                previewImageRight.src = e.target.result;

                // 显示预览区域，隐藏上传区域
                uploadAreaRight.style.display = 'none';
                previewSectionRight.style.display = 'block';

                // 显示图片信息
                const sizeKB = (file.size / 1024).toFixed(2);
                imageInfoRight.textContent = `${file.name} - ${img.width} × ${img.height} - ${sizeKB} KB`;
            }

            checkReady();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 检查是否两个图片都已上传
function checkReady() {
    if (leftFile && rightFile) {
        controls.style.display = 'flex';
        updateViewMode();
    }
}

// 更新视图模式
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

// 移除图片功能
function removeImage(side) {
    if (side === 'left') {
        leftFile = null;
        previewImageLeft.src = '';
        imageInfoLeft.textContent = '';
        fileInputLeft.value = '';
        uploadAreaLeft.style.display = 'block';
        previewSectionLeft.style.display = 'none';
        imgBase.src = '';
        imgLeftDisplay.src = '';
    } else {
        rightFile = null;
        previewImageRight.src = '';
        imageInfoRight.textContent = '';
        fileInputRight.value = '';
        uploadAreaRight.style.display = 'block';
        previewSectionRight.style.display = 'none';
        imgOverlay.src = '';
        imgRightDisplay.src = '';
    }

    // 隐藏控制面板
    if (!leftFile || !rightFile) {
        controls.style.display = 'none';
        compareView.style.display = 'none';
        sideBySideView.style.display = 'none';
    }
}

// 事件监听
uploadAreaLeft.addEventListener('click', () => fileInputLeft.click());
fileInputLeft.addEventListener('change', (e) => handleCompareFileSelect(e.target.files[0], 'left'));
uploadAreaLeft.addEventListener('dragover', (e) => { e.preventDefault(); uploadAreaLeft.classList.add('dragover'); });
uploadAreaLeft.addEventListener('dragleave', () => uploadAreaLeft.classList.remove('dragover'));
uploadAreaLeft.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadAreaLeft.classList.remove('dragover');
    handleCompareFileSelect(e.dataTransfer.files[0], 'left');
});

uploadAreaRight.addEventListener('click', () => fileInputRight.click());
fileInputRight.addEventListener('change', (e) => handleCompareFileSelect(e.target.files[0], 'right'));
uploadAreaRight.addEventListener('dragover', (e) => { e.preventDefault(); uploadAreaRight.classList.add('dragover'); });
uploadAreaRight.addEventListener('dragleave', () => uploadAreaRight.classList.remove('dragover'));
uploadAreaRight.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadAreaRight.classList.remove('dragover');
    handleCompareFileSelect(e.dataTransfer.files[0], 'right');
});

// 移除按钮事件
removeFileLeft.addEventListener('click', () => removeImage('left'));
removeFileRight.addEventListener('click', () => removeImage('right'));

compareMode.addEventListener('change', updateViewMode);

opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    imgOverlay.style.opacity = val;
    opacityValue.textContent = `${Math.round(val * 100)}%`;
});

// 语言切换
// 覆盖 updateUI
// 更新 UI 文本 (覆盖 app.js 的 updateUI 或补充)
function updateCompareUI() {
    // 调用 app.js 的 updateUI 更新通用部分 (如语言按钮) - Removed, common.js handles language buttons, and other common UI elements should have their own listeners or be handled in common.js
    // if (typeof updateUI === 'function') {
    //     updateUI();
    // }

    // 更新语言按钮状态 - Removed, handled by common.js

    // 更新对比工具特有的文本
    if (document.getElementById('compareTitle')) document.getElementById('compareTitle').textContent = `🖼️ ${t('compareTitle')}`;
    if (document.getElementById('compareSubtitle')) document.getElementById('compareSubtitle').textContent = t('compareSubtitle');

    // 更新上传提示文本
    const uploadTexts = document.querySelectorAll('.upload-text');
    if (uploadTexts.length >= 2) {
        if (!leftFile) uploadTexts[0].textContent = t('uploadText');
        if (!rightFile) uploadTexts[1].textContent = t('uploadText');
    }

    // 更新移除按钮文本
    const removeButtons = document.querySelectorAll('.remove-file');
    removeButtons.forEach(btn => {
        btn.textContent = t('removeFile');
    });

    // 更新上传提示
    const uploadHints = document.querySelectorAll('.upload-hint');
    uploadHints.forEach(hint => {
        hint.textContent = t('uploadHint');
    });

    if (document.getElementById('compareModeLabel')) document.getElementById('compareModeLabel').textContent = `${t('compareMode')}:`;
    if (document.getElementById('opacityLabel')) document.getElementById('opacityLabel').textContent = `${t('opacity')}:`;

    const options = compareMode.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === 'overlay') options[i].text = t('modeOverlay');
        if (options[i].value === 'side') options[i].text = t('modeSideBySide');
    }

    if (document.getElementById('leftLabel')) document.getElementById('leftLabel').textContent = t('leftImage');
    if (document.getElementById('rightLabel')) document.getElementById('rightImage').textContent = t('rightImage');
}

// 页面初始化函数
async function initComparePage() {
    // 首先加载通用头部
    // 对于子目录页面，headerPath 应该是 '../common_header.html'
    await loadCommonHeader('commonHeaderPlaceholder', '../common/common_header.html');

    // 初始化语言设置
    initLanguage();
    // 更新 UI 文本，依赖于语言设置和头部元素
    updateCompareUI();

}

// 绑定语言改变事件，确保在头部加载后绑定
window.addEventListener('languageChanged', updateCompareUI);

// 页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initComparePage);

