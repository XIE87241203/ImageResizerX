// 通用工具函数

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
 * @param {string} messageKey 错误信息或翻译键值
 * @param {object} params 翻译参数
 */
function showError(messageKey, params = {}) {
    const errorMsg = document.getElementById('errorMsg');
    if (!errorMsg) {
        console.error('Error element #errorMsg not found:', messageKey);
        alert(typeof t === 'function' ? t(messageKey, params) : messageKey);
        return;
    }

    const message = typeof t === 'function' && typeof messageKey === 'string' && messageKey.startsWith('errors.')
        ? t(messageKey, params)
        : messageKey;

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
 * 更新返回首页按钮的文本
 */
function updateBackToHomeLinkText() {
    const backToHomeLink = document.getElementById('backToHomeLink');
    if (backToHomeLink && typeof t === 'function') {
        backToHomeLink.textContent = t('backToHome');
    }
}

// 在语言改变时更新按钮状态和返回首页链接文本
window.addEventListener('languageChanged', () => {
    updateLanguageButtonStates();
    updateBackToHomeLinkText();
});

/**
 * 异步加载并插入通用头部
 * @param {string} placeholderId 头部要插入的DOM元素的ID
 * @param {string} headerPath 通用头部HTML文件的路径
 * @returns {Promise<void>} Promise对象，在头部加载并处理完成后解决
 */
async function loadCommonHeader(placeholderId, headerPath = '../common/common_header.html') {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID "${placeholderId}" not found.`);
        return;
    }

    try {
        const response = await fetch(headerPath);
        if (!response.ok) {
            throw new Error(`Failed to load common header: ${response.statusText}`);
        }
        const headerHtml = await response.text();
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
                // 如果当前页面在子目录，如 image_resize/resize.html，那么 ../index.html 是正确的路径
                backToHomeLink.href = '../index.html'; 
            }
            updateBackToHomeLinkText(); // 在设置完显示状态后更新文本
        }

        // 绑定语言切换按钮事件（确保在头部加载后绑定）
        bindLanguageSwitchers();

        // 初始加载时更新返回首页链接文本
        updateBackToHomeLinkText();

    } catch (error) {
        console.error('Error loading common header:', error);
    }
}
