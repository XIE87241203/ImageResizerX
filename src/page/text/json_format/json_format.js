// json_format.js

// 获取DOM元素
const jsonInput = document.getElementById('jsonInput');
const formatBtn = document.getElementById('formatBtn');
const jsonOutput = document.getElementById('jsonOutput');

// 格式化按钮点击事件监听器
formatBtn.addEventListener('click', () => {
  const inputText = jsonInput.value.trim();

  // 如果输入为空，则清空输出并返回
  if (inputText === '') {
    jsonOutput.value = '';
    return;
  }

  try {
    // 尝试解析JSON
    const parsedJson = JSON.parse(inputText);
    // 格式化JSON并显示在输出区域，使用2个空格进行缩进
    jsonOutput.value = JSON.stringify(parsedJson, null, 2);
  } catch (error) {
    // 如果解析失败，显示错误信息
    jsonOutput.value = `${translation('jsonFormatTool.errorPrefix')}\n${error.message}`;
  }
});

