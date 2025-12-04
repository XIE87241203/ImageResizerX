// 导入 ImageUploader 模块
import { ImageUploader } from '../../../common/view/imageUploadModule.js';

const controls = document.getElementById('controls');
const opacityControl = document.getElementById('opacityControl');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');
// 获取快速对比按钮
const toggleOpacityButton = document.getElementById('toggleOpacityButton');

const compareView = document.getElementById('compareView');
const imgBase = document.getElementById('imgBase');
const imgOverlay = document.getElementById('imgOverlay');

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
    } else {
        rightFile = file;
        imgOverlay.src = imageUrl;
    }
    checkReady();
}

/**
 * 检查是否两个图片都已上传
 */
function checkReady() {
    if (leftImageUploader.getFile() && rightImageUploader.getFile()) {
        controls.style.display = 'flex';
        compareView.style.display = 'block';
        opacityControl.style.display = 'flex';
    } else {
        controls.style.display = 'none';
        compareView.style.display = 'none';
        opacityControl.style.display = 'none';
    }
}

opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    imgOverlay.style.opacity = val;
    opacityValue.textContent = `${Math.round(val * 100)}%`;
});

// 快速对比按钮按住显示图二，松开显示图一
toggleOpacityButton.addEventListener('mousedown', () => {
    imgOverlay.style.opacity = 1;
    opacitySlider.value = 1;
    opacityValue.textContent = '100%';
});

toggleOpacityButton.addEventListener('mouseup', () => {
    imgOverlay.style.opacity = 0;
    opacitySlider.value = 0;
    opacityValue.textContent = '0%';
});

/**
 * 页面初始化函数
 */
async function initComparePage() {
    leftImageUploader = new ImageUploader('leftImageUploaderContainer', 'left', handleFileUploadChange);
    rightImageUploader = new ImageUploader('rightImageUploaderContainer', 'right', handleFileUploadChange);
}


// 页面初始化函数
function initResizePage() {
    // 首先加载通用头部
    loadCommonHeader('commonHeaderPlaceholder');

    document.addEventListener('DOMContentLoaded', initComparePage);
}

initResizePage()