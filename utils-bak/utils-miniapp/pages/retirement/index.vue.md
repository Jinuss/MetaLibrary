<!-- 由 retirement/index.html 转换为 uniapp 小程序页面 -->
<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <view class="container">
      <!-- Hero 区 -->
      <view class="hero">
        <view class="hero__title">法定退休年龄计算器</view>
        <view class="hero__subtitle">
          根据《国务院关于渐进式延迟法定退休年龄的办法》，输入您的出生信息，快速计算退休时间与社保缴费要求
        </view>
      </view>

      <!-- 输入表单 -->
      <view class="card">
        <view class="card__title">个人信息</view>

        <!-- 出生年月 -->
        <view class="form-group">
          <view class="form-label">出生年月</view>
          <view class="form-row">
            <view class="form-col">
              <picker
                class="picker-host"
                mode="selector"
                :range="birthYearLabels"
                :value="birthYearIndex"
                @change="onBirthYearChange"
              >
                <view class="select">{{ birthYearLabels[birthYearIndex] }}</view>
              </picker>
            </view>
            <view class="form-col">
              <picker
                class="picker-host"
                mode="selector"
                :range="birthMonthLabels"
                :value="birthMonthIndex"
                @change="onBirthMonthChange"
              >
                <view class="select">{{ birthMonthLabels[birthMonthIndex] }}</view>
              </picker>
            </view>
          </view>
        </view>

        <!-- 性别 -->
        <view class="form-group">
          <view class="form-label">性别</view>
          <view class="radio-group">
            <view
              v-for="g in genderOptions"
              :key="g.value"
              class="radio-item"
              :class="{ 'is-active': gender === g.value }"
              @click="onGenderChange(g.value)"
            >
              <view class="radio-dot" :class="{ 'is-checked': gender === g.value }"></view>
              <text class="radio-label">{{ g.label }}</text>
            </view>
          </view>
        </view>

        <!-- 人员类型（仅女性显示） -->
        <view class="form-group" v-if="gender === 'female'">
          <view class="form-label">人员类型</view>
          <picker
            class="picker-host"
            mode="selector"
            :range="typeLabels"
            :value="typeIndex"
            @change="onTypeChange"
          >
            <view class="select">{{ typeLabels[typeIndex] }}</view>
          </picker>
        </view>

        <!-- 计算按钮 -->
        <button class="btn btn--primary" @click="onCalc">计算退休年龄</button>
      </view>

      <!-- 计算说明（折叠面板） -->
      <view class="collapse" :class="{ 'is-open': collapseOpen }">
        <view class="collapse__header" @click="toggleCollapse">
          <view class="collapse__header-left">
            <text class="collapse__header-icon">ℹ</text>
            <text>计算说明</text>
          </view>
          <text class="collapse__arrow" :class="{ 'is-open': collapseOpen }">▾</text>
        </view>
        <view class="collapse__body" v-if="collapseOpen">
          <view class="collapse__inner">
            <view class="notice">
              <view class="notice__text">
                <view
                  v-for="(line, i) in noteLines"
                  :key="i"
                  class="notice__p"
                >
                  <text
                    v-for="(seg, j) in line"
                    :key="j"
                    :class="{ 'is-strong': seg.strong }"
                  >{{ seg.t }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 结果模态框 -->
    <view class="modal" v-if="modalOpen && r" @click="onModalTap">
      <view class="modal__overlay"></view>
      <view class="modal__card" @click.stop>
        <view class="modal__close" @click="closeModal">✕</view>
        <view class="modal__title">计算结果</view>

        <view class="result">
          <view class="result__header">
            <view class="result__age-label">改革后法定退休年龄</view>
            <view class="result__age">{{ r.ageText }}</view>
          </view>

          <view class="result__grid">
            <view class="result__item">
              <view class="result__item-label">退休时间</view>
              <view class="result__item-value result__item-value--accent">{{ r.dateText }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">延迟月数</view>
              <view class="result__item-value result__item-value--warning">{{ r.delayText }}</view>
            </view>
            <view class="result__item result__item--full">
              <view class="result__item-label">社保最低缴纳时长</view>
              <view class="result__item-value result__item-value--success">{{ r.minContribText }}</view>
              <view class="progress-bar">
                <view class="progress-bar__fill" :style="{ width: r.progressPct + '%' }"></view>
              </view>
              <view class="progress-bar__labels">
                <text>15年</text>
                <text>17.5年</text>
                <text>20年</text>
              </view>
            </view>
            <view class="result__item">
              <view class="result__item-label">原退休年龄</view>
              <view class="result__item-value">{{ r.originalAgeText }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">距今年数</view>
              <view class="result__item-value result__item-value--primary">{{ r.yearsToRetireText }}</view>
            </view>
          </view>
        </view>

        <view class="modal__actions">
          <button class="btn btn--primary modal__btn" @click="closeModal">知道了</button>
        </view>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="footer">
      <view class="footer__brand">✦ 法定退休年龄计算器</view>
      <view>数据来源：国务院关于渐进式延迟法定退休年龄的办法</view>
      <view class="footer__copy">仅供参考，具体以官方政策为准 © {{ year }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

// ========== 配置：三类人员延迟退休参数 ==========
const RETIREMENT_CONFIG = {
  male_worker: {
    name: "男职工",
    originalAge: 60,
    targetAge: 63,
    startYear: 1965,
    startMonth: 1,
    monthsPerStep: 4, // 每 N 个月延迟 1 个月
    maxDelay: 36
  },
  female_cadre: {
    name: "女干部/专业技术人员",
    originalAge: 55,
    targetAge: 58,
    startYear: 1970,
    startMonth: 1,
    monthsPerStep: 4,
    maxDelay: 36
  },
  female_worker: {
    name: "女工人",
    originalAge: 50,
    targetAge: 55,
    startYear: 1975,
    startMonth: 1,
    monthsPerStep: 2,
    maxDelay: 60
  }
};

// ========== 状态 ==========
const birthYear = ref(1985);
const birthMonth = ref(6);
const gender = ref("male");
const currentType = ref("male_worker");
const modalOpen = ref(false);
const collapseOpen = ref(false);
const year = ref(new Date().getFullYear());
const result = ref(null);

// ========== 选项数据（年份 1955-2005，月份 1-12） ==========
const birthYearOptions = (() => {
  const arr = [];
  for (let y = 2005; y >= 1955; y--) arr.push(y);
  return arr;
})();
const birthYearLabels = birthYearOptions.map((y) => y + " 年");

const birthMonthOptions = (() => {
  const arr = [];
  for (let m = 1; m <= 12; m++) arr.push(m);
  return arr;
})();
const birthMonthLabels = birthMonthOptions.map((m) => m + " 月");

// 性别
const genderOptions = [
  { value: "male", label: "男" },
  { value: "female", label: "女" }
];

// 人员类型（女性可选）
const typeOptions = computed(() => {
  if (gender.value === "male") return [];
  return [
    { id: "female_cadre", label: "女干部/专业技术人员（55岁）" },
    { id: "female_worker", label: "女工人（50岁）" }
  ];
});
const typeLabels = computed(() => typeOptions.value.map((t) => t.label));
const typeIndex = computed(() => {
  const idx = typeOptions.value.findIndex((t) => t.id === currentType.value);
  return idx >= 0 ? idx : 0;
});

const birthYearIndex = computed(() => {
  const idx = birthYearOptions.indexOf(birthYear.value);
  return idx >= 0 ? idx : 0;
});
const birthMonthIndex = computed(() => {
  const idx = birthMonthOptions.indexOf(birthMonth.value);
  return idx >= 0 ? idx : 0;
});

// ========== 事件处理 ==========
function onBirthYearChange(e) {
  birthYear.value = birthYearOptions[e.detail.value];
}
function onBirthMonthChange(e) {
  birthMonth.value = birthMonthOptions[e.detail.value];
}
function onGenderChange(value) {
  gender.value = value;
  if (value === "male") {
    currentType.value = "male_worker";
  } else {
    currentType.value = "female_cadre";
  }
}
function onTypeChange(e) {
  currentType.value = typeOptions.value[e.detail.value].id;
}
function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value;
}
function closeModal() {
  modalOpen.value = false;
}
function onModalTap() {
  closeModal();
}

// ========== 计算逻辑（100% 保留） ==========
function getMinContributionMonths(retireYear) {
  // 最低缴费年限由15年逐步提高至20年（上限20年）
  // 2025-2029: 15年
  // 2030起每年增加6个月，到2039年达到20年
  // 2040年及以后：保持20年不变
  if (retireYear <= 2029) return 15 * 12;
  const yearsAfter2029 = retireYear - 2029;
  const months = 15 * 12 + yearsAfter2029 * 6;
  return Math.min(months, 20 * 12); // 上限20年
}

function calculateRetirement() {
  if (!birthYear.value || !birthMonth.value) return null;

  const cfg = RETIREMENT_CONFIG[currentType.value];
  const bYear = parseInt(birthYear.value, 10);
  const bMonth = parseInt(birthMonth.value, 10);

  // 计算从起始日期到出生日期的月数
  const monthsFromStart =
    (bYear - cfg.startYear) * 12 + (bMonth - cfg.startMonth);

  // 如果在政策实施前就达到退休年龄（不受影响）
  // 政策2025年1月1日实施
  const originalRetireYearMonths = bYear * 12 + bMonth + cfg.originalAge * 12;
  const policyStartYearMonths = 2025 * 12 + 1; // 2025年1月

  let delayMonths = 0;

  if (originalRetireYearMonths < policyStartYearMonths) {
    // 2025年之前已退休，不受影响
    delayMonths = 0;
  } else if (monthsFromStart < 0) {
    // 出生在起始年份之前，但退休在2025年及以后
    // 这种情况理论上不会发生在正常的渐进式延迟中
    // 但如果出现，按0延迟处理
    delayMonths = 0;
  } else {
    // 计算延迟月数：每 monthsPerStep 个月延迟 1 个月
    delayMonths = Math.floor(monthsFromStart / cfg.monthsPerStep) + 1;
    // 不超过最大延迟
    delayMonths = Math.min(delayMonths, cfg.maxDelay);
  }

  // 新退休年龄（月）
  const newRetireAgeMonths = cfg.originalAge * 12 + delayMonths;
  const newRetireYears = Math.floor(newRetireAgeMonths / 12);
  const newRetireMonths = newRetireAgeMonths % 12;

  // 退休日期：出生日期 + 新退休年龄
  let retireYear = bYear + newRetireYears;
  let retireMonth = bMonth + newRetireMonths;
  if (retireMonth > 12) {
    retireYear += 1;
    retireMonth -= 12;
  }

  // 计算最低缴费年限
  const minContribMonths = getMinContributionMonths(retireYear);
  const minContribYears = Math.floor(minContribMonths / 12);
  const minContribRemMonths = minContribMonths % 12;

  // 距今年数
  const now = new Date();
  const nowYearMonths = now.getFullYear() * 12 + (now.getMonth() + 1);
  const retireYearMonths = retireYear * 12 + retireMonth;
  const monthsToRetire = retireYearMonths - nowYearMonths;
  const yearsToRetire = (monthsToRetire / 12).toFixed(1);

  return {
    config: cfg,
    delayMonths,
    newRetireYears,
    newRetireMonths,
    retireYear,
    retireMonth,
    minContribYears,
    minContribRemMonths,
    minContribMonths,
    yearsToRetire: monthsToRetire > 0 ? yearsToRetire : "已退休",
    alreadyRetired: monthsToRetire <= 0
  };
}

// ========== 结果展示（格式化） ==========
const r = computed(() => {
  if (!result.value) return null;
  const d = result.value;
  return {
    ageText:
      d.newRetireYears +
      "岁" +
      (d.newRetireMonths > 0 ? d.newRetireMonths + "个月" : ""),
    dateText: d.retireYear + "年" + d.retireMonth + "月",
    delayText: d.delayMonths === 0 ? "无延迟" : d.delayMonths + " 个月",
    minContribText:
      d.minContribRemMonths === 0
        ? d.minContribYears + " 年（" + d.minContribMonths + "个月）"
        : d.minContribYears +
          " 年 " +
          d.minContribRemMonths +
          " 个月（" +
          d.minContribMonths +
          "个月）",
    progressPct: ((d.minContribMonths - 15 * 12) / (5 * 12)) * 100,
    originalAgeText: d.config.originalAge + " 岁",
    yearsToRetireText: d.alreadyRetired ? "已退休" : d.yearsToRetire + " 年"
  };
});

// ========== 计算说明（结构化，替代原 innerHTML） ==========
const noteLines = computed(() => {
  if (!result.value) {
    return [
      [
        { t: "计算结果基于" },
        { t: "《国务院关于渐进式延迟法定退休年龄的办法》", strong: true },
        { t: "。" }
      ],
      [{ t: "请先在上方填写个人信息并点击计算，计算后将在此显示详细的计算说明。" }]
    ];
  }
  const d = result.value;
  const cfg = d.config;
  return [
    [
      { t: "根据" },
      { t: "《国务院关于渐进式延迟法定退休年龄的办法》", strong: true },
      {
        t:
          "，" +
          cfg.name +
          "原法定退休年龄为" +
          cfg.originalAge +
          "周岁，逐步延迟至" +
          cfg.targetAge +
          "周岁。"
      }
    ],
    [
      {
        t:
          "您出生于" +
          birthYear.value +
          "年" +
          birthMonth.value +
          "月，属渐进式延迟退休第" +
          (d.delayMonths > 0 ? d.delayMonths : 0) +
          "批，每" +
          cfg.monthsPerStep +
          "个月延迟1个月。"
      }
    ],
    [{ t: "社保最低缴费年限按退休年份计算，2030年起逐年提高，最高不超过20年。" }]
  ];
});

// ========== 计算入口 ==========
function onCalc() {
  if (!birthYear.value || !birthMonth.value) {
    uni.showToast({ title: "请选择出生年月", icon: "none" });
    return;
  }
  result.value = calculateRetirement();
  modalOpen.value = true;
}
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

/* 容器 */
.container {
  width: 100%;
  padding: 0 var(--sp-4) var(--sp-10);
}

/* Hero */
.hero {
  padding: var(--sp-6) 0 var(--sp-6);
  text-align: center;
}

.hero__title {
  font-size: 72rpx;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-4);
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero__subtitle {
  font-size: 26rpx;
  color: var(--text-2);
  line-height: 1.7;
  padding: 0 var(--sp-4);
}

/* 卡片 */
.card {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-card);
  margin-top: var(--sp-5);
}

.card__title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: var(--sp-5);
  display: flex;
  align-items: center;
  gap: var(--sp-2);

  &::before {
    content: "";
    width: 6rpx;
    height: 32rpx;
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 4rpx;
  }
}

/* 表单 */
.form-group {
  margin-bottom: var(--sp-5);
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: var(--sp-3);
}

.form-col {
  flex: 1;
  min-width: 0;
}

.picker-host {
  display: block;
  width: 100%;
}

.select {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  padding: 0 var(--sp-4);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-1);
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: var(--sp-6);
  padding: var(--sp-3) 0;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 28rpx;
  color: var(--text-2);
}

