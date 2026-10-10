<!-- 由 early-repayment/index.html 转换为 uniapp 小程序页面 -->
<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <!-- Hero -->
    <view class="hero">
      <view class="hero__title">
        <text>提前还贷</text>
        <text class="em">计算器</text>
      </view>
      <view class="hero__subtitle">
        支持等额本息/等额本金两种还款方式，计算提前还款后的月供变化、逐月还款明细及利息节省
      </view>
    </view>

    <!-- 主体 -->
    <view class="container">
      <!-- 表单卡片 -->
      <view class="card">
        <view class="card__title">
          <text>贷款信息</text>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>剩余贷款本金</text>
            <text class="hint">当前未还的贷款本金</text>
          </view>
          <view class="input-wrapper">
            <input
              class="input"
              type="digit"
              :value="remainingPrincipal"
              @input="onPrincipalInput"
              placeholder="请输入剩余本金"
              placeholder-class="input-ph"
            />
            <text class="input-suffix">元</text>
          </view>
        </view>

        <view class="form-row">
          <view class="form-group form-group--flex">
            <view class="form-label">
              <text>剩余还款年限</text>
            </view>
            <picker
              mode="selector"
              :range="yearsOptions"
              :value="yearsIndex"
              @change="onYearsChange"
            >
              <view class="input picker-display">
                <text class="picker-text">{{ yearsOptions[yearsIndex] }}</text>
                <text class="picker-arrow">▾</text>
              </view>
            </picker>
          </view>
          <view class="form-group form-group--flex">
            <view class="form-label">
              <text>剩余还款月数</text>
            </view>
            <picker
              mode="selector"
              :range="monthsOptions"
              :value="monthsIndex"
              @change="onMonthsChange"
            >
              <view class="input picker-display">
                <text class="picker-text">{{ monthsOptions[monthsIndex] }}</text>
                <text class="picker-arrow">▾</text>
              </view>
            </picker>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>还款方式</text>
          </view>
          <view class="seg">
            <view
              class="seg__item"
              :class="{ 'is-active': method === 'equal_installment' }"
              @click="selectMethod('equal_installment')"
            >
              <text class="seg__label">等额本息</text>
              <text class="seg__hint">每月还款固定</text>
            </view>
            <view
              class="seg__item"
              :class="{ 'is-active': method === 'equal_principal' }"
              @click="selectMethod('equal_principal')"
            >
              <text class="seg__label">等额本金</text>
              <text class="seg__hint">每月还款递减</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>贷款利率</text>
            <text class="hint">默认使用最新公积金贷款利率</text>
          </view>
          <picker
            mode="selector"
            :range="rateLabels"
            :value="rateIndex"
            @change="onRateChange"
          >
            <view class="input picker-display">
              <text class="picker-text">{{ rateLabels[rateIndex] }}</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>

        <view v-if="showCustomRate" class="form-group">
          <view class="form-label">
            <text>自定义年利率</text>
          </view>
          <view class="input-wrapper">
            <input
              class="input"
              type="digit"
              :value="customRate"
              @input="onCustomRateInput"
              placeholder="请输入年利率"
              placeholder-class="input-ph"
            />
            <text class="input-suffix">%</text>
          </view>
        </view>

        <view class="card__title card__title--sub">
          <text>提前还贷</text>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>提前还款金额</text>
            <text class="hint">一次性偿还的本金</text>
          </view>
          <view class="input-wrapper">
            <input
              class="input"
              type="digit"
              :value="prepayAmount"
              @input="onPrepayInput"
              placeholder="请输入提前还款金额"
              placeholder-class="input-ph"
            />
            <text class="input-suffix">元</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>提前还款日期</text>
            <text class="hint">仅可选择今天及以后</text>
          </view>
          <picker
            mode="date"
            :value="prepayDate"
            :start="todayStr"
            @change="onDateChange"
          >
            <view class="input picker-display">
              <text v-if="prepayDate" class="picker-text">{{ prepayDate }}</text>
              <text v-else class="picker-text picker-text--ph">请选择日期</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>

        <view class="form-group">
          <view class="form-label">
            <text>提前还款后方式</text>
          </view>
          <view class="seg">
            <view
              class="seg__item"
              :class="{ 'is-active': strategy === 'shorten_term' }"
              @click="selectStrategy('shorten_term')"
            >
              <text class="seg__label">缩短年限</text>
              <text class="seg__hint">月供不变，提前还完</text>
            </view>
            <view
              class="seg__item"
              :class="{ 'is-active': strategy === 'reduce_payment' }"
              @click="selectStrategy('reduce_payment')"
            >
              <text class="seg__label">减少月供</text>
              <text class="seg__hint">年限不变，月供降低</text>
            </view>
          </view>
        </view>

        <view v-if="errorMsg" class="form-error">
          <text>{{ errorMsg }}</text>
        </view>

        <view class="form-actions">
          <button class="btn btn--ghost" @click="resetForm">重置</button>
          <button class="btn btn--primary" @click="calculate">计算</button>
        </view>
      </view>

      <!-- 计算说明卡片 -->
      <view class="card">
        <view class="calc-note">
          <view class="calc-note__summary" @click="toggleNote">
            <view class="calc-note__bar"></view>
            <text class="calc-note__title">计算说明</text>
            <text class="calc-note__arrow" :class="{ 'is-open': noteOpen }">›</text>
          </view>
          <view v-if="noteOpen" class="calc-note__body">
            <view class="note-p">
              <text class="strong">等额本息</text>
              <text>：每月还款额固定，计算公式为 </text>
              <text class="code">M = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ - 1)</text>
              <text>，其中 P 为本金、r 为月利率、n 为期数。每月利息 = 剩余本金 × r，每月本金 = M - 利息。</text>
            </view>
            <view class="note-p">
              <text class="strong">等额本金</text>
              <text>：每月偿还本金固定（</text>
              <text class="code">P ÷ n</text>
              <text>），利息逐月递减。每月利息 = 剩余本金 × r，月还款额 = 每月本金 + 利息。</text>
            </view>
            <view class="note-p">
              <text class="strong">缩短年限（月供不变）</text>
              <text>：提前还款后剩余本金减少，月供保持不变，还款期数相应缩短。</text>
            </view>
            <view class="note-p">
              <text class="strong">减少月供（年限不变）</text>
              <text>：提前还款后剩余本金减少，还款期数不变，月供相应降低。</text>
            </view>
            <view class="note-p note-p--meta">
              <text>利率来源：中国人民银行2025年5月公布的个人住房公积金贷款利率。首套5年以上2.60%、5年及以内2.10%；二套5年以上3.075%、5年及以内2.525%。实际利率以贷款合同为准。</text>
            </view>
            <view class="note-p note-p--meta">
              <text>月利率 = 年利率 ÷ 12。还款日期从提前还款日的次月起按月递推，如遇月末日期自动对齐至当月最后一天。</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="footer">
      <view class="footer__brand">
        <text>🏠 提前还贷计算器</text>
      </view>
      <view class="footer__line">
        <text>利率数据：中国人民银行2025年5月公布的公积金贷款利率</text>
      </view>
      <view class="footer__disclaimer">
        <text>⚠ 免责声明：本工具所有估算结果仅供参考，不构成任何行政或法律依据。实际还款金额、利息计算及提前还款手续费以贷款银行核定为准。如有疑问，请咨询贷款经办银行。</text>
      </view>
      <view class="footer__copy">
        <text>© {{ year }} 提前还贷计算器</text>
      </view>
    </view>

    <!-- 结果弹窗 -->
    <view v-if="showResult && result" class="modal">
      <view class="modal__overlay" @click="closeModal"></view>
      <view class="modal__card">
        <view class="modal__close" @click="closeModal">
          <text>✕</text>
        </view>
        <view class="modal__title">
          <text>还款结果</text>
        </view>
        <scroll-view scroll-y class="modal__body" :show-scrollbar="false">
          <!-- 摘要 -->
          <view class="summary">
            <view class="summary__item">
              <view class="summary__label">
                <text>提前还款后剩余本金</text>
              </view>
              <view class="summary__value summary__value--accent">
                <text>{{ formatCurrency(result.P_new) }}</text>
              </view>
              <view class="summary__sub">
                <text>原剩余 {{ formatCurrency(result.P) }} · 提前还 {{ formatCurrency(result.P - result.P_new) }}</text>
              </view>
            </view>

            <view class="summary__item">
              <view class="summary__label">
                <text>月供{{ result.strategy === 'shorten_term' ? '' : '变化' }}</text>
              </view>
              <template v-if="result.strategy === 'shorten_term'">
                <view class="summary__value">
                  <text>{{ formatCurrency(result.originalMonthly) }}</text>
                </view>
                <view class="summary__sub">
                  <text>月供不变 · {{ methodLabel }}</text>
                </view>
              </template>
              <template v-else>
                <view class="summary__value">
                  <text class="dim">{{ formatCurrency(result.originalMonthly) }} → </text>
                  <text>{{ formatCurrency(result.newMonthly) }}</text>
                </view>
                <view class="summary__sub">
                  <text>月供减少 {{ formatCurrency(result.originalMonthly - result.newMonthly) }} 元</text>
                </view>
              </template>
            </view>

            <view class="summary__item">
              <view class="summary__label">
                <text>剩余期数{{ result.strategy === 'reduce_payment' ? '' : '变化' }}</text>
              </view>
              <template v-if="result.strategy === 'shorten_term'">
                <view class="summary__value">
                  <text class="dim">{{ result.n }} → </text>
                  <text>{{ result.newMonths }}</text>
                </view>
                <view class="summary__sub">
                  <text>缩短 {{ reducedStr }}（{{ reducedMonths }}期）</text>
                </view>
              </template>
              <template v-else>
                <view class="summary__value">
                  <text>{{ result.n }}</text>
                </view>
                <view class="summary__sub">
                  <text>期数不变 · {{ methodLabel }}</text>
                </view>
              </template>
            </view>

            <view class="summary__item">
              <view class="summary__label">
                <text>原剩余总利息</text>
              </view>
              <view class="summary__value summary__value--warning">
                <text>{{ formatCurrency(result.originalTotalInterest) }}</text>
              </view>
            </view>

            <view class="summary__item">
              <view class="summary__label">
                <text>新剩余总利息</text>
              </view>
              <view class="summary__value">
                <text>{{ formatCurrency(result.newTotalInterest) }}</text>
              </view>
            </view>

            <view class="summary__item summary__item--highlight">
              <view class="summary__label">
                <text>节省利息</text>
              </view>
              <view class="summary__value summary__value--success">
                <text>{{ formatCurrency(result.interestSaved) }}</text>
              </view>
              <view class="summary__sub">
                <text>{{ methodLabel }} · {{ strategyLabel }}</text>
              </view>
            </view>

            <view class="summary__item summary__item--full">
              <view class="summary__label summary__label--c">
                <text>预计还完日期</text>
              </view>
              <view class="summary__value summary__value--primary summary__value--c">
                <text>{{ formatDate(result.payoffDate) }}</text>
              </view>
              <view class="summary__sub summary__sub--c">
                <text>年利率 {{ result.annualRate }}% · 从提前还款次月起算</text>
              </view>
            </view>
          </view>

          <!-- 逐月还款明细 -->
          <view class="table-title">
            <view class="table-title__bar"></view>
            <text>逐月还款明细</text>
          </view>
          <scroll-view scroll-x class="table-wrap" :show-scrollbar="false">
            <view class="schedule-table">
              <view class="tr tr--head">
                <text class="th th--c">期次</text>
                <text class="th">还款日期</text>
                <text class="th">月还款额</text>
                <text class="th">本金</text>
                <text class="th">利息</text>
                <text class="th">剩余本金</text>
              </view>
              <view
                v-for="row in result.schedule"
                :key="row.month"
                class="tr"
              >
                <text class="td td--c">{{ row.month }}</text>
                <text class="td">{{ formatDate(row.date) }}</text>
                <text class="td">{{ formatCurrency(row.payment) }}</text>
                <text class="td td--principal">{{ formatCurrency(row.principal) }}</text>
                <text class="td td--interest">{{ formatCurrency(row.interest) }}</text>
                <text class="td">{{ formatCurrency(row.remaining) }}</text>
              </view>
            </view>
          </scroll-view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";

