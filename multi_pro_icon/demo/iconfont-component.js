class IconFont extends HTMLElement {
  static observedAttributes = ['name'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._updateIcon();
  }

  connectedCallback() {
    this._updateIcon();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name' && oldValue !== newValue) {
      this._updateIcon();
    }
  }

  _updateIcon() {
    const iconName = this.getAttribute('name');
    if (!iconName) return;

    // 从CSS变量中获取图标内容
    const iconContent = this._getIconFromCSSVariable(iconName);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: "multi-pro-iconfont" !important;
          font-size: inherit;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1;
        }
        
        .icon {
          display: inline-block;
          width: 1em;
          height: 1em;
          line-height: 1;
          text-align: center;
        }
      </style>
      <span class="icon">${iconContent}</span>
    `;
  }

  _getIconFromCSSVariable(iconName) {
    // 从CSS变量中获取图标内容
    const cssVariable = `--multi-pro-icon-${iconName}`;
    // 直接使用css的var()函数，会查找变量失败，需要使用getComputedStyle
    const computedStyle = getComputedStyle(this.shadowRoot.host);
    const iconContent = computedStyle.getPropertyValue(cssVariable);
    
    if (iconContent) {
      // 将Unicode转义序列转换为实际字符
      return String.fromCharCode(parseInt(iconContent.trim().replace('\\', ''), 16));
    }
    
    // 如果CSS变量不存在，返回默认图标
    return '?';
  }

  // 公共方法
  setIcon(name) {
    this.setAttribute('name', name);
  }

  getIcon() {
    return this.getAttribute('name');
  }
}

// 注册Web Component
customElements.define('icon-font', IconFont);
