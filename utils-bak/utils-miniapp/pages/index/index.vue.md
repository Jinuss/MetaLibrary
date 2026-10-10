<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <!-- 顶部导航（自定义） -->
    <view class="nav" :class="{ scrolled: navScrolled }">
      <view class="nav__inner">
        <view class="nav__logo">
          <view class="nav__logo-mark">✦</view>
          <view class="nav__logo-text">
            实用<text class="em">工具集</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主体 -->
    <view class="container">
      <!-- Hero -->
      <view class="hero">
        <view class="hero__badge">实用工具集合</view>
        <view class="hero__title">
          <text class="line1">精选</text>
          <text class="em">计算工具</text>
          <text class="line2">一站式搞定</text>
        </view>
        <view class="hero__subtitle">
          退休年龄、退休金、房贷等实用计算工具，数据准确、操作便捷，持续更新中
        </view>

        <!-- 统计 -->
        <view class="stats">
          <view class="stat">
            <view class="stat__num">{{ tools.length }}</view>
            <view class="stat__label">工具数量</view>
          </view>
          <view class="stat">
            <view class="stat__num">5+</view>
            <view class="stat__label">分类覆盖</view>
          </view>
          <view class="stat">
            <view class="stat__num">100%</view>
            <view class="stat__label">免费使用</view>
          </view>
        </view>
      </view>

      <!-- 分类标签 -->
      <scroll-view class="cats" scroll-x :show-scrollbar="false">
        <view
          v-for="cat in cats"
          :key="cat.id"
          class="cat"
          :class="{ 'is-active': activeCat === cat.id }"
          @click="onCatClick(cat.id)"
        >
          {{ cat.name }}
        </view>
      </scroll-view>

      <!-- 工具卡片 -->
      <view class="tools-grid">
        <view
          v-for="(tool, i) in filteredTools"
          :key="tool.id"
          class="tool-card"
          :style="{ '--i': i }"
          @click="onToolClick(tool)"
        >
          <view class="tool-card__icon" :class="'tool-card__icon--' + tool.color">
            <text class="icon-glyph">{{ tool.glyph }}</text>
          </view>
          <view class="tool-card__title">
            <text>{{ tool.title }}</text>
            <view v-if="tool.online" class="tool-card__badge">已上线</view>
          </view>
          <view class="tool-card__desc">{{ tool.desc }}</view>
          <view class="tool-card__footer">
            <view class="tool-card__arrow">
              <text>进入工具</text>
              <text class="arrow-glyph">→</text>
            </view>
            <view class="tool-card__tags">
              <view v-for="t in tool.tags" :key="t" class="tool-card__tag">{{ t }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="footer">
      <view class="footer__brand">✦ 实用工具集</view>
      <view>持续更新中，更多工具即将上线</view>
      <view class="footer__copy">© {{ year }} 实用工具集</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onPageScroll } from "@dcloudio/uni-app";
import { navigateTo } from "@/utils/common.js";

// 分类
const cats = [
  { id: "all", name: "全部" },
  { id: "retirement", name: "退休养老" },
  { id: "finance", name: "理财金融" },
  { id: "life", name: "生活实用" }
];

// 工具列表（与原 H5 一致，路径替换为 uniapp 页面路由）
const tools = [
  {
    id: "retirement",
    title: "法定退休年龄计算器",
    desc:
      "根据出生年月、性别和人员类型，计算改革后法定退休年龄、退休时间、延迟月数及社保最低缴纳时长。",
    color: "primary",
    glyph: "⏰",
    cat: "retirement",
    tags: ["退休", "社保"],
    online: true,
    path: "/pages/retirement/index"
  },
  {
    id: "pension",
    title: "退休金计算器",
    desc:
      "根据缴费年限、缴费基数、个人账户余额等，估算退休后每月可领取的基本养老金金额。",
    color: "accent",
    glyph: "¥",
    cat: "retirement",
    tags: ["养老金", "估算"],
    online: true,
    path: "/pages/pension/index"
  },
  {
    id: "early-repayment",
    title: "提前还贷计算器",
    desc:
      "支持等额本息/等额本金两种还款方式，计算提前还款后的月供变化、逐月还款明细及利息节省。默认使用最新公积金贷款利率。",
    color: "success",
    glyph: "🏠",
    cat: "finance",
    tags: ["房贷", "提前还贷"],
    online: true,
    path: "/pages/early-repayment/index"
  },
  {
    id: "tax",
    title: "个税计算器",
    desc:
      "根据最新个税税率表，计算每月应缴个人所得税，支持专项附加扣除和年终奖单独计税。",
    color: "warning",
    glyph: "%",
    cat: "finance",
    tags: ["个税", "薪资"],
    online: false,
    path: "/pages/tax/index"
  },
  {
    id: "housing-fund",
    title: "公积金计算器",
    desc: "计算每月公积金缴存额、贷款额度及可贷年限，支持各地不同缴存比例。",
    color: "primary",
    glyph: "⛨",
    cat: "finance",
    tags: ["公积金", "贷款"],
    online: false,
    path: "/pages/housing-fund/index"
  }
];

const activeCat = ref("all");
const navScrolled = ref(false);
const year = ref(new Date().getFullYear());

const filteredTools = computed(() => {
  if (activeCat.value === "all") return tools;
  return tools.filter(t => t.cat === activeCat.value);
});

function onCatClick(id) {
  activeCat.value = id;
}

