# H5 模板技能 · 深空紫蓝主题

> 用本文件作为生成同风格 H5 应用的完整规范。AI 收到「按照 H5-TEMPLATE.md 生成一个 H5」类指令时，应严格遵循此文件中的设计令牌、组件库、架构模式和数据流。

---

## 一、设计语言

**关键词：** 深空底色 · 紫蓝光晕 · 玻璃拟态 · 大字标题 · 克制动效

### 1.1 色彩体系

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--bg-0` | `#07070f` | 页面最底层背景 |
| `--bg-1` | `#0b0b14` | 导航/弹窗卡片背景 |
| `--bg-2` | `#11111d` | 图片占位/骨架背景 |
| `--surface` | `rgba(255,255,255,0.04)` | 次级表面 |
| `--surface-2` | `rgba(255,255,255,0.06)` | hover 表面 |
| `--border` | `rgba(255,255,255,0.08)` | 边框 |
| `--border-strong` | `rgba(255,255,255,0.14)` | hover 边框 |
| `--primary` | `#8b5cf6` | 主色（紫） |
| `--primary-2` | `#6366f1` | 主色渐变终点（蓝） |
| `--primary-soft` | `rgba(139,92,246,0.16)` | 主色半透明 |
| `--accent` | `#22d3ee` | 强调色（青） |
| `--accent-soft` | `rgba(34,211,238,0.14)` | 强调色半透明 |
| `--text-1` | `#f5f5fa` | 主文本 |
| `--text-2` | `#b4b4c7` | 次级文本 |
| `--text-3` | `#6f6f87` | 三级文本 |

### 1.2 尺寸体系

| 令牌 | 值 | 说明 |
|------|-----|------|
| `--r-sm` | `10px` | 小圆角 |
| `--r-md` | `16px` | 中圆角 |
| `--r-lg` | `22px` | 大圆角 |
| `--r-pill` | `999px` | 胶囊形 |
| `--sp-1` ~ `--sp-20` | `4→8→12→16→20→24→32→40→48→64→80px` | 4px 基间距尺度 |
| `--nav-h` | `64px` | 导航栏高度 |
| `--maxw` | `1200px` | 内容最大宽度 |
| `--ease` | `cubic-bezier(0.22,1,0.36,1)` | 统一缓动曲线 |
| `--shadow-card` | `0 10px 30px -12px rgba(0,0,0,.6), 0 2px 6px rgba(0,0,0,.4)` | 卡片阴影 |
| `--shadow-pop` | `0 30px 80px -20px rgba(0,0,0,.75), 0 0 0 1px var(--border)` | 弹窗阴影 |

### 1.3 字体

