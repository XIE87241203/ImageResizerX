# Agent Assistant Rules

Rules to follow for this project:

1. **When writing code,优先复用Common File的内容**
2. **Use 'class' for CSS association and 'ID' for JavaScript association.**
3. **为每个css添加注解说明是什么控件的style**
4. **需要删除功能时直接删除代码，不要注释需要删除的代码**
5. **创建新html时同时创建对应的css文件和js文件，将css和js代码放入对应文件中**
6. **所有颜色都放在color_variables.css中**
7. **所有文案都必须支持中英文多语言**
8. **修改html时一定要检查对应的js和css是否需要修改**
9. **每次修改文件都需要检查文件是否符合上述规则，不符合则按规则调整**
10. **使用refreshTranslation()方法切换语言，有文案的地方需要添加data-i18n属性用来链接i18n.js的文案

关于文件规范：
1. i18n.js: 多语言文案需要按照页面分组存放，通用的文案存放到common

**Common File Conventions:**
*   **Common Styles:** `style.css`
*   **Common JavaScript Code:** `common.js`
*   **Internationalization Code:** `i18n.js`
*   **Color Variables:** `color_variables.css`
