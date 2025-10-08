# Iconfont CSS Variables Generator

一个用于从 `iconfont.css` 中提取图标定义并转换为 CSS 变量的 Node.js 脚本。

## 功能特性

- **自动提取**: 从 `.multi-pro-icon-xxx:before` 规则中提取图标内容
- **CSS 变量**: 将图标内容值转换为 `--multi-pro-icon-xxx` CSS 变量
- **幂等性**: 可多次运行，结果保持一致
- **智能清理**: 自动清理旧的变量和注释
- **格式优化**: 保持 CSS 文件格式整洁

## 使用方法

### 1. 直接运行脚本

```bash
node iconfont-css-variables.js
```

### 2. 在代码中使用

```javascript
const CSSVarBuilder = require('./iconfont-css-variables.js');

const builder = new CSSVarBuilder();
builder.process();

// 查看生成的变量
const variables = builder.listVariables();
console.log(variables);
```

## 转换示例

脚本会将以下 CSS 规则：

```css
.multi-pro-icon-jubao:before {
  content: "\e61d";
}
```

转换为 CSS 变量：

```css
/* CSS Variables for Web Components - Auto-generated */
:root {
  --multi-pro-icon-jubao: "\e61d";
}
```

## 文件结构

```
multi-pro-icon/
├── iconfont.css              # 原始图标字体 CSS
├── iconfont-css-variables.js # 主脚本文件
├── demo_index.html           # 图标演示页面
├── README.md                 # 说明文档
└── ...其他图标字体文件
```

## 技术细节

### 变量位置

CSS 变量块会被插入到第一个 `.multi-pro-icon-xxx:before` 规则之前，保持 CSS 文件的结构清晰。

### 幂等性保证

脚本具有幂等性，多次运行会产生相同的结果：
- 自动清理旧的 CSS 变量块
- 清理多余的注释和空行
- 保持变量定义的唯一性

### 错误处理

- 文件不存在时会显示错误信息
- CSS 解析失败时会提供详细错误信息
- 处理完成后会显示生成的变量数量

## Web Components 使用示例

在 Web Components 中使用生成的 CSS 变量：

```javascript
class MyIconComponent extends HTMLElement {
  connectedCallback() {
    const iconName = this.getAttribute('icon');
    const iconContent = getComputedStyle(document.documentElement)
      .getPropertyValue(`--multi-pro-icon-${iconName}`);
    
    this.innerHTML = `
      <span class="multi-pro-iconfont" style="content: ${iconContent}"></span>
    `;
  }
}

customElements.define('my-icon', MyIconComponent);
```

```html
<my-icon icon="jubao"></my-icon>
```

## 许可证

MIT License