// ========== 利率配置 ==========
const RATES = {
  fund_first_5plus: 2.60,
  fund_first_5under: 2.10,
  fund_second_5plus: 3.075,
  fund_second_5under: 2.525,
  custom: 0
};

// ========== 选项 ==========
const yearsOptions = Array.from({ length: 31 }, (_, i) => i + "年");
const monthsOptions = Array.from({ length: 12 }, (_, i) => i + "月");
const rateOptions = [
  { value: "fund_first_5plus", label: "首套公积金（5年以上）2.60%" },
  { value: "fund_first_5under", label: "首套公积金（5年及以内）2.10%" },
  { value: "fund_second_5plus", label: "二套公积金（5年以上）3.075%" },
  { value: "fund_second_5under", label: "二套公积金（5年及以内）2.525%" },
  { value: "custom", label: "自定义利率" }
];
const rateLabels = rateOptions.map(o => o.label);

// ========== 状态 ==========
const remainingPrincipal = ref("500000");
const yearsIndex = ref(20);
const monthsIndex = ref(0);
const method = ref("equal_installment");
const rateIndex = ref(0);
const customRate = ref("3.5");
const prepayAmount = ref("100000");
const prepayDate = ref("");
const strategy = ref("shorten_term");

const errorMsg = ref("");
const showResult = ref(false);
const result = ref(null);
const noteOpen = ref(false);
const year = ref(new Date().getFullYear());