```
font-family: "Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

- **Inter** (400/500/600/700)：拉丁字母与数字
- **Noto Sans SC** (400/500/700/900)：中文字符
- 字体文件本地化存放在 `fonts/` 目录，通过 `unicode-range` 子集化按需加载
- `fonts.css` 引用本地 woff2 文件，不依赖 CDN

**关键字号：**

| 元素 | 字号 | 字重 |
|------|------|------|
| Hero 标题 | `clamp(36px, 9vw, 64px)` | 900 |
| Hero 副标题 | `clamp(14px, 3.6vw, 17px)` | 400 |
| 统计数字 | `clamp(22px, 6vw, 30px)` | 800 |
| 弹窗标题 | `clamp(22px, 5vw, 28px)` | 800 |
| 卡片标题 | 14px | 600 |
| 正文 | 14px | 400 |
| 按钮 | 14px | 600 |
| 分类标签 | 11px | 600 |

### 1.4 响应式断点

| 断点 | 瀑布流列数 | 其他变化 |
|------|-----------|----------|
| `<640px` | 2 列 | 移动端布局 |
| `≥640px` | 3 列 | — |
| `≥900px` | 4 列 | — |
| `≥1200px` | 5 列 | 最大宽度限制 |
| `≥768px` | — | 弹窗改为左右分栏 |
| `≤480px` | — | 分页器按钮缩小至 36px |

### 1.5 动画规范

| 动画 | 时长 | 曲线 | 说明 |
|------|------|------|------|
| 卡片入场 | 0.6s | `--ease` | `translateY(16px) + opacity:0 → 0`，stagger 延迟 `min(i,12)*60ms` |
| 骨架屏闪烁 | 1.4s | linear | `background-position: 200% → -200%`，infinite |
| 加载旋转 | 0.8s | linear | `rotate(0 → 360deg)`，infinite |
| 卡片 hover | 0.2s | `--ease` | `translateY(-3px)` + 阴影增强 |
| 图片 hover | 0.3s | `--ease` | `scale(1.05)` |
| 弹窗淡入 | 0.3s | `--ease` | `opacity + visibility` |
| 弹窗卡片 | 0.35s | `--ease` | `scale(0.96) translateY(12px) → 1,0` |
| 所有 `transition` | — | `--ease` | 统一使用 `--ease` 变量 |

**无障碍：** `@media (prefers-reduced-motion: reduce)` 将所有动画缩短至 `0.01ms`。

---

## 二、HTML 结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#0b0b14" />
  <meta name="description" content="应用描述" />
  <title>应用标题</title>
  <link rel="stylesheet" href="./fonts/fonts.css" />
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>
  <!-- 1. 背景光晕装饰 -->
  <div class="bg-glow" aria-hidden="true"></div>

  <!-- 2. 顶部导航（sticky） -->
  <header class="nav" id="nav">
    <div class="nav__inner">
      <a class="nav__logo" href="#top">
        <span class="nav__logo-mark">✦</span>
        <span class="nav__logo-text">App<em>Name</em></span>
      </a>
      <div class="nav__search">
        <svg class="nav__search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input id="searchInput" type="search" placeholder="搜索..." autocomplete="off" />
      </div>
    </div>
  </header>

  <!-- 3. Hero 区 -->
  <section class="hero" id="top">
    <div class="hero__inner">
      <span class="hero__badge">✦ 徽章文字</span>
      <h1 class="hero__title">大标题<br />第二行<em>强调</em>。</h1>
      <p class="hero__subtitle">副标题描述文字</p>
      <div class="hero__stats">
        <div class="hero__stat"><strong id="statTotal">0</strong><span>标签1</span></div>
        <div class="hero__stat"><strong id="statCat">0</strong><span>标签2</span></div>
        <div class="hero__stat"><strong>4K</strong><span>标签3</span></div>
      </div>
    </div>
  </section>

  <!-- 4. 分类导航（sticky + 横向滚动） -->
  <nav class="cats" id="cats" aria-label="分类">
    <div class="cats__track" id="catsTrack"></div>
  </nav>

  <!-- 5. 内容瀑布流 + 分页 + 空状态 -->
  <main class="gallery" id="gallery">
    <div class="gallery__masonry" id="masonry"></div>
    <nav class="gallery__pager" id="pager" hidden></nav>
    <div class="gallery__empty" id="empty" hidden>
      <span class="gallery__empty-icon">∅</span>
      <p>没有找到符合条件的内容</p>
      <button class="btn btn--ghost" id="resetBtn">重置筛选</button>
    </div>
  </main>

  <!-- 6. 加载骨架 -->
  <div class="loader" id="loader"><span></span></div>

  <!-- 7. 详情弹窗 -->
  <div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__overlay" data-close></div>
    <article class="modal__card">
      <button class="modal__close" data-close aria-label="关闭">✕</button>
      <div class="modal__img-wrap">
        <img id="modalImg" alt="" loading="lazy" />
        <div class="modal__img-loader"><span></span></div>
        <div class="modal__img-timeout" id="modalTimeout" style="display:none">
          <p>图片加载超时，图片可能较大</p>
          <p>请直接点击下方「下载」</p>
        </div>
      </div>
      <div class="modal__body">
        <div class="modal__cat" id="modalCat"></div>
        <h2 class="modal__title" id="modalTitle"></h2>
        <p class="modal__desc" id="modalDesc"></p>
        <div class="modal__tags" id="modalTags"></div>
        <div class="modal__actions">
          <a class="btn btn--primary" id="modalDownload" download>下载</a>
          <button class="btn btn--ghost" id="modalFav">收藏</button>
        </div>
      </div>
    </article>
  </div>

  <!-- 8. 回到顶部 -->
  <button class="to-top" id="toTop" aria-label="回到顶部" hidden>↑</button>

  <!-- 9. 页脚 -->
  <footer class="footer">
    <p class="footer__brand">✦ AppName</p>
    <p class="footer__note">说明文字 © <span id="year"></span> AppName</p>
  </footer>

  <script src="./js/data.js"></script>
  <script src="./js/app.js"></script>
</body>
</html>
```

