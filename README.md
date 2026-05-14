# 诗境 · PoeticLens

> 以诗之眼，观世间万象

AI 驱动的古诗词赏析与创作平台 —— 拍下一张照片，AI 为你寻一首诗。

## ✨ 功能特性

- **📸 拍照识诗** — 拍摄或上传图片，AI 识别场景并匹配经典古诗词
- **🤖 AI 赏析** — 基于通义千问多模态大模型，识别季节、时间、景物、意境等结构化标签
- **🎙️ 语音朗读** — 浏览器原生语音合成朗读诗词名句，声波纹动效
- **🎨 国风海报** — 三款海报模板（水墨江南 / 故宫红韵 / 极简留白），支持地点定位显示，html2canvas 高清导出
- **🗺️ 诗意地图** — 高德地图标记打卡足迹，自定义「诗」字图标
- **⏳ 跨时空对话** — AI 分别以唐、宋、当代风格为同一场景创作诗词
- **🏅 成就系统** — 6 枚成就勋章自动解锁（四季行吟、望月诗人、山水行者…）
- **📱 离线体验** — API 不可用时自动降级到内置 Demo 数据，保证基础可用
- **📍 海报定位** — 自动逆地理编码获取当前位置，海报上一键显示/隐藏地点信息
- **🔗 移动端分享** — 移动端优先调用系统 Web Share API 分享海报，降级为下载保存

## 🖼️ 页面预览

| 首页 · 拍照识诗 | 识别结果 · 诗词匹配 | 海报 · 水墨江南 |
|:---:|:---:|:---:|
| 首页入口 + 今日一诗 | 场景标签 + Top5 诗词卡片 | 国风模板 + 保存分享 |

| 诗意地图 | 我的 · 成就 |
|:---:|:---:|
| 打卡标记 + 信息窗 | 勋章 + 历史记录 |

## 🛠️ 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | Vue 3 + Vite 5 |
| UI | Vant 4 + Tailwind CSS 3 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| AI 模型 | 通义千问 VL-Max（图像识别）+ qwen-max（诗词生成） |
| 地图 | 高德地图 JS API 2.0 |
| 截图导出 | html2canvas |
| 图片压缩 | compressorjs |
| 部署 | Netlify（Functions + SPA） |
| 字体 | 霞鹜文楷（LXGW WenKai） |

## 📁 项目结构

```
poeticlens-web/
├── netlify/
│   └── functions/          # Serverless API
│       ├── analyze.js      # 图像场景识别
│       ├── generate-poem.js# AI 生成诗
│       └── multi-dynasty.js# 跨时空对话
├── src/
│   ├── api/                # 接口封装
│   ├── assets/
│   │   ├── css/            # 国风全局样式
│   │   └── data/           # 诗词库 + Demo 降级数据
│   ├── components/
│   │   ├── AchievementBadge.vue
│   │   ├── ImageUploader.vue
│   │   ├── MultiDynasty.vue
│   │   ├── PoemCard.vue
│   │   ├── SpeechButton.vue
│   │   └── PosterTemplate/ # 三款海报模板
│   ├── router/
│   ├── stores/
│   ├── utils/              # 成就/匹配/海报/存储工具
│   └── views/              # 5 个页面
├── .env.example
├── netlify.toml
└── vite.config.js
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Platoooooo/poeticlens-web.git
cd poeticlens-web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例文件并填入你的 API Key：

```bash
cp .env.example .env
```

| 变量名 | 说明 | 获取方式 |
|---|---|---|
| `DASHSCOPE_API_KEY` | 阿里云百炼 API Key | [百炼控制台](https://bailian.console.aliyun.com/) |
| `VITE_AMAP_KEY` | 高德地图 JS API Key | [高德开放平台](https://lbs.amap.com/) |
| `VITE_AMAP_SECURITY_CODE` | 高德地图安全密钥 | 同上 |

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 构建部署

```bash
npm run build
```

## ☁️ Netlify 部署

项目已配置 `netlify.toml`，支持一键部署到 Netlify：

1. Fork 本仓库到你的 GitHub
2. 在 Netlify 中导入该仓库
3. 在 **Site settings → Environment variables** 中配置 `DASHSCOPE_API_KEY` 等环境变量
4. 自动构建部署完成

## 🎨 设计体系

项目使用国风配色体系，全局 CSS 变量定义：

| 变量 | 颜色 | 用途 |
|---|---|---|
| `--color-gu-gong` | 🟥 故宫红 `#8b2c2c` | 主题色 / CTA |
| `--color-xuan-zhi` | 🟨 宣纸色 `#f5f0e8` | 背景 / 卡片 |
| `--color-mo-se` | ⬛ 墨色 `#2c2c2c` | 正文 / 标题 |
| `--color-yin-zhu` | 🟡 银朱金 `#d4af37` | 点缀 / 强调 |
| `--color-feng-ye` | 🟧 枫叶红 `#a83c3c` | 辅助 / 次要 |

## 📄 License

MIT