const today = new Date();
const todayStr =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");

// ========== 工具函数 ==========
function formatCurrency(num) {
  const n = Number(num) || 0;
  return n.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function addMonths(date, months) {
  const d = new Date(date.getTime());
  const originalDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, lastDay));
  return d;
}

// ========== 计算函数 ==========
function getAnnualRate() {
  const key = rateOptions[rateIndex.value].value;
  if (key === "custom") return parseFloat(customRate.value) || 0;
  return RATES[key] || 0;
}

function calcEqualInstallmentPayment(P, n, r) {
  if (r === 0) return P / n;
  const factor = Math.pow(1 + r, n);
  return (P * r * factor) / (factor - 1);
}

function generateSchedule(P, n, r, mthd, startDate, fixedPayment, fixedMonthlyPrincipal) {
  const schedule = [];
  let remaining = P;
  let M, monthlyPrincipal;

  if (mthd === "equal_installment") {
    M = fixedPayment || calcEqualInstallmentPayment(P, n, r);
  } else {
    monthlyPrincipal = fixedMonthlyPrincipal || P / n;
  }

  for (let i = 0; i < n; i++) {
    const interest = remaining * r;
    let principalPay;

    if (mthd === "equal_installment") {
      principalPay = M - interest;
      if (i === n - 1) principalPay = remaining; // 最后一月还清
    } else {
      principalPay = monthlyPrincipal;
      if (i === n - 1) principalPay = remaining; // 最后一月还清
    }

    remaining = Math.max(0, remaining - principalPay);
    schedule.push({
      month: i + 1,
      date: addMonths(startDate, i),
      payment: principalPay + interest,
      principal: principalPay,
      interest: interest,
      remaining: remaining
    });
  }
  return schedule;
}

