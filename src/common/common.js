// 通用工具函数

// 页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initLanguage);
// 在语言改变时更新按钮状态和返回首页链接文本
window.addEventListener('languageChanged', () => {
    updateLanguageButtonStates();
    refreshTranslation()
});



/**
 * 格式化文件大小
 * @param {number} bytes 文件大小（字节）
 * @returns {string} 格式化后的字符串
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const index = Math.min(i, sizes.length - 1);
    return Math.round((bytes / Math.pow(k, index)) * 100) / 100 + ' ' + sizes[index];
}

function refreshTranslation(){
    // 获取所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            element.textContent = translation(key);
        }
    });
}

/**
 * 根据文件名或 MIME 类型获取正确的 MIME 类型
 * @param {string} fileName 文件名
 * @param {string} mimeType 原始 MIME 类型
 * @returns {string} 规范化的 MIME 类型
 */
function getMimeType(fileName, mimeType) {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const extToMime = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
        '.gif': 'image/gif',
    };

    if (extToMime[ext]) {
        return extToMime[ext];
    }

    if (mimeType && mimeType.startsWith('image/')) {
        const supportedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'];
        if (supportedMimes.includes(mimeType)) {
            return mimeType;
        }
    }

    return 'image/png';
}

/**
 * 显示错误信息
 * @param {string} message 错误信息
 * @param {object} params 翻译参数
 */
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    if (!errorMsg) {
        console.error('Error element #errorMsg not found:', message);
        alert(message);
        return;
    }
    errorMsg.textContent = message;
    errorMsg.classList.add('show');

    // 清除之前的定时器（如果有）
    if (errorMsg.hideTimer) {
        clearTimeout(errorMsg.hideTimer);
    }

    errorMsg.hideTimer = setTimeout(() => {
        errorMsg.classList.remove('show');
        errorMsg.hideTimer = null;
    }, 5000);
}

/**
 * 隐藏错误信息
 */
function hideError() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.classList.remove('show');
    }
}

/**
 * 更新语言切换按钮的选中状态
 */
function updateLanguageButtonStates() {
    const langZhBtn = document.getElementById('langZh');
    const langEnBtn = document.getElementById('langEn');
    // 确保 currentLang 可用，它来自 i18n.js
    if (typeof currentLang !== 'undefined') {
        if (langZhBtn) langZhBtn.classList.toggle('active', currentLang === 'zh');
        if (langEnBtn) langEnBtn.classList.toggle('active', currentLang === 'en');
    }
}

/**
 * 绑定语言切换按钮
 */
function bindLanguageSwitchers() {
    const langZhBtn = document.getElementById('langZh');
    const langEnBtn = document.getElementById('langEn');

    if (langZhBtn) {
        langZhBtn.addEventListener('click', () => {
            if (typeof setLanguage === 'function') setLanguage('zh');
        });
    }

    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            if (typeof setLanguage === 'function') setLanguage('en');
        });
    }

    // 初始设置按钮状态
    updateLanguageButtonStates();
}

/**
 * 生成通用头部HTML字符串
 * @returns {string} 通用头部HTML字符串
 */
function generateCommonHeaderHtml() {
    return `
<header class="common-header">
    <a href="../../../index.html" class="nav-link back-to-home-btn" id="backToHomeLink" data-i18n="common.backToHome"><span></span></a>
    <div class="header-center">
        <div class="language-switcher">
            <button class="lang-btn" id="langZh" data-lang="zh" data-i18n="common.langZh"></button>
            <button class="lang-btn" id="langEn" data-lang="en" data-i18n="common.langEn"></button>
        </div>
    </div>
</header>
    `;
}

/**
 * 插入通用头部
 * @param {string} placeholderId 头部要插入的DOM元素的ID
 * @returns {void}
 */
function loadCommonHeader(placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID "${placeholderId}" not found.`);
        return;
    }

    const headerHtml = generateCommonHeaderHtml(); // 使用JS生成HTML
    placeholder.innerHTML = headerHtml;

    // 获取当前页面的文件名
    const currentPage = window.location.pathname.split('/').pop();
    const backToHomeLink = document.getElementById('backToHomeLink');

    if (backToHomeLink) {
        if (currentPage === 'index.html' || currentPage === '') {
            // 如果是首页，隐藏返回首页按钮
            backToHomeLink.style.display = 'none';
            // 并且确保 href 指向当前目录的 index.html
            backToHomeLink.href = 'index.html';
        } else {
            // 对于其他页面，显示返回首页按钮，并确保 href 指向父目录的 index.html
            backToHomeLink.style.display = 'flex'; // 或者 'block', 'inline-flex' 等，取决于你的 CSS 样式
            // 如果当前页面在子目录，如 image_resize/resize.html，那么 ../../../index.html 是正确的路径
            backToHomeLink.href = '../../../index.html';
        }
    }

    // 绑定语言切换按钮事件（确保在头部加载后绑定）
    bindLanguageSwitchers();
}
