// 语言切换按钮 - Removed, handled by common.js

function updateUI() {
    if (document.getElementById('indexTitle')) document.getElementById('indexTitle').textContent = t('indexTitle');
    if (document.getElementById('indexSubtitle')) document.getElementById('indexSubtitle').textContent = t('indexSubtitle');
    if (document.getElementById('resizeToolLink')) document.getElementById('resizeToolLink').textContent = t('resizeToolLink');
    if (document.getElementById('compareToolLink')) document.getElementById('compareToolLink').textContent = t('compareToolLink');

    // 更新文档标题
    document.title = `${t('indexPageTitle')} - Web Version`;
}

// 绑定通用事件
bindLanguageSwitchers();
window.addEventListener('languageChanged', updateUI);

// 页面初始化函数
async function initComparePage() {
    // 首先加载通用头部
    await loadCommonHeader('commonHeaderPlaceholder');

    // 初始化语言设置
    initLanguage();
    // 更新 UI 文本，依赖于语言设置和头部元素
    updateUI();

}
// 页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initComparePage);