function calcTotalInterest(schedule) {
  let total = 0;
  for (let i = 0; i < schedule.length; i++) total += schedule[i].interest;
  return total;
}

function showError(msg) {
  errorMsg.value = msg;
}

function clearError() {
  errorMsg.value = "";
}

// ========== 核心计算 ==========
function calculate() {
  clearError();

  const P = parseFloat(remainingPrincipal.value);
  const years = yearsIndex.value;
  const months = monthsIndex.value;
  const n = years * 12 + months;
  const mthd = method.value;
  const annualRate = getAnnualRate();
  const r = annualRate / 100 / 12;
  const E = parseFloat(prepayAmount.value);
  const strat = strategy.value;
  const prepayDateStr = prepayDate.value;

  // 验证
  if (!P || P <= 0) {
    showError("请输入有效的剩余贷款本金");
    return;
  }
  if (!n || n <= 0) {
    showError("剩余还款期限不能为0");
    return;
  }
  if (!E || E <= 0) {
    showError("请输入有效的提前还款金额");
    return;
  }
  if (E >= P) {
    showError("提前还款金额不能大于或等于剩余本金（如需全部还清无需计算）");
    return;
  }
  if (!prepayDateStr) {
    showError("请选择提前还款日期");
    return;
  }
  if (annualRate <= 0) {
    showError("利率必须大于0");
    return;
  }

  const prepayDate = new Date(prepayDateStr);
  const P_new = P - E;
  const startDate = addMonths(prepayDate, 1); // 次月开始

  // 原始月供和总利息
  let originalMonthly, originalTotalInterest, originalSchedule;

  if (mthd === "equal_installment") {
    originalMonthly = calcEqualInstallmentPayment(P, n, r);
    originalSchedule = generateSchedule(P, n, r, "equal_installment", prepayDate);
  } else {
    const mp = P / n;
    originalSchedule = generateSchedule(P, n, r, "equal_principal", prepayDate, null, mp);
    originalMonthly = originalSchedule[0].payment; // 首月还款
  }
  originalTotalInterest = calcTotalInterest(originalSchedule);

  // 提前还款后新计划
  let newSchedule, newMonthly, newMonths;

  if (strat === "shorten_term") {
    // 缩短年限，月供不变
    if (mthd === "equal_installment") {
      newMonthly = originalMonthly;
      // n_new = log(M / (M - P_new * r)) / log(1 + r)
      const denominator = originalMonthly - P_new * r;
      if (denominator <= 0) {
        showError("计算异常：月供不足以覆盖利息，请检查输入");
        return;
      }
      const n_new = Math.log(originalMonthly / denominator) / Math.log(1 + r);
      newMonths = Math.ceil(n_new);
      if (newMonths < 1) newMonths = 1;
      newSchedule = generateSchedule(P_new, newMonths, r, "equal_installment", startDate, originalMonthly);
    } else {
      // 等额本金：保持每月本金不变
      const monthlyP = P / n;
      newMonths = Math.ceil(P_new / monthlyP);
      if (newMonths < 1) newMonths = 1;
      newSchedule = generateSchedule(P_new, newMonths, r, "equal_principal", startDate, null, monthlyP);
      newMonthly = newSchedule[0].payment;
    }
  } else {
    // 减少月供，年限不变
    newMonths = n;
    if (mthd === "equal_installment") {
      newMonthly = calcEqualInstallmentPayment(P_new, n, r);
      newSchedule = generateSchedule(P_new, n, r, "equal_installment", startDate);
    } else {
      const newMonthlyP = P_new / n;
      newSchedule = generateSchedule(P_new, n, r, "equal_principal", startDate, null, newMonthlyP);
      newMonthly = newSchedule[0].payment;
    }
  }

  const newTotalInterest = calcTotalInterest(newSchedule) + P_new * r;
  const interestSaved = originalTotalInterest - newTotalInterest;
  const payoffDate =
    newSchedule.length > 0 ? newSchedule[newSchedule.length - 1].date : prepayDate;

  result.value = {
    P: P,
    P_new: P_new,
    n: n,
    newMonths: newMonths,
    originalMonthly: originalMonthly,
    newMonthly: newMonthly,
    originalTotalInterest: originalTotalInterest,
    newTotalInterest: newTotalInterest,
    interestSaved: interestSaved,
    payoffDate: payoffDate,
    schedule: newSchedule,
    method: mthd,
    strategy: strat,
    annualRate: annualRate
  };
  showResult.value = true;
}