---

## 三、CSS 架构规范

### 3.1 文件组织

```
css/
└── style.css    # 单文件，按区块注释分隔
```

**区块顺序：**
1. 设计令牌（`:root` 变量）
2. 基础重置（`*`, `html`, `body`, `img`, `button`, `input`, `a`）
3. 背景装饰（`.bg-glow`）
4. 按钮（`.btn`, `.btn--primary`, `.btn--ghost`）
5. 导航栏（`.nav`, `.nav__inner`, `.nav__logo`, `.nav__search`）
6. Hero（`.hero`, `.hero__title`, `.hero__stats`）
7. 分类导航（`.cats`, `.cat`, `.cat__count`）
8. 瀑布流（`.gallery__masonry`，CSS 多列）
9. 卡片（`.card`, `.card__img-wrap`, `.card__overlay`, `.card__skeleton`）
10. 分页器（`.pager__btn`, `.is-active`）
11. 弹窗（`.modal`, `.modal__card`, `.modal__body`）
12. 辅助（`.to-top`, `.footer`, `.loader`）
13. 响应式（`@media` 断点）
14. 无障碍（`prefers-reduced-motion`）

### 3.2 关键样式模式

**背景光晕：**
```css
.bg-glow {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(60% 50% at 18% -8%, rgba(139,92,246,0.22), transparent 70%),
    radial-gradient(50% 45% at 92% 4%, rgba(34,211,238,0.14), transparent 70%),
    radial-gradient(70% 60% at 50% 110%, rgba(99,102,241,0.18), transparent 70%);
}
.bg-glow::after {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 50% 0%, #000 30%, transparent 75%);
}
```

**玻璃拟态导航：**
```css
.nav {
  position: sticky; top: 0; z-index: 50; height: var(--nav-h);
  background: rgba(11,11,20,0.72);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s var(--ease);
}
.nav.scrolled { background: rgba(8,8,15,0.92); }
```

**渐变文字：**
```css
.hero__title {
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**CSS 多列瀑布流：**
```css
.gallery__masonry {
  column-count: 2; column-gap: var(--sp-3);
}
@media (min-width: 640px) { .gallery__masonry { column-count: 3; } }
@media (min-width: 900px) { .gallery__masonry { column-count: 4; } }
@media (min-width: 1200px) { .gallery__masonry { column-count: 5; } }

