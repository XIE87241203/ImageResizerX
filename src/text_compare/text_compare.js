document.addEventListener('DOMContentLoaded', () => {
    // 加载通用头部
    if (typeof loadCommonHeader === 'function') {
        loadCommonHeader('commonHeaderPlaceholder');
    }

    // 初始化国际化文本
    if (typeof initLanguage === 'function') {
        initLanguage();
    }

    const text1Input = document.getElementById('text1');
    const text2Input = document.getElementById('text2');
    const diffOutputLeft = document.getElementById('diffOutputLeft'); // 获取左侧输出区域
    const diffOutputRight = document.getElementById('diffOutputRight'); // 获取右侧输出区域

    /**
     * 对比两段文字并显示差异（字符级别）
     */
    function compareTexts() {
        const text1 = text1Input.value;
        const text2 = text2Input.value;

        const { leftHtml, rightHtml } = generateCharacterDiff(text1, text2);
        diffOutputLeft.innerHTML = leftHtml;
        diffOutputRight.innerHTML = rightHtml;
    }

    /**
     * 去抖函数，限制函数执行频率
     * @param {function} func 要去抖的函数
     * @param {number} delay 延迟时间（毫秒）
     * @returns {function} 去抖后的函数
     */
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    /**
     * 生成字符级别的左右差异HTML
     * @param {string} text1 文本一
     * @param {string} text2 文本二
     * @returns {{leftHtml: string, rightHtml: string}} 包含差异标记的HTML字符串对象
     */
    function generateCharacterDiff(text1, text2) {
        let leftHtml = '';
        let rightHtml = '';
        const len1 = text1.length;
        const len2 = text2.length;
        const maxLength = Math.max(len1, len2);

        for (let i = 0; i < maxLength; i++) {
            const char1 = i < len1 ? text1[i] : '';
            const char2 = i < len2 ? text2[i] : '';

            if (char1 === char2) {
                // 如果字符相同，正常显示
                const escapedChar = escapeHtml(char1);
                leftHtml += escapedChar;
                rightHtml += escapedChar;
            } else {
                // 如果字符不同
                if (char1 !== '' && char2 !== '') {
                    // 双方都有字符，但字符不一致，标记为不同 (diff-mismatch)
                    leftHtml += `<span class="diff-mismatch">${escapeHtml(char1)}</span>`;
                    rightHtml += `<span class="diff-mismatch">${escapeHtml(char2)}</span>`;
                } else if (char1 !== '') {
                    // 只有左边有字符，右边没有
                    leftHtml += `<span class="diff-removed">${escapeHtml(char1)}</span>`;
                    // 右边为空
                    rightHtml += '';
                } else {
                    // 只有右边有字符，左边没有
                    // 左边为空
                    leftHtml += '';
                    rightHtml += `<span class="diff-added">${escapeHtml(char2)}</span>`;
                }
            }
        }
        return { leftHtml, rightHtml };
    }

    /**
     * 转义HTML特殊字符，防止XSS攻击
     * @param {string} text 要转义的文本
     * @returns {string} 转义后的文本
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // 绑定实时对比事件 (使用去抖动，延迟300毫秒)
    const debouncedCompareTexts = debounce(compareTexts, 300);
    text1Input.addEventListener('input', debouncedCompareTexts);
    text2Input.addEventListener('input', debouncedCompareTexts);

    // 初始加载时执行一次对比
    compareTexts();
});

// 监听语言切换事件，重新加载页面文本
window.addEventListener('languageChanged', () => {
    // 刷新页面上的所有需要翻译的文本
    if (typeof initLanguage === 'function') {
        initLanguage();
    }

    // 统一检查 t 函数是否存在，避免重复检查
    if (typeof t === 'function') {
        // 更新标题和副标题等
        const textCompareTitle = document.getElementById('textCompareTitle');
        const textCompareSubtitle = document.getElementById('textCompareSubtitle');
        const text1Label = document.getElementById('text1Label');
        const text2Label = document.getElementById('text2Label');
        const resultTitle = document.getElementById('resultTitle');

        if (textCompareTitle) textCompareTitle.textContent = t('textCompareTool.title');
        if (textCompareSubtitle) textCompareSubtitle.textContent = t('textCompareTool.subtitle');
        if (text1Label) text1Label.textContent = t('textCompareTool.text1Label');
        if (text2Label) text2Label.textContent = t('textCompareTool.text2Label');
        if (resultTitle) resultTitle.textContent = t('textCompareTool.resultTitle');

        // 更新输入框的placeholder
        const text1Input = document.getElementById('text1'); // 重新获取输入框元素
        const text2Input = document.getElementById('text2'); // 重新获取输入框元素
        if (text1Input) text1Input.placeholder = t('textCompareTool.text1Placeholder');
        if (text2Input) text2Input.placeholder = t('textCompareTool.text2Placeholder');
    }
});