.radio-dot {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 50%;
  background: var(--bg-2);
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
}

.radio-dot.is-checked {
  border-color: var(--primary);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
  }
}

.radio-item.is-active .radio-label {
  color: var(--text-1);
  font-weight: 500;
}

/* 按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 104rpx;
  border-radius: var(--r-md);
  font-size: 30rpx;
  font-weight: 600;
}

.btn--primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  box-shadow: 0 16rpx 48rpx rgba(139, 92, 246, 0.3);
}

/* 折叠面板 */
.collapse {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-top: var(--sp-5);
}

.collapse__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4) var(--sp-5);
}

.collapse__header-left {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-1);
}

.collapse__header-icon {
  color: var(--accent);
  font-size: 32rpx;
}

.collapse__arrow {
  color: var(--text-3);
  font-size: 28rpx;
  transition: transform 0.3s var(--ease);
}

.collapse__arrow.is-open {
  transform: rotate(180deg);
  color: var(--primary);
}

.collapse__inner {
  padding: 0 var(--sp-5) var(--sp-5);
}

.notice {
  background: var(--accent-soft);
  border: 1rpx solid rgba(34, 211, 238, 0.2);
  border-radius: var(--r-md);
  padding: var(--sp-4);
}

.notice__text {
  font-size: 24rpx;
  color: var(--text-2);
  line-height: 1.8;
}