// ========== 派生展示 ==========
const methodLabel = computed(() =>
  result.value
    ? result.value.method === "equal_installment"
      ? "等额本息"
      : "等额本金"
    : ""
);

const strategyLabel = computed(() =>
  result.value
    ? result.value.strategy === "shorten_term"
      ? "缩短年限"
      : "减少月供"
    : ""
);

const reducedMonths = computed(() =>
  result.value ? result.value.n - result.value.newMonths : 0
);

const reducedStr = computed(() => {
  if (!result.value) return "";
  const rm = reducedMonths.value;
  const y = Math.floor(rm / 12);
  const m = rm % 12;
  return (y > 0 ? y + "年" : "") + (m > 0 ? m + "月" : "");
});

const showCustomRate = computed(
  () => rateOptions[rateIndex.value].value === "custom"
);

// ========== 事件处理 ==========
function onPrincipalInput(e) {
  remainingPrincipal.value = e.detail.value;
}

function onCustomRateInput(e) {
  customRate.value = e.detail.value;
}

function onPrepayInput(e) {
  prepayAmount.value = e.detail.value;
}

function onYearsChange(e) {
  yearsIndex.value = +e.detail.value;
}

function onMonthsChange(e) {
  monthsIndex.value = +e.detail.value;
}

function onRateChange(e) {
  rateIndex.value = +e.detail.value;
}

function onDateChange(e) {
  prepayDate.value = e.detail.value;
}

function selectMethod(m) {
  method.value = m;
}

