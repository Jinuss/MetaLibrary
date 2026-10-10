<script setup>
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  // 小程序启动
  // eslint-disable-next-line no-console
  console.log("实用工具集小程序启动");
});

onShow(() => {
  // 进入前台
});

onHide(() => {
  // 进入后台
});
</script>

<style lang="scss">
/* ============================================================
 * 全局设计令牌 —— 深空紫蓝主题
 * 所有页面共享，CSS 变量在小程序中通过 page 选择器作用
 * ============================================================ */
page {
  --bg-0: #07070f;
  --bg-1: #0b0b14;
  --bg-2: #11111d;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-2: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --primary: #8b5cf6;
  --primary-2: #6366f1;
  --primary-soft: rgba(139, 92, 246, 0.16);
  --accent: #22d3ee;
  --accent-soft: rgba(34, 211, 238, 0.14);
  --text-1: #f5f5fa;
  --text-2: #b4b4c7;
  --text-3: #6f6f87;
  --success: #34d399;
  --warning: #fbbf24;
  --danger: #f87171;
  --r-sm: 20rpx;
  --r-md: 32rpx;
  --r-lg: 44rpx;
  --r-pill: 999rpx;
  --sp-1: 8rpx;
  --sp-2: 16rpx;
  --sp-3: 24rpx;
  --sp-4: 32rpx;
  --sp-5: 40rpx;
  --sp-6: 48rpx;
  --sp-8: 64rpx;
  --sp-10: 80rpx;
  --nav-h: 128rpx;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --shadow-card: 0 20rpx 60rpx -24rpx rgba(0, 0, 0, 0.6), 0 4rpx 12rpx rgba(0, 0, 0, 0.4);

  background-color: var(--bg-0);
  color: var(--text-1);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    "Microsoft YaHei", sans-serif;
  font-size: 28rpx;
  line-height: 1.6;
}

view, text, button, input, textarea, scroll-view, picker, label {
  box-sizing: border-box;
}

button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  line-height: normal;

  &::after {
    border: none;
  }
}

input, textarea, picker {
  background: none;
  border: none;
  outline: none;
}

/* 全局通用工具类 */
.container {
  padding: 0 var(--sp-4) var(--sp-10);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  height: 88rpx;
  padding: 0 var(--sp-5);
  border-radius: var(--r-md);
  font-size: 28rpx;
  font-weight: 600;

  &--primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    box-shadow: 0 16rpx 48rpx rgba(139, 92, 246, 0.25);
  }

  &--ghost {
    background: var(--surface);
    color: var(--text-2);
    border: 1rpx solid var(--border);
  }
}

/* 渐变文字工具类 */
.text-gradient {
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 卡片基础 */
.card {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
}
</style>