.notice__p {
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.is-strong {
  color: var(--accent);
  font-weight: 600;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
}

.modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal__card {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  background: var(--bg-1);
  border: 1rpx solid var(--border-strong);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  box-shadow: 0 60rpx 160rpx -40rpx rgba(0, 0, 0, 0.75);
}

.modal__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-md);
  color: var(--text-2);
  font-size: 36rpx;
  z-index: 1;
}

.modal__title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: var(--sp-5);
  text-align: center;
  padding-right: var(--sp-8);
}

/* 结果 */
.result__header {
  text-align: center;
  padding-bottom: var(--sp-5);
  margin-bottom: var(--sp-5);
  border-bottom: 1rpx solid var(--border);
}

.result__age-label {
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.result__age {
  font-size: 88rpx;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: -0.02em;
}

.result__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.result__item {
  width: calc(50% - var(--sp-3) / 2);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  box-sizing: border-box;
}

.result__item--full {
  width: 100%;
}

.result__item-label {
  font-size: 24rpx;
  color: var(--text-3);
  margin-bottom: var(--sp-1);
}

.result__item-value {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-1);
}

.result__item-value--accent {
  color: var(--accent);
}
.result__item-value--primary {
  color: var(--primary);
}
.result__item-value--success {
  color: var(--success);
}
.result__item-value--warning {
  color: var(--warning);
}

/* 进度条 */
.progress-bar {
  height: 12rpx;
  background: var(--bg-2);
  border-radius: var(--r-pill);
  overflow: hidden;
  margin-top: var(--sp-3);
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: var(--r-pill);
  transition: width 0.6s var(--ease);
}

.progress-bar__labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-2);
  font-size: 22rpx;
  color: var(--text-3);
}

/* 模态框底部 */
.modal__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--sp-6);
}

.modal__btn {
  height: 96rpx;
  width: 240rpx;
  font-size: 28rpx;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: var(--sp-8) 0 var(--sp-6);
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
</style>
