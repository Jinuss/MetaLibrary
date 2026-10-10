# 实用工具集 · 小程序版（uniapp）

将原 `utils-bak/` 目录下 6 个深空紫蓝主题的 H5 计算器页面，整合为一个 uniapp Vue3 项目，可一键编译为微信 / 抖音 / 支付宝小程序及 H5。

## 目录结构

```
utils-miniapp/
├── App.vue                       # 根组件，全局设计令牌（page CSS 变量）+ 通用样式
├── main.js                       # 应用入口（createSSRApp）
├── index.html                    # H5 模板入口
├── pages.json                    # 页面路由 + 全局样式 + 各页原生导航栏配置
├── manifest.json                 # 应用配置（微信/抖音/支付宝/H5）
├── package.json                  # 依赖与构建脚本
├── vite.config.js                # Vite + uni 插件配置
├── uni.scss                      # SCSS 变量（与 CSS 变量对齐）
├── pages/
│   ├── index/index.vue           # 工具集首页（原 index.html）
│   ├── retirement/index.vue      # 法定退休年龄计算器
│   ├── pension/index.vue         # 退休金计算器
│   ├── early-repayment/index.vue # 提前还贷计算器
│   ├── tax/index.vue             # 个税计算器
│   └── housing-fund/index.vue    # 公积金贷款计算器
├── utils/
│   ├── common.js                 # 通用工具（storage/导航/格式化/节流）
│   └── pension-data.js           # 退休金计算数据（原 pension/data.js，改 ES 模块导出）
└── static/                       # 静态资源（图标/图片，当前空，按需补充）
```

## 对应关系

| 原 H5 | uniapp 页面 |
|---|---|
| `index.html` | `pages/index/index.vue` |
| `retirement/index.html` | `pages/retirement/index.vue` |
| `pension/index.html` + `pension/data.js` | `pages/pension/index.vue` + `utils/pension-data.js` |
| `early-repayment/index.html` | `pages/early-repayment/index.vue` |
| `tax/index.html` | `pages/tax/index.vue` |
| `housing-fund/index.html` | `pages/housing-fund/index.vue` |

## 关键改造点

1. **设计令牌集中化**：原各 H5 内重复的 `:root{}` CSS 变量统一收敛到 `App.vue` 的 `page{}` 选择器，单位由 `px` 改为 `rpx`（750rpx = 屏宽），各页面 scoped style 直接 `var(--xxx)` 引用。
2. **DOM API 全清零**：所有 `document.*` / `window.*` / `addEventListener` / `getElementById` / `innerHTML` / `classList` / `localStorage` 替换为 Vue3 响应式 `ref`/`reactive`/`computed` + `uni.*` API。
3. **滚动监听** → `onPageScroll`（`@dcloudio/uni-app`）。
4. **本地存储** → `uni.getStorageSync/setStorageSync`（封装在 `utils/common.js` 的 `getStorage/setStorage`）。
5. **内联 `<svg>`** → Unicode/emoji 字符（小程序不支持内联 SVG 标签）。
6. **`<select>+<option>`** → `<picker mode="selector">`；级联选择器用 computed 动态 range。
7. **`<table>`** → flex "假表格" + `v-for`。
8. **`<a href>`** → `uni.navigateTo`（封装在 `utils/common.js` 的 `navigateTo`）。
9. **日期输入** → `<picker mode="date">`；数字输入 `type="digit"`。
10. **`clamp()` / `grid auto-fill` / `position: sticky`** → 固定 rpx / flex 布局 / 移除或改 fixed。
11. **顶部导航栏**：每个计算器页删除了原 H5 的 sticky nav，复用 `pages.json` 注册的小程序原生导航栏（深色白字标题）。
12. **业务算法 100% 保留**：退休年龄延迟表、养老金三段计算、等额本息/等额本金公式、七级累进税率+速算扣除+年终奖双算法、公积金缴存/可贷额度/可贷年限——逐行平移，仅数据承载从 DOM 改为响应式状态。

## 构建使用

### 安装依赖

```bash
cd utils-miniapp
npm install
```

> 若使用 HBuilderX，可直接用 IDE 打开本项目目录，无需 npm install。

### 各端开发预览

```bash
# 微信小程序
npm run dev:mp-weixin
# 抖音小程序
npm run dev:mp-toutiao
# 支付宝小程序
npm run dev:mp-alipay
# H5
npm run dev:h5
```

开发模式下，微信端产物在 `dist/dev/mp-weixin`，用微信开发者工具打开该目录即可预览调试。抖音端产物 `dist/dev/mp-toutiao`，用抖音开发者工具打开。支付宝端产物 `dist/dev/mp-alipay`，用支付宝小程序开发者工具打开。

### 各端生产构建

```bash
npm run build:mp-weixin
npm run build:mp-toutiao
npm run build:mp-alipay
npm run build:h5
```

产物在 `dist/build/<平台>` 目录。

### 各端 AppID 配置

`manifest.json` 中以下字段默认留空，发布前需替换为真实 AppID：

- `mp-weixin.appid` → 微信小程序 AppID
- `mp-toutiao.appid` → 抖音小程序 AppID
- 支付宝小程序 AppID 在用支付宝开发者工具打开项目时在 IDE 内填写

## 注意事项

- 计算器结果弹窗在原 H5 用 `position: fixed` + `body.overflow:hidden` 实现；小程序改用全屏 fixed 蒙层 + `scroll-view` 承载长内容，已无 body 滚动锁。
- 公积金/提前还贷/个税页的逐期明细表，在小程序端用横向 `scroll-view` 或纵向 `scroll-view` 包裹，避免内容过长撑爆页面。
- `backdrop-filter` 玻璃拟态在部分小程序基础库版本上渲染降级（无模糊），已用半透明 `surface` 背景兜底，视觉影响可控。
- 首页工具卡片在小程序默认单列；H5 端宽度 ≥640px 自动切两列。
- 若后续需要 tabBar，可在 `pages.json` 增加 `tabBar` 字段并把首页等设为 tab 页（当前所有页均为普通 push 页）。

## 数据来源声明

退休金计算器 `utils/pension-data.js` 内的各省基数、计发月数等数据，来源同原 H5 注释：人社部、各省人社厅、政府公开文件（2024–2025 年度）。数据更新时直接编辑该文件即可。