function selectStrategy(s) {
  strategy.value = s;
}

function toggleNote() {
  noteOpen.value = !noteOpen.value;
}

function closeModal() {
  showResult.value = false;
}

function resetForm() {
  remainingPrincipal.value = "500000";
  yearsIndex.value = 20;
  monthsIndex.value = 0;
  method.value = "equal_installment";
  rateIndex.value = 0;
  customRate.value = "3.5";
  prepayAmount.value = "100000";
  prepayDate.value = todayStr;
  strategy.value = "shorten_term";
  showResult.value = false;
  clearError();
}

// ========== 初始化 ==========
onMounted(() => {
  prepayDate.value = todayStr;
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

.page {
  min-height: 100vh;
  padding-bottom: var(--sp-8);
}

/* Hero */
.hero {
  padding: var(--sp-8) var(--sp-4) var(--sp-5);
  text-align: center;
}

.hero__title {
  font-size: 72rpx;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-3);
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

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
  font-size: 26rpx;
  color: var(--text-2);
  max-width: 600rpx;
  margin: 0 auto;
  line-height: 1.6;
}

/* 容器 */
.container {
  max-width: 750rpx;
  margin: 0 auto;
  padding: 0 var(--sp-4) var(--sp-8);
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
  margin-bottom: var(--sp-5);
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

  &--sub {
    margin-top: var(--sp-6);
  }
}

/* 表单 */
.form-group {
  margin-bottom: var(--sp-5);

  &--flex {
    flex: 1;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
  font-weight: 500;

  .hint {
    font-size: 22rpx;
    color: var(--text-3);
    font-weight: 400;
  }
}

.form-row {
  display: flex;
  gap: var(--sp-3);
}

.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  height: 96rpx;
  padding: 0 var(--sp-4);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-1);
  font-size: 30rpx;
  box-sizing: border-box;
}

.input-ph {
  color: var(--text-3);
}

.input-suffix {
  position: absolute;
  right: var(--sp-4);
  top: 50%;
  transform: translateY(-50%);
  font-size: 26rpx;
  color: var(--text-3);
}

/* Picker 显示样式（模拟 input） */
.picker-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: var(--sp-4);
}

.picker-text {
  font-size: 30rpx;
  color: var(--text-1);

  &--ph {
    color: var(--text-3);
  }
}

.picker-arrow {
  font-size: 24rpx;
  color: var(--text-3);
}

/* 分段控件（替代 radio） */
.seg {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-1) 0;
}

.seg__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: var(--sp-3) var(--sp-2);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  transition: all 0.2s var(--ease);

  &.is-active {
    background: var(--primary-soft);
    border-color: var(--primary);
    box-shadow: 0 8rpx 24rpx rgba(139, 92, 246, 0.2);
  }
}

.seg__label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-2);

  .is-active & {
    color: var(--text-1);
  }
}

.seg__hint {
  font-size: 22rpx;
  color: var(--text-3);

  .is-active & {
    color: var(--text-2);
  }
}

/* 按钮 */
.form-actions {
  display: flex;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
}

.btn {
  flex: 1;
  height: 96rpx;
  border-radius: var(--r-md);
  font-size: 30rpx;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &--primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    box-shadow: 0 12rpx 36rpx rgba(139, 92, 246, 0.3);
  }

  &--ghost {
    background: var(--surface);
    color: var(--text-1);
    border: 1rpx solid var(--border);
  }
}

/* 错误提示 */
.form-error {
  padding: var(--sp-3) var(--sp-4);
  background: rgba(248, 113, 113, 0.08);
  border: 1rpx solid rgba(248, 113, 113, 0.2);
  border-radius: var(--r-md);
  font-size: 24rpx;
  color: var(--danger);
  margin-bottom: var(--sp-4);
  margin-top: var(--sp-2);
}

/* 计算说明折叠 */
.calc-note__summary {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) 0;
}

.calc-note__bar {
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(180deg, var(--primary), var(--accent));
  border-radius: 4rpx;
}

.calc-note__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-2);
  flex: 1;
}

.calc-note__arrow {
  font-size: 36rpx;
  color: var(--text-3);
  transition: transform 0.3s var(--ease);

  &.is-open {
    transform: rotate(90deg);
  }
}

.calc-note__body {
  padding: var(--sp-4) 0 0;
}

