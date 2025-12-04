// imageUploadModule.js
/**
 * 图片上传和预览模块
 * 负责管理单个图片上传区域的所有DOM元素和相关逻辑。
 */
export class ImageUploader {
    /**
     * 构造函数
     * @param {string} containerId - 模块将被渲染到的DOM元素的ID
     * @param {string} id - 'left' 或 'right'，用于区分左右图片
     * @param {function} onFileChangeCallback - 文件选择或移除时调用的回调函数
     */
    constructor(containerId, id, onFileChangeCallback) {
        this.container = document.getElementById(containerId);
        this.id = id; // 'left' 或 'right'
        this.onFileChangeCallback = onFileChangeCallback;
        this.currentFile = null; // 当前上传的文件

        this.render(); // 渲染HTML结构
        this.initEventListeners(); // 初始化事件监听器
    }

    /**
     * 渲染模块的HTML结构到指定的容器中
     */
    render() {
        this.container.innerHTML = `
            <div>
                <div class="upload-area" id="uploadArea${this.id}">
                    <div class="upload-icon">📁</div>
                    <div class="upload-text" id="${this.id}ImageText" data-i18n="common.image.uploadText"></div>
                    <div class="upload-hint" data-i18n="common.image.uploadHint"></div>
                    <input type="file" class= "fileInput" id="fileInput${this.id}" accept="image/*" />
                </div>

                <div class="preview-section" id="previewSection${this.id}" style="display: none;">
                    <img id="previewImage${this.id}" class="preview-image" data-i18n-alt="common.image.previewAlt" alt="" />
                    <div class="image-info" id="imageInfo${this.id}"></div>
                    <div class="remove-file" id="removeFile${this.id}" data-i18n="common.image.removeFile"></div>
                </div>
            </div>
        `;

        // 获取新创建的DOM元素的引用
        this.uploadArea = this.container.querySelector(`#uploadArea${this.id}`);
        this.fileInput = this.container.querySelector(`#fileInput${this.id}`);
        this.previewSection = this.container.querySelector(`#previewSection${this.id}`);
        this.previewImage = this.container.querySelector(`#previewImage${this.id}`);
        this.imageInfo = this.container.querySelector(`#imageInfo${this.id}`);
        this.removeFileBtn = this.container.querySelector(`#removeFile${this.id}`);
        this.imageText = this.container.querySelector(`#${this.id}ImageText`);
        this.uploadHint = this.container.querySelector('.upload-hint');
    }

    /**
     * 初始化所有事件监听器，包括点击、文件选择、拖拽和移除按钮事件
     */
    initEventListeners() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));

        // 拖拽事件处理
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files[0]);
        });

        this.removeFileBtn.addEventListener('click', () => this.removeImage());
        refreshTranslation()
    }

    /**
     * 处理文件选择的逻辑
     * @param {File} file - 用户选择的文件对象
     */
    handleFileSelect(file) {
        if (!file) return;
        // 检查文件类型是否为图片
        if (!file.type.startsWith('image/')) {
            if (typeof showError === 'function') showError(translation('common.image.errors.invalidFile'));
            return;
        }

        this.currentFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.previewImage.src = e.target.result; // 设置预览图的src

                // 显示预览区域，隐藏上传区域
                this.uploadArea.style.display = 'none';
                this.previewSection.style.display = 'block';

                // 显示图片信息
                const sizeKB = (file.size / 1024).toFixed(2);
                this.imageInfo.textContent = `${file.name} - ${img.width} × ${img.height} - ${sizeKB} KB`;

                // 调用回调函数，通知外部文件已改变
                if (this.onFileChangeCallback) {
                    this.onFileChangeCallback(this.id, file, e.target.result);
                }
            };
            img.src = e.target.result; // 加载图片以获取尺寸
        };
        reader.readAsDataURL(file); // 读取文件作为Data URL
    }

    /**
     * 移除当前加载的图片
     */
    removeImage() {
        this.currentFile = null;
        this.previewImage.src = '';
        this.imageInfo.textContent = '';
        this.fileInput.value = ''; // 清空文件输入框的值，以便再次选择相同文件
        this.uploadArea.style.display = 'block'; // 显示上传区域
        this.previewSection.style.display = 'none'; // 隐藏预览区域

        // 调用回调函数，通知外部文件已移除
        if (this.onFileChangeCallback) {
            this.onFileChangeCallback(this.id, null, '');
        }
    }

    /**
     * 获取当前上传的文件
     * @returns {File|null} 当前上传的文件对象
     */
    getFile() {
        return this.currentFile;
    }

    /**
     * 获取当前上传的文件的数据URL
     * @returns {string} 文件的数据URL
     */
    getImageSrc() {
        return this.previewImage.src;
    }

}
