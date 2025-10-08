# Multi Pro Icon - GitHub Pages 部署说明

## 访问地址

multi_pro_icon 子项目已配置为 GitHub Pages 静态网站，可以通过以下地址访问：

**主演示页面：**
```
https://xuefeibai.github.io/multi_web_project/multi_pro_icon/
```

**直接访问演示页面：**
```
https://xuefeibai.github.io/multi_web_project/multi_pro_icon/demo_index.html
```

## 部署配置

### GitHub Actions 工作流
项目使用 GitHub Actions 自动部署到 GitHub Pages：

- **工作流文件：** `.github/workflows/deploy-multi-pro-icon.yml`
- **触发条件：** 当 `multi_pro_icon/` 目录下的文件发生更改时自动部署
- **部署分支：** `main` 分支

### 项目结构
```
multi_pro_icon/
├── index.html              # 入口页面（自动重定向到 demo_index.html）
├── demo_index.html         # 主要演示页面
├── demo.css               # 演示页面样式
├── iconfont.css           # 图标字体样式
├── iconfont.js            # SVG 图标脚本
├── iconfont.woff2         # 字体文件
├── iconfont.woff          # 字体文件
├── iconfont.ttf           # 字体文件
├── iconfont.json          # 图标配置
├── iconfont-css-variables.js # CSS 变量支持
├── package.json           # 项目配置
├── README.md              # 项目说明
└── LICENSE                # 许可证
```

## 功能特性

### 图标字体支持
- **Unicode 引用：** 使用字体编码直接引用图标
- **Font Class 引用：** 使用 CSS 类名引用图标
- **Symbol 引用：** 使用 SVG 符号引用图标（支持多色）

### 图标分类
项目包含多种实用图标，包括：
- 界面操作图标（返回、分享、编辑等）
- 功能图标（支付、验证、上传等）
- 设施图标（床、电视、空调等）
- 服务图标（安保、健身房、便利店等）

## 使用说明

### 在网页中使用
1. 引入样式文件：
```html
<link rel="stylesheet" href="iconfont.css">
```

2. 使用图标：
```html
<!-- Unicode 方式 -->
<span class="multi-pro-iconfont">&#xe625;</span>

<!-- Font Class 方式 -->
<span class="multi-pro-iconfont multi-pro-icon-fanhui"></span>

<!-- Symbol 方式 -->
<svg class="icon" aria-hidden="true">
  <use xlink:href="#multi-pro-icon-fanhui"></use>
</svg>
```

## 部署状态

GitHub Actions 工作流会在每次推送后自动运行，部署状态可以在仓库的 Actions 页面查看。

部署完成后，网站将在几分钟内可通过上述地址访问。