.note-p {
  font-size: 26rpx;
  color: var(--text-2);
  line-height: 1.8;
  margin-bottom: var(--sp-2);

  .strong {
    color: var(--text-1);
    font-weight: 700;
  }

  .code {
    background: var(--bg-2);
    padding: 2rpx 12rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: var(--accent);
  }

  &--meta {
    color: var(--text-3);
    font-size: 24rpx;
    margin-top: var(--sp-3);
  }
}

/* 页脚 */
.footer {
  text-align: center;
  padding: var(--sp-8) var(--sp-4) var(--sp-6);
  font-size: 24rpx;
  color: var(--text-3);
  line-height: 1.8;
}

.footer__brand {
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--sp-1);
}

.footer__line {
  margin-top: var(--sp-1);
}

.footer__disclaimer {
  margin-top: var(--sp-3);
  margin-left: auto;
  margin-right: auto;
  max-width: 640rpx;
  padding: var(--sp-3) var(--sp-4);
  background: rgba(248, 113, 113, 0.06);
  border: 1rpx solid rgba(248, 113, 113, 0.15);
  border-radius: var(--r-md);
  font-size: 22rpx;
  color: var(--warning);
  text-align: left;
  line-height: 1.7;
}

.footer__copy {
  margin-top: var(--sp-2);
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
  width: 92%;
  max-width: 680rpx;
  height: 88vh;
  background: var(--bg-1);
  border: 1rpx solid var(--border-strong);
  border-radius: var(--r-lg);
  box-shadow: 0 60rpx 160rpx -40rpx rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-md);
  color: var(--text-2);
  font-size: 32rpx;
  z-index: 2;
  background: var(--surface);
  border: 1rpx solid var(--border);
}

.modal__title {
  flex-shrink: 0;
  font-size: 36rpx;
  font-weight: 700;
  text-align: center;
  padding: var(--sp-6) var(--sp-8) var(--sp-4);
  border-bottom: 1rpx solid var(--border);
}

.modal__body {
  flex: 1;
  min-height: 0;
  padding: var(--sp-5) var(--sp-6) var(--sp-6);
}

/* 摘要网格 */
.summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.summary__item {
  flex: 1 1 calc(50% - var(--sp-3));
  min-width: 280rpx;
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);

  &--full {
    flex: 1 1 100%;
    text-align: center;
  }

  &--highlight {
    border-color: rgba(52, 211, 153, 0.3);
    background: rgba(52, 211, 153, 0.06);
  }
}

.summary__label {
  font-size: 22rpx;
  color: var(--text-3);
  margin-bottom: var(--sp-1);

  &--c {
    text-align: center;
  }
}

.summary__value {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--text-1);

  .dim {
    font-size: 26rpx;
    color: var(--text-3);
    font-weight: 500;
  }

  &--c {
    text-align: center;
  }

  &--accent {
    color: var(--accent);
  }

  &--success {
    color: var(--success);
  }

  &--warning {
    color: var(--warning);
  }

  &--primary {
    color: var(--primary);
  }
}

.summary__sub {
  font-size: 22rpx;
  color: var(--text-3);
  margin-top: 4rpx;

  &--c {
    text-align: center;
  }
}

/* 明细表 */
.table-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--sp-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);

  &__bar {
    width: 6rpx;
    height: 28rpx;
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 4rpx;
  }
}

.table-wrap {
  border-radius: var(--r-md);
  border: 1rpx solid var(--border);
  max-height: 800rpx;
}

.schedule-table {
  display: flex;
  flex-direction: column;
  min-width: 920rpx;
}

.tr {
  display: flex;
  flex-direction: row;
  border-bottom: 1rpx solid var(--border);

  &:last-child {
    border-bottom: none;
  }
}

.tr--head {
  background: var(--bg-1);
  border-bottom: 1rpx solid var(--border-strong);
}

.th,
.td {
  width: 168rpx;
  flex-shrink: 0;
  padding: 16rpx 12rpx;
  text-align: right;
  font-size: 22rpx;
  white-space: nowrap;
}

.th {
  font-weight: 600;
  color: var(--text-2);
}

.td {
  color: var(--text-1);
}

.th--c,
.td--c {
  width: 88rpx;
  text-align: center;
  color: var(--text-3);
}

.td--principal {
  color: var(--accent);
}

.td--interest {
  color: var(--warning);
}
</style>