function onToolClick(tool) {
  navigateTo(tool.path);
}

// 监听页面滚动，更新导航栏样式
onPageScroll((e) => {
  navScrolled.value = e.scrollTop > 20;
});

onMounted(() => {
  year.value = new Date().getFullYear();
});
</script>

<style lang="scss" scoped>
/* 背景光晕 */
.bg-glow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 18% -8%, rgba(139, 92, 246, 0.22), transparent 70%),
    radial-gradient(50% 45% at 92% 4%, rgba(34, 211, 238, 0.14), transparent 70%),
    radial-gradient(70% 60% at 50% 110%, rgba(99, 102, 241, 0.18), transparent 70%);
}

/* 导航栏 */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--nav-h);
  background: rgba(11, 11, 20, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1rpx solid var(--border);
  transition: background 0.3s var(--ease);

  &.scrolled {
    background: rgba(8, 8, 15, 0.92);
  }
}

.nav__inner {
  height: 100%;
  padding: 0 var(--sp-4);
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text-1);
}

.nav__logo-mark {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  border-radius: var(--r-sm);
  font-size: 32rpx;
}

.nav__logo-text {
  font-weight: 700;
  font-size: 30rpx;

  .em {
    color: var(--primary);
  }
}

/* 容器 */
.container {
  max-width: 750rpx;
  margin: 0 auto;
  padding: 0 var(--sp-4) var(--sp-10);
}

/* Hero */
.hero {
  padding: var(--sp-10) 0 var(--sp-8);
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 12rpx 28rpx;
  background: var(--primary-soft);
  border: 1rpx solid var(--border-strong);
  border-radius: var(--r-pill);
  font-size: 24rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-5);

  &::before {
    content: "✦";
    color: var(--primary);
    margin-right: 8rpx;
  }
}

.hero__title {
  font-size: 80rpx;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--sp-5);
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  .line1 {
    display: inline;
  }
  .line2 {
    display: block;
  }
  .em {
    font-style: italic;
    background: linear-gradient(135deg, var(--accent), var(--primary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}

.hero__subtitle {
  font-size: 28rpx;
  color: var(--text-2);
  max-width: 720rpx;
  margin: 0 auto;
}

/* 统计 */
.stats {
  display: flex;
  justify-content: center;
  gap: var(--sp-8);
  margin-top: var(--sp-8);
}

.stat {
  text-align: center;
}

.stat__num {
  font-size: 56rpx;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat__label {
  font-size: 22rpx;
  color: var(--text-3);
  margin-top: var(--sp-1);
}

/* 分类标签 */
.cats {
  display: flex;
  white-space: nowrap;
  margin-bottom: var(--sp-6);
  padding: 0 var(--sp-4);
}

.cat {
  flex-shrink: 0;
  padding: 16rpx 36rpx;
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-pill);
  font-size: 26rpx;
  font-weight: 500;
  color: var(--text-2);
  margin-right: var(--sp-2);
  transition: all 0.2s var(--ease);

  &.is-active {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    border-color: transparent;
    box-shadow: 0 8rpx 24rpx rgba(139, 92, 246, 0.3);
  }
}

/* 工具卡片网格（小程序用 2 列 flex 布局） */
.tools-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--sp-5);
}

.tool-card {
  position: relative;
  width: 100%;
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: cardIn 0.6s var(--ease) forwards;
  animation-delay: calc(var(--i, 0) * 80ms);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-card__icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: var(--sp-5);
  flex-shrink: 0;
  color: #fff;

  &--primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    box-shadow: 0 16rpx 48rpx rgba(139, 92, 246, 0.25);
  }
  &--accent {
    background: linear-gradient(135deg, var(--accent), #0891b2);
    box-shadow: 0 16rpx 48rpx rgba(34, 211, 238, 0.2);
  }
  &--success {
    background: linear-gradient(135deg, var(--success), #059669);
    box-shadow: 0 16rpx 48rpx rgba(52, 211, 153, 0.2);
  }
  &--warning {
    background: linear-gradient(135deg, var(--warning), #d97706);
    box-shadow: 0 16rpx 48rpx rgba(251, 191, 36, 0.2);
  }
}

.icon-glyph {
  color: #fff;
  font-size: 56rpx;
  line-height: 1;
}

.tool-card__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: var(--sp-2);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.tool-card__badge {
  font-size: 20rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: var(--r-pill);
  background: var(--success);
  color: #07070f;
  letter-spacing: 1rpx;
}

.tool-card__desc {
  font-size: 26rpx;
  color: var(--text-2);
  line-height: 1.7;
  margin-bottom: var(--sp-5);
  flex: 1;
}

.tool-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-card__arrow {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 26rpx;
  font-weight: 600;
  color: var(--primary);
}

.arrow-glyph {
  font-size: 26rpx;
}

.tool-card__tags {
  display: flex;
  gap: var(--sp-1);
}

.tool-card__tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  color: var(--text-3);
}

/* 页脚 */
.footer {
  text-align: center;
  padding: var(--sp-10) 0 var(--sp-6);
  color: var(--text-3);
  font-size: 24rpx;
}

.footer__brand {
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.footer__copy {
  margin-top: 8rpx;
}

/* 响应式：大屏（如 H5）展示 2 列 */
@media (min-width: 640px) {
  .tools-grid {
    .tool-card {
      width: calc(50% - var(--sp-5) / 2);
    }
  }
}
</style>