.card { break-inside: avoid; margin-bottom: var(--sp-3); }
```

**卡片骨架屏：**
```css
.card__skeleton {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, var(--bg-2) 25%, var(--surface-2) 50%, var(--bg-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.card__skeleton.fade-out { opacity: 0; transition: opacity 0.4s var(--ease); }
@keyframes shimmer { to { background-position: -200% 0; } }
```

**卡片入场动画：**
```css
.card {
  opacity: 0;
  animation: cardIn 0.6s var(--ease) forwards;
  animation-delay: calc(var(--i, 0) * 60ms);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 四、JS 架构规范

### 4.1 文件组织

```
js/
├── data.js    # 数据层：分类配置 + 懒加载 + 缓存
└── app.js     # 应用层：IIFE 封装，状态/渲染/事件
```

### 4.2 数据层（data.js）

**职责：** 定义分类配置、按需加载 JSON 数据、缓存已加载分类。

```javascript
// 分类配置（单一数据源）
const ANIMES = [
  { id: "category1", name: "分类一", icon: "✦", file: "data/category1.json" },
  { id: "category2", name: "分类二", icon: "☯", file: "data/category2.json" },
];

// 派生分类列表（含"全部"）
const CATEGORIES = [
  { id: "all", name: "全部", icon: "✦" },
  ...ANIMES.map((a) => ({ id: a.id, name: a.name, icon: a.icon })),
];

// 分类级缓存
const _cache = {};

// 加载单个分类（带缓存），补齐 category/src/thumb 字段
async function loadAnime(anime) {
  if (_cache[anime.id]) return _cache[anime.id];
  const res = await fetch(anime.file);
  const items = await res.json();
  _cache[anime.id] = items.map((w) => ({
    ...w,
    category: anime.id,
    src: `images/${anime.id}/${w.id}${w.type}`,
    thumb: `thumbs/${anime.id}/${w.id}${w.type}`,
  }));
  return _cache[anime.id];
}

// 按分类加载：传入 "all" 加载全部，传入 id 加载单分类
async function loadCategory(catId) {
  if (catId === "all") {
    const results = await Promise.all(ANIMES.map(loadAnime));
    return results.flat();
  }
  const anime = ANIMES.find((a) => a.id === catId);
  return anime ? loadAnime(anime) : [];
}

window.__DATA__ = { CATEGORIES, ANIMES, loadCategory };
```

**数据项格式：**
```json
{
  "id": "item01",
  "title": "标题（去除编号后缀）",
  "desc": "简短描述",
  "tags": ["分类名", "标签1", "标签2"],
  "type": ".jpg"
}
```

### 4.3 应用层（app.js）

**IIFE 封装，无全局污染：**

```javascript
(function () {
  "use strict";

  const { CATEGORIES, loadCategory } = window.__DATA__;
  let WALLPAPERS = [];
  const catCounts = {};
  let totalCount = 0;

  // 常量配置
  const PAGE_SIZE = 20;
  const PAGER_VISIBLE = 1;
  const IMG_TIMEOUT = 30000;

  // 状态对象
  const state = {
    activeCat: "all",
    keyword: "",
    currentId: null,
    page: 1,
    favorites: new Set(loadFav()),
  };

  // ... 渲染函数 / 事件绑定 / 初始化
})();
```

### 4.4 核心函数清单

| 函数 | 职责 |
|------|------|
| `init()` | 启动：加载数据 → shuffle → 计算统计 → 渲染 → 绑事件 |
| `renderStats()` | 更新 Hero 统计数字 |
| `renderCats()` | 渲染分类按钮 + 数量徽标 |
| `renderCards()` | 渲染当前页卡片 + 骨架屏 + 分页器 |
| `renderPager(total, totalPages)` | 渲染分页按钮（首页/末页/当前页±1/省略号） |
| `getFiltered()` | 按关键词过滤当前分类数据 |
| `selectCat(id)` | 切换分类：清搜索词 → 加载数据 → 渲染（async） |
| `selectPage(page)` | 翻页：更新 state → 渲染 → 滚动到瀑布流顶部 |
| `openModal(id)` | 打开详情弹窗：预加载原图 → 30s 超时提示 |
| `closeModal()` | 关闭弹窗：清除计时器 → 清空图片 |
| `attachImgHandlers(img)` | 卡片图片加载完成 → 骨架屏淡出；失败 → 错误占位 |
| `shuffle(arr)` | Fisher-Yates 洗牌（返回新数组） |
| `toggleFav(id)` | 收藏/取消收藏（localStorage 持久化） |
| `bindEvents()` | 统一事件委托绑定 |

### 4.5 事件委托模式

所有列表交互使用事件委托，不在子元素上逐个绑定：

```javascript
// 分类点击
els.catsTrack.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat");
  if (btn) selectCat(btn.dataset.cat);
});

// 卡片点击
els.masonry.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.id);
});

// 分页点击
els.pager.addEventListener("click", (e) => {
  const btn = e.target.closest(".pager__btn");
  if (!btn || btn.hasAttribute("aria-disabled")) return;
  selectPage(parseInt(btn.dataset.page, 10));
});
```

### 4.6 弹窗图片超时保护

```javascript
let imgTimeoutTimer = null;

function openModal(id) {
  // ...
  clearTimeout(imgTimeoutTimer);
  const tester = new Image();
  imgTimeoutTimer = setTimeout(() => {
    els.imgTimeout.style.display = "flex";  // 显示超时提示
  }, IMG_TIMEOUT);
  tester.onload = () => {
    clearTimeout(imgTimeoutTimer);
    els.imgTimeout.style.display = "none";
    els.modalImg.src = w.src;
  };
  tester.src = w.src;
}

function closeModal() {
  clearTimeout(imgTimeoutTimer);
  // ...
}
```

### 4.7 搜索防抖

```javascript
let timer;
els.searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    // 搜索时自动切回"全部"分类
    if (state.activeCat !== "all") {
      state.activeCat = "all";
      WALLPAPERS = await loadCategory("all");
    }
    state.keyword = els.searchInput.value;
    state.page = 1;
    renderCards();
  }, 180);
});
```

### 4.8 分类切换水平居中

```javascript
// 让选中项在容器内水平居中（仅滚动容器，不触发整页滚动）
const active = $$(".cat").find((b) => b.dataset.cat === id);
if (active) {
  const track = els.catsTrack;
  const trackRect = track.getBoundingClientRect();
  const btnRect = active.getBoundingClientRect();
  const delta = btnRect.left - trackRect.left + btnRect.width / 2 - track.clientWidth / 2;
  track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
}
```

### 4.9 localStorage 收藏

```javascript
function loadFav() {
  try { return JSON.parse(localStorage.getItem("app_fav") || "[]"); }
  catch { return []; }
}
function saveFav() {
  try { localStorage.setItem("app_fav", JSON.stringify([...state.favorites])); }
  catch {}
}
```

---

## 五、数据流

```
data/*.json          ← 原始元数据（id/title/desc/tags/type）
  ↓ fetch (data.js loadAnime)
  → 补齐 category / src / thumb
  ↓ (app.js init)
  → shuffle (仅初始化时打乱一次)
  ↓ WALLPAPERS 数组
  → renderCards() → 卡片缩略图 (thumbs/)
  → card click → openModal()
  → 弹窗原图 (images/) + 30s 超时保护
  → 下载链接 = 原图路径
```

**双图策略：**
- 卡片展示：`thumbs/<cat>/<id><ext>`（缩略图，小体积快加载）
- 详情/下载：`images/<cat>/<id><ext>`（原图，高清）

---

## 六、目录结构

```
project/
├── index.html              # 页面入口
├── css/style.css           # 主样式（单文件）
├── fonts/                  # 本地字体（woff2 + fonts.css）
├── js/
│   ├── data.js            # 数据层（配置 + 懒加载 + 缓存）
│   └── app.js             # 应用层（IIFE）
├── data/                   # JSON 元数据
│   ├── category1.json
│   └── category2.json
├── images/                 # 原图（按分类分目录）
│   ├── category1/
│   └── category2/
├── thumbs/                 # 缩略图（镜像 images 结构）
│   ├── category1/
│   └── category2/
├── H5-TEMPLATE.md         # 本文件
└── SKILL.md               # 内容维护技能
```

---

## 七、生成新 H5 的步骤

当用户要求「按照 H5-TEMPLATE.md 生成一个 H5」时，执行：

1. **确认需求**：应用名称、分类列表（id/name/icon）、数据项字段
2. **创建目录结构**：按第六节创建
3. **生成 index.html**：按第二节模板，替换应用名称和描述
4. **生成 css/style.css**：按第一节设计令牌和第三节样式模式，保持深空紫蓝主题
5. **生成 js/data.js**：按第 4.2 节，配置 ANIMES 数组和加载逻辑
6. **生成 js/app.js**：按第 4.3-4.9 节，包含全部核心函数
7. **生成 data/*.json**：按用户数据生成
8. **生成缩略图**：180×140px 居中裁剪
9. **验证**：JSON 条目数与图片数一致，缩略图数与原图数一致

**关键约束：**
- 所有颜色/间距/圆角必须使用 CSS 变量，不硬编码
- 所有动画使用 `--ease` 曲线
- JS 使用 IIFE 封装，不污染全局
- 事件使用委托模式
- 图片双路径（缩略图/原图）
- 弹窗图片需超时保护
- 字体本地化，不依赖 CDN
- 移动端 viewport 禁止缩放（`maximum-scale=1.0, user-scalable=no`）
- 支持 `prefers-reduced-motion`
