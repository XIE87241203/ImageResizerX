// json_format.js

// 获取DOM元素
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput'); // 现在是一个 <pre> 标签
const copyOutputButton = document.getElementById('copyOutputButton');
const clearOutputButton = document.getElementById('clearOutputButton');

/**
 * 对JSON字符串进行语法高亮处理。
 * @param {string} jsonString 要进行高亮的JSON字符串。
 * @returns {string} 带有HTML标签的高亮JSON字符串。
 */
function syntaxHighlightJson(jsonString) {
  jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return jsonString.replace(
    // 捕获组：
    // 1: 完整的键（包含引号和冒号），例如 "name":
    // 2: 键的名称（不包含引号），例如 name
    // 3: 完整的字符串值（包含引号），例如 "value"
    // 4: 字符串值的内容（不包含引号），例如 value
    // 5: 完整的布尔值或null，例如 true, false, null
    // 6: 布尔值或null的实际值（同5）
    // 7: 完整的数字，例如 123, 1.23
    /("(\w+)"\s*:)|("([^"].*?)")|(\b(true|false|null)\b)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match, keyWithColon, keyName, stringValueQuoted, stringValueContent, booleanNullMatch, booleanNullValue, numberMatch) {
      let cls = 'json-value'; // 默认值为通用值样式
      let contentToDisplay = match; // 默认显示匹配的整个内容

      if (keyWithColon) { // 如果匹配到键（包含冒号）
        cls = 'json-key';
        contentToDisplay = `"${keyName}"`; // 显示带引号的键名
        // 返回键的span，然后手动添加冒号和可能的空格
        return `<span class="${cls}">${contentToDisplay}</span>:`;
      } else if (stringValueQuoted) { // 如果匹配到字符串值（包含引号）
        cls += ' json-string';
        contentToDisplay = stringValueQuoted; // 显示带引号的字符串
      } else if (booleanNullMatch) { // 如果匹配到布尔值或null
        if (booleanNullValue === 'true' || booleanNullValue === 'false') {
          cls += ' json-boolean';
        } else { // 'null'
          cls += ' json-null';
        }
        contentToDisplay = booleanNullValue; // 显示布尔值或null的实际值
      } else if (numberMatch) { // 如果匹配到数字
        cls += ' json-number';
        contentToDisplay = numberMatch; // 显示数字的实际值
      }
      return `<span class="${cls}">${contentToDisplay}</span>`;
    }
  );
}

/**
 * 实时格式化JSON输入并显示在输出区域。
 */
function formatJson() {
  const inputText = jsonInput.value.trim();

  // 如果输入为空，则清空输出并返回
  if (inputText === '') {
    jsonOutput.innerHTML = ''; // 修改为 innerHTML
    return;
  }

  try {
    const parsedJson = JSON.parse(inputText);
    // 格式化JSON字符串，使用2个空格进行缩进
    const formattedJsonString = JSON.stringify(parsedJson, null, 2);
    // 对格式化后的JSON字符串进行语法高亮，并设置为innerHTML
    jsonOutput.innerHTML = syntaxHighlightJson(formattedJsonString);
  } catch (error) {
    // 如果解析失败，显示错误信息
    jsonOutput.innerHTML = `<span class="json-error">${translation('jsonFormat.errorPrefix')}<br>${error.message}</span>`; // 修改为 innerHTML，并添加错误样式
  }
}

// 输入框实时输入事件监听器
jsonInput.addEventListener('input', formatJson);

// 复制按钮点击事件监听器
copyOutputButton.addEventListener('click', () => {
  // 复制的是原始的纯文本JSON，而不是带有HTML标签的高亮文本
  if (jsonInput.value) { // 应该复制输入框的纯文本，而不是高亮后的HTML
    try {
        const parsedJson = JSON.parse(jsonInput.value);
        navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2)).then(() => {
            showToast(translation('common.copiedToClipboard'), 'success'); // 使用 toast 提示成功
        }).catch(err => {
            console.error('复制失败:', err);
            showToast(`${translation('common.copyFailed')}: ${translation('jsonFormat.errorPrefix')}`, 'error'); // 使用 toast 提示失败
        });
    } catch (error) {
        showToast(`${translation('common.copyFailed')}: ${translation('jsonFormat.errorPrefix')}`, 'error'); // 使用 toast 提示失败
        console.error('复制失败：JSON格式错误', error);
    }
  }
});

// 清空按钮点击事件监听器
clearOutputButton.addEventListener('click', () => {
  // 清空输入框内容
  jsonInput.value = '';
  jsonOutput.innerHTML = ''; // 清空输出区域，保持一致性，修改为 innerHTML
});

// 页面加载时执行一次格式化，以防有初始值
document.addEventListener('DOMContentLoaded', () => {
  formatJson();
  refreshTranslation(); // 页面加载时刷新一次语言，确保新按钮的文本也被翻译
});

// 监听语言切换事件，重新渲染页面文本
window.addEventListener('languageChanged', refreshTranslation);

// 首先加载通用头部
loadCommonHeader('commonHeaderPlaceholder');