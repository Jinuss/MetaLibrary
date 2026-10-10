<!-- 由 pension/index.html 转换为 uniapp 小程序页面 -->
<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <!-- 主体 -->
    <view class="container">
      <!-- Hero -->
      <view class="hero">
        <view class="hero__title">退休金估算计算器</view>
        <view class="hero__subtitle">支持企业城镇职工和城乡居民养老保险，根据参保地区与缴费情况估算退休后每月可领取的养老金</view>
      </view>

      <!-- Tab 切换 -->
      <view class="tabs">
        <view
          class="tab"
          :class="{ 'is-active': state.type === 'employee' }"
          @click="switchType('employee')"
        >企业城镇职工</view>
        <view
          class="tab"
          :class="{ 'is-active': state.type === 'resident' }"
          @click="switchType('resident')"
        >城乡居民</view>
      </view>

      <!-- 输入表单 -->
      <view class="card">
        <view class="card__title">参保信息</view>

        <!-- 公共：所在省份 -->
        <view class="form-group">
          <text class="form-label">所在省份</text>
          <picker
            mode="selector"
            :range="provinceNames"
            :value="provinceIndex"
            @change="onProvinceChange"
          >
            <view class="select">
              <text class="select__text">{{ currentProvinceName }}</text>
              <text class="select__arrow">▾</text>
            </view>
          </picker>
        </view>

        <!-- 城乡居民：地市选择 -->
        <view v-if="showCityPicker" class="form-group">
          <text class="form-label">所在城市 <text class="hint">不同地市标准不同</text></text>
          <picker
            mode="selector"
            :range="cityNames"
            :value="cityIndex"
            @change="onCityChange"
          >
            <view class="select">
              <text class="select__text">{{ currentCityName }}</text>
              <text class="select__arrow">▾</text>
            </view>
          </picker>
        </view>

        <!-- ========== 企业城镇职工表单 ========== -->
        <view v-if="state.type === 'employee'" class="form-section">
          <view class="form-group">
            <text class="form-label">退休年龄 <text class="hint">渐进式延迟后</text></text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="String(state.empRetireAge)"
                @input="onEmpRetireAgeInput"
              />
              <text class="input-suffix">周岁</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">累计缴费年限</text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="String(state.empYears)"
                @input="onEmpYearsInput"
              />
              <text class="input-suffix">年</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">
              平均缴费工资指数
              <text class="hint">历年缴费工资 ÷ 社平工资的均值</text>
            </text>
            <view class="slider-wrap">
              <view class="slider-head">
                <text class="slider-value">{{ state.empIndex.toFixed(2) }}</text>
                <text class="slider-desc">{{ empIndexDesc }}</text>
              </view>
              <slider
                class="slider"
                :min="0.6"
                :max="3.0"
                :step="0.05"
                :value="state.empIndex"
                activeColor="#8b5cf6"
                backgroundColor="#11111d"
                block-color="#8b5cf6"
                block-size="22"
                @changing="onIndexChanging"
                @change="onIndexChange"
              />
              <view class="slider-labels">
                <text>0.6（下限）</text>
                <text>1.0（社平）</text>
                <text>3.0（上限）</text>
              </view>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">视同缴费年限 <text class="hint">1996年前工龄，无则填0</text></text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="String(state.empDeemedYears)"
                @input="onEmpDeemedYearsInput"
              />
              <text class="input-suffix">年</text>
            </view>
          </view>

          <view class="form-group">
            <view class="switch-row">
              <text class="form-label">
                个人账户储存额
                <text class="hint">已知则手动输入</text>
              </text>
              <view
                class="switch"
                :class="{ 'is-on': state.empAutoAccount }"
                @click="toggleEmpAuto"
              >
                <view class="switch__thumb"></view>
              </view>
            </view>
            <view v-if="!state.empAutoAccount" class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="state.empAccount ? String(state.empAccount) : ''"
                placeholder="个人账户累计储存额"
                @input="onEmpAccountInput"
              />
              <text class="input-suffix">元</text>
            </view>
            <view v-if="state.empAutoAccount" class="info-tag">
              自动估算：按缴费基数8%逐年缴费并计息
            </view>
          </view>
        </view>

        <!-- ========== 城乡居民表单 ========== -->
        <view v-if="state.type === 'resident'" class="form-section">
          <view class="form-group">
            <text class="form-label">当前年龄 <text class="hint">用于计算高龄倾斜</text></text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="String(state.resAge)"
                @input="onResAgeInput"
              />
              <text class="input-suffix">周岁</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">年缴费档次</text>
            <picker
              mode="selector"
              :range="tierNames"
              :value="tierIndex"
              @change="onTierChange"
            >
              <view class="select">
                <text class="select__text">{{ currentTierLabel }}</text>
                <text class="select__arrow">▾</text>
              </view>
            </picker>
            <view class="info-tag">政府补贴：{{ currentTier.subsidy }} 元/年</view>
          </view>

          <view class="form-group">
            <text class="form-label">累计缴费年限</text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="String(state.resYears)"
                @input="onResYearsInput"
              />
              <text class="input-suffix">年</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">
              个人账户余额
              <text class="hint">已知请填写，留空则自动估算</text>
            </text>
            <view class="input-wrapper">
              <input
                class="input"
                type="digit"
                :value="state.resAccount ? String(state.resAccount) : ''"
                placeholder="留空则自动估算"
                @input="onResAccountInput"
              />
              <text class="input-suffix">元</text>
            </view>
            <view class="info-tag">自动估算规则：按缴费档次+政府补贴逐年缴费并按6%年利率计息</view>
          </view>
        </view>

        <!-- 计算按钮 -->
        <view class="btn btn--primary calc-btn" @click="onCalc">
          <text>计算退休金</text>
        </view>
      </view>

      <!-- 计算说明 -->
      <view class="collapse" :class="{ 'is-open': showCalcNote }">
        <view class="collapse__header" @click="showCalcNote = !showCalcNote">
          <view class="collapse__header-left">
            <text class="collapse__header-icon">ℹ</text>
            <text>计算说明</text>
          </view>
          <text class="collapse__arrow" :class="{ 'is-flipped': showCalcNote }">▾</text>
        </view>
        <view v-if="showCalcNote" class="collapse__body">
          <view class="collapse__inner">
            <view class="notice">
              <view class="notice__text">
                <view
                  v-for="(para, i) in calcNoteParagraphs"
                  :key="i"
                  class="notice__para"
                >
                  <text
                    v-for="(seg, j) in para"
                    :key="j"
                    :class="seg.type === 'strong' ? 'seg-strong' : (seg.type === 'code' ? 'seg-code' : 'seg-normal')"
                  >{{ seg.text }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 结果模态框 -->
    <view v-if="showResult" class="modal">
      <view class="modal__overlay" @click="closeResult"></view>
      <view class="modal__card">
        <view class="modal__close" @click="closeResult">✕</view>
        <view class="modal__title">估算结果</view>

        <scroll-view scroll-y class="modal__scroll" :style="{ maxHeight: modalMaxHeight }">
          <view class="result">
            <view class="result__header">
              <view class="result__amount-label">月养老金估算</view>
              <view class="result__amount">
                <text class="result__amount-num">{{ monthlyPensionText }}</text>
                <text class="result__amount-unit"> 元/月</text>
              </view>
              <view class="result__annual">{{ annualPensionText }}</view>
            </view>

            <view class="result__grid">
              <view
                v-for="(item, i) in resultItems"
                :key="'item-' + i"
                class="result__item"
              >
                <view class="result__item-left">
                  <text class="result__item-label">{{ item.label }}</text>
                  <text class="result__item-formula">{{ item.formula }}</text>
                </view>
                <text
                  class="result__item-value"
                  :class="'result__item-value--' + item.color"
                >{{ item.value.toFixed(2) }} 元</text>
              </view>

              <!-- 额外信息：个人账户储存额/余额 -->
              <view v-if="extraInfo" class="result__item">
                <view class="result__item-left">
                  <text class="result__item-label">{{ extraInfo.label }}</text>
                  <text class="result__item-formula">{{ extraInfo.formula }}</text>
                </view>
                <text class="result__item-value">{{ extraInfo.value }} 元</text>
              </view>

              <!-- 替代率（企业职工） -->
              <view v-if="replacementRate" class="result__item">
                <view class="result__item-left">
                  <text class="result__item-label">养老金替代率</text>
                  <text class="result__item-formula">月养老金 ÷ 退休前月工资</text>
                </view>
                <text class="result__item-value result__item-value--success">{{ replacementRate }}%</text>
              </view>

              <!-- 当地人社部门联系方式 -->
              <view v-if="agencyInfo" class="result__item result__item--full">
                <text class="result__item-label">当地人社部门</text>
                <view class="agency-card">
                  <view class="agency-card__icon">📞</view>
                  <view class="agency-card__body">
                    <text class="agency-card__name">{{ agencyInfo.name }}</text>
                    <view class="agency-card__row">
                      <text>电话：</text>
                      <text class="agency-card__phone" @click="makePhoneCall(agencyInfo.phone)">{{ agencyInfo.phone }}</text>
                    </view>
                    <view class="agency-card__row">
                      <text>地址：{{ agencyInfo.address }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 免责声明 -->
              <view class="disclaimer">
                ⚠ 以上估算结果仅供参考，实际待遇以当地社保经办机构核定为准。政策咨询请拨打12333或联系上方人社部门。
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="modal__actions">
          <view class="btn btn--primary modal__action-btn" @click="closeResult">
            <text>知道了</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="footer">
      <view class="footer__brand">¥ 退休金估算计算器</view>
      <view>数据来源：人社部、各省人社厅公开数据（2024-2025年度）</view>
      <view class="footer__warning">
        ⚠ 免责声明：本工具所有估算结果仅供参考，不构成任何行政或法律依据。实际养老金待遇以当地社会保险经办机构核定为准。如有疑问，请拨打全国人社服务热线 12333 或联系当地人社部门。
      </view>
      <view class="footer__copy">© {{ year }} 退休金估算计算器</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import PENSION_DATA from "@/utils/pension-data.js";

/* ========== 状态 ========== */
const state = reactive({
  type: "employee",
  province: "beijing",
  city: "beijing",
  // employee
  empRetireAge: 60,
  empYears: 30,
  empIndex: 0.6,
  empDeemedYears: 0,
  empAutoAccount: true,
  empAccount: 80000,
  // resident
  resAge: 60,
  resTierAmount: 500,
  resYears: 15,
  resAccount: 0
});

const showResult = ref(false);
const showCalcNote = ref(false);
const year = ref(new Date().getFullYear());
const result = ref(null);
const modalMaxHeight = ref("600px");

onMounted(() => {
  try {
    const info = uni.getSystemInfoSync();
    modalMaxHeight.value = Math.floor(info.windowHeight * 0.6) + "px";
  } catch (e) {
    /* fallback */
  }
});

/* ========== 指数描述 ========== */
function getIndexDesc(v) {
  if (v <= 0.65) return "按最低基数缴费";
  if (v <= 0.85) return "低于社平工资";
  if (v <= 1.05) return "按社平工资缴费";
  if (v <= 1.5) return "略高于社平工资";
  if (v <= 2.0) return "较高工资水平";
  if (v <= 2.5) return "高工资水平";
  return "按最高基数缴费";
}

const empIndexDesc = computed(() => getIndexDesc(state.empIndex));

/* ========== 省份列表 ========== */
const provinces = computed(() => {
  return state.type === "employee"
    ? PENSION_DATA.employee.provinces
    : PENSION_DATA.resident.provinces;
});

const provinceNames = computed(() => provinces.value.map(p => p.name));

const provinceIndex = computed(() => {
  const idx = provinces.value.findIndex(p => p.code === state.province);
  return idx >= 0 ? idx : 0;
});

const currentProvinceName = computed(() => {
  const p = provinces.value[provinceIndex.value];
  return p ? p.name : "请选择";
});

/* ========== 城乡居民：地市 ========== */
function getResidentProvince() {
  return PENSION_DATA.resident.provinces.find(p => p.code === state.province);
}

const cities = computed(() => {
  if (state.type !== "resident") return [];
  const prov = getResidentProvince();
  if (!prov || !prov.cities) return [];
  return prov.cities;
});

const cityNames = computed(() =>
  cities.value.map(c => `${c.name}（${c.base} 元/月）`)
);

const showCityPicker = computed(() => cities.value.length > 1);

const cityIndex = computed(() => {
  const idx = cities.value.findIndex(c => c.code === state.city);
  return idx >= 0 ? idx : 0;
});

const currentCityName = computed(() => {
  const c = cities.value[cityIndex.value];
  if (!c) return "请选择";
  return `${c.name}（${c.base} 元/月）`;
});

/* ========== 城乡居民：缴费档次 ========== */
function getResidentTiers() {
  const prov = getResidentProvince();
  if (prov && prov.paymentTiers) return prov.paymentTiers;
  return PENSION_DATA.resident.defaultPaymentTiers;
}

const residentTiers = computed(() => getResidentTiers());

const tierNames = computed(() =>
  residentTiers.value.map(t => `${t.amount} 元/年（补贴 ${t.subsidy} 元）`)
);

const tierIndex = computed(() => {
  const idx = residentTiers.value.findIndex(t => t.amount === state.resTierAmount);
  return idx >= 0 ? idx : 0;
});

const currentTier = computed(() => {
  const tiers = residentTiers.value;
  return tiers.find(t => t.amount === state.resTierAmount) || tiers[0];
});

const currentTierLabel = computed(() => {
  const t = currentTier.value;
  return t ? `${t.amount} 元/年（补贴 ${t.subsidy} 元）` : "请选择";
});

/* ========== Tab 切换 ========== */
function switchType(type) {
  state.type = type;
  const provs = type === "employee"
    ? PENSION_DATA.employee.provinces
    : PENSION_DATA.resident.provinces;

  if (!provs.find(p => p.code === state.province)) {
    state.province = provs[0].code;
  }

  if (type === "resident") {
    const prov = provs.find(p => p.code === state.province);
    if (prov && prov.cities && prov.cities.length > 0) {
      state.city = prov.cities[0].code;
    } else {
      state.city = "";
    }
    const tiers = getResidentTiers();
    if (!tiers.find(t => t.amount === state.resTierAmount)) {
      state.resTierAmount = tiers[0].amount;
    }
  }

  // 切换类型时清除上次结果
  result.value = null;
  showResult.value = false;
}

/* ========== Picker 事件 ========== */
function onProvinceChange(e) {
  const idx = parseInt(e.detail.value, 10);
  state.province = provinces.value[idx].code;
  if (state.type === "resident") {
    const prov = getResidentProvince();
    if (prov && prov.cities && prov.cities.length > 0) {
      state.city = prov.cities[0].code;
    } else {
      state.city = "";
    }
    const tiers = getResidentTiers();
    if (!tiers.find(t => t.amount === state.resTierAmount)) {
      state.resTierAmount = tiers[0].amount;
    }
  }
}

function onCityChange(e) {
  const idx = parseInt(e.detail.value, 10);
  state.city = cities.value[idx].code;
}

function onTierChange(e) {
  const idx = parseInt(e.detail.value, 10);
  state.resTierAmount = residentTiers.value[idx].amount;
}

/* ========== Input 事件 ========== */
function onEmpRetireAgeInput(e) {
  const v = parseInt(e.detail.value, 10);
  if (!isNaN(v)) state.empRetireAge = v;
}

function onEmpYearsInput(e) {
  const v = parseFloat(e.detail.value);
  if (!isNaN(v)) state.empYears = v;
}

function onIndexChanging(e) {
  state.empIndex = parseFloat(e.detail.value);
}

function onIndexChange(e) {
  state.empIndex = parseFloat(e.detail.value);
}

function onEmpDeemedYearsInput(e) {
  const v = parseFloat(e.detail.value);
  if (!isNaN(v)) state.empDeemedYears = v;
}

function toggleEmpAuto() {
  state.empAutoAccount = !state.empAutoAccount;
}

function onEmpAccountInput(e) {
  const v = parseFloat(e.detail.value);
  if (!isNaN(v)) state.empAccount = v;
}

function onResAgeInput(e) {
  const v = parseInt(e.detail.value, 10);
  if (!isNaN(v)) state.resAge = v;
}

function onResYearsInput(e) {
  const v = parseInt(e.detail.value, 10);
  if (!isNaN(v)) state.resYears = v;
}

function onResAccountInput(e) {
  const v = parseFloat(e.detail.value);
  if (!isNaN(v)) state.resAccount = v;
}

/* ========== 个人账户自动估算（年金终值公式）========== */
// FV = PMT × [(1 + r)^n - 1] / r
function estimatePersonalAccount(annualPayment, years, rate) {
  const r = rate || 0.06;
  if (r === 0) return annualPayment * years;
  return annualPayment * (Math.pow(1 + r, years) - 1) / r;
}

/* ========== 企业城镇职工养老金计算 ========== */
function calculateEmployee() {
  const province = PENSION_DATA.employee.provinces.find(p => p.code === state.province);
  if (!province) return null;

  const retireAge = parseInt(state.empRetireAge, 10);
  const totalYears = parseFloat(state.empYears);
  const index = parseFloat(state.empIndex);
  const deemedYears = parseFloat(state.empDeemedYears);
  const actualYears = Math.max(0, totalYears - deemedYears);

  // 计发月数
  const pensionMonths = PENSION_DATA.employee.pensionMonths[retireAge] || 139;

  // 个人账户储存额
  let accountBalance;
  if (state.empAutoAccount) {
    const monthlyBase = province.base * index;
    const annualContribution = monthlyBase * 0.08 * 12;
    accountBalance = estimatePersonalAccount(annualContribution, actualYears, PENSION_DATA.employee.personalAccountRate);
  } else {
    accountBalance = parseFloat(state.empAccount) || 0;
  }

  // 基础养老金 = 计发基数 × (1 + 缴费指数) ÷ 2 × 缴费年限 × 1%
  const basePension = province.base * (1 + index) / 2 * totalYears * 0.01;

  // 个人账户养老金 = 个人账户储存额 ÷ 计发月数
  const accountPension = accountBalance / pensionMonths;

  // 过渡性养老金 = 计发基数 × 缴费指数 × 视同缴费年限 × 1.3%
  const transitionalPension = deemedYears > 0
    ? province.base * index * deemedYears * PENSION_DATA.employee.transitionalRate
    : 0;

  const totalMonthly = basePension + accountPension + transitionalPension;

  return {
    province,
    retireAge,
    totalYears,
    index,
    deemedYears,
    actualYears,
    pensionMonths,
    accountBalance,
    basePension,
    accountPension,
    transitionalPension,
    totalMonthly
  };
}

/* ========== 城乡居民养老金计算 ========== */
function calculateResident() {
  const province = getResidentProvince();
  if (!province) return null;

  // 获取地市级基础养老金
  let cityBase = province.base;
  let cityName = province.name;
  if (province.cities && province.cities.length > 0) {
    const city = province.cities.find(c => c.code === state.city) || province.cities[0];
    cityBase = city.base;
    cityName = city.name;
  }

  const years = parseInt(state.resYears, 10);
  const age = parseInt(state.resAge, 10);
  const tiers = getResidentTiers();
  const tier = tiers.find(t => t.amount === state.resTierAmount) || tiers[0];
  const pensionMonths = PENSION_DATA.resident.pensionMonths;

  // 个人账户储存额：用户输入了值（>0）则用手动值，否则自动估算
  const manualAccount = parseFloat(state.resAccount) || 0;
  const isAutoEstimate = manualAccount <= 0;
  let accountBalance;
  if (isAutoEstimate) {
    const annualPayment = tier.amount + tier.subsidy;
    accountBalance = estimatePersonalAccount(annualPayment, years, 0.06);
  } else {
    accountBalance = manualAccount;
  }

  // 基础养老金 = 地市级基础养老金标准
  let basePension = cityBase;

  // 长缴奖励（缴费超过15年）
  let longPayBonus = 0;
  let longPayDesc = "";
  if (years > 15 && province.longPayReward) {
    const extraYears = years - 15;
    if (province.longPayReward.type === "percent") {
      longPayBonus = Math.round(cityBase * province.longPayReward.rate * extraYears);
      longPayDesc = `每年增发基础养老金的${(province.longPayReward.rate * 100)}%，共${extraYears}年`;
    } else if (province.longPayReward.type === "fixed") {
      longPayBonus = province.longPayReward.amount * extraYears;
      longPayDesc = `每超1年增发${province.longPayReward.amount}元，共${extraYears}年`;
    }
    basePension += longPayBonus;
  }

  // 高龄倾斜
  let ageBonus = 0;
  let ageBonusDesc = "";
  if (province.ageAdjust) {
    for (const adj of province.ageAdjust) {
      if (age >= adj.minAge) {
        ageBonus = adj.amount;
        ageBonusDesc = `${adj.minAge}周岁以上加发${adj.amount}元`;
      }
    }
    basePension += ageBonus;
  }

  // 个人账户养老金 = 个人账户储存额 ÷ 139
  const accountPension = accountBalance / pensionMonths;

  const totalMonthly = basePension + accountPension;

  return {
    province,
    cityName,
    cityBase,
    years,
    age,
    tier,
    pensionMonths,
    accountBalance,
    isAutoEstimate,
    basePension,
    accountPension,
    longPayBonus,
    longPayDesc,
    ageBonus,
    ageBonusDesc,
    totalMonthly
  };
}

/* ========== 人社部门联系方式 ========== */
function getAgencyInfo(provinceCode, cityCode) {
  if (cityCode && PENSION_DATA.agencies[cityCode]) return PENSION_DATA.agencies[cityCode];
  if (PENSION_DATA.agencies[provinceCode]) return PENSION_DATA.agencies[provinceCode];
  return PENSION_DATA.defaultAgency;
}

const agencyInfo = computed(() => {
  if (!result.value) return null;
  const cityCode = state.type === "resident" ? state.city : null;
  return getAgencyInfo(state.province, cityCode);
});

/* ========== 结果展示：月/年养老金 ========== */
const monthlyPensionText = computed(() => {
  if (!result.value) return "—";
  return result.value.totalMonthly.toFixed(0);
});

const annualPensionText = computed(() => {
  if (!result.value) return "—";
  return `约 ${(result.value.totalMonthly * 12).toFixed(0)} 元/年`;
});

/* ========== 结果展示：明细列表 ========== */
const resultItems = computed(() => {
  const r = result.value;
  if (!r) return [];

  if (state.type === "employee") {
    const items = [
      {
        label: "基础养老金",
        formula: `${r.province.base} × (1 + ${r.index.toFixed(2)}) ÷ 2 × ${r.totalYears} × 1%`,
        value: r.basePension,
        color: "accent"
      },
      {
        label: "个人账户养老金",
        formula: `${Math.round(r.accountBalance)} ÷ ${r.pensionMonths}（${r.retireAge}岁计发月数）`,
        value: r.accountPension,
        color: "primary"
      }
    ];

    if (r.transitionalPension > 0) {
      items.push({
        label: "过渡性养老金",
        formula: `${r.province.base} × ${r.index.toFixed(2)} × ${r.deemedYears} × ${(PENSION_DATA.employee.transitionalRate * 100).toFixed(1)}%`,
        value: r.transitionalPension,
        color: "warning"
      });
    }
    return items;
  } else {
    // 城乡居民
    const baseFormula = r.longPayBonus > 0 || r.ageBonus > 0
      ? `${r.cityName}标准 ${r.cityBase} + 长缴奖励 ${r.longPayBonus}${r.ageBonus > 0 ? ` + 高龄倾斜 ${r.ageBonus}` : ""}`
      : `${r.cityName}标准`;
    const items = [
      {
        label: "基础养老金",
        formula: baseFormula,
        value: r.basePension,
        color: "accent"
      },
      {
        label: "个人账户养老金",
        formula: `${Math.round(r.accountBalance)} ÷ ${r.pensionMonths}（60岁计发月数）`,
        value: r.accountPension,
        color: "primary"
      }
    ];

    if (r.longPayBonus > 0) {
      items.push({
        label: "  ├ 长缴奖励",
        formula: r.longPayDesc,
        value: r.longPayBonus,
        color: "success"
      });
    }
    if (r.ageBonus > 0) {
      items.push({
        label: "  ├ 高龄倾斜",
        formula: r.ageBonusDesc,
        value: r.ageBonus,
        color: "warning"
      });
    }
    return items;
  }
});

/* ========== 结果展示：额外信息 ========== */
const extraInfo = computed(() => {
  const r = result.value;
  if (!r) return null;

  if (state.type === "employee") {
    return {
      label: `个人账户储存额${state.empAutoAccount ? "（估算）" : ""}`,
      formula: state.empAutoAccount ? `按基数×8%×12年缴，6%计息` : `手动输入`,
      value: Math.round(r.accountBalance)
    };
  } else {
    return {
      label: `个人账户余额${r.isAutoEstimate ? "（估算）" : ""}`,
      formula: r.isAutoEstimate ? `(${r.tier.amount}+${r.tier.subsidy})×${r.years}年，6%计息` : `手动输入`,
      value: Math.round(r.accountBalance)
    };
  }
});

/* ========== 结果展示：替代率（企业职工）========== */
const replacementRate = computed(() => {
  const r = result.value;
  if (!r || state.type !== "employee") return null;
  return (r.totalMonthly / (r.province.base * r.index) * 100).toFixed(1);
});

/* ========== 计算说明（结构化渲染）========== */
const calcNoteParagraphs = computed(() => {
  const r = result.value;
  if (!r) {
    return [
      [{ text: "请先选择参保类型并填写信息，点击计算后此处将显示详细计算过程。", type: "" }],
      [
        { text: "企业城镇职工养老金", type: "strong" },
        { text: " = 基础养老金 + 个人账户养老金 + 过渡性养老金", type: "" }
      ],
      [
        { text: "城乡居民养老金", type: "strong" },
        { text: " = 基础养老金 + 个人账户养老金", type: "" }
      ]
    ];
  }

  if (state.type === "employee") {
    const paras = [
      [
        { text: "企业城镇职工养老金", type: "strong" },
        { text: "由三部分组成：", type: "" }
      ],
      [
        { text: "① ", type: "" },
        { text: "基础养老金", type: "strong" },
        { text: " = 计发基数 × (1 + 缴费指数) ÷ 2 × 缴费年限 × 1%", type: "" }
      ],
      [
        { text: "② ", type: "" },
        { text: "个人账户养老金", type: "strong" },
        { text: " = 个人账户储存额 ÷ 计发月数", type: "" }
      ]
    ];
    if (r.deemedYears > 0) {
      paras.push([
        { text: "③ ", type: "" },
        { text: "过渡性养老金", type: "strong" },
        { text: " = 计发基数 × 缴费指数 × 视同缴费年限 × 1.3%", type: "" }
      ]);
    }
    paras.push([
      { text: "您所在地区 ", type: "" },
      { text: r.province.name, type: "strong" },
      { text: "，2024年养老金计发基数为 ", type: "" },
      { text: `${r.province.base}`, type: "code" },
      { text: " 元/月。", type: "" }
    ]);
    paras.push([
      { text: `退休年龄 ${r.retireAge} 岁，对应计发月数 `, type: "" },
      { text: `${r.pensionMonths}`, type: "code" },
      { text: " 个月（国发〔2005〕38号）。", type: "" }
    ]);
    const deemedText = r.deemedYears > 0
      ? `（含视同缴费 ${r.deemedYears} 年）`
      : "";
    paras.push([
      { text: `缴费指数 ${r.index.toFixed(2)}，累计缴费 ${r.totalYears} 年${deemedText}。`, type: "" }
    ]);
    if (state.empAutoAccount) {
      const monthlyBase = Math.round(r.province.base * r.index);
      const annualContribution = Math.round(r.province.base * r.index * 0.08 * 12);
      paras.push([
        { text: "个人账户按自动估算：月缴费基数 ", type: "" },
        { text: `${monthlyBase}`, type: "code" },
        { text: " × 8% × 12 = 年缴 ", type: "" },
        { text: `${annualContribution}`, type: "code" },
        { text: ` 元，按6%年利率复利计算 ${r.actualYears} 年，估算储存额约 `, type: "" },
        { text: `${Math.round(r.accountBalance)}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    } else {
      paras.push([
        { text: "个人账户储存额为手动输入：", type: "" },
        { text: `${Math.round(r.accountBalance)}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    }
    return paras;
  } else {
    // 城乡居民
    const paras = [
      [
        { text: "城乡居民养老金", type: "strong" },
        { text: "由两部分组成：", type: "" }
      ],
      [
        { text: "① ", type: "" },
        { text: "基础养老金", type: "strong" },
        { text: " = 地市标准 + 长缴奖励 + 高龄倾斜", type: "" }
      ],
      [
        { text: "② ", type: "" },
        { text: "个人账户养老金", type: "strong" },
        { text: " = 个人账户全部储存额 ÷ 139", type: "" }
      ],
      [
        { text: "您所在地区：", type: "" },
        { text: `${r.province.name} · ${r.cityName}`, type: "strong" }
      ],
      [
        { text: `${r.cityName}基础养老金标准为 `, type: "" },
        { text: `${r.cityBase}`, type: "code" },
        { text: " 元/月", type: "" },
        { text: r.cityBase > r.province.base ? `（高于省最低${r.province.base}元）` : "（等于省最低标准）", type: "" },
        { text: "。", type: "" }
      ]
    ];
    if (r.longPayBonus > 0) {
      paras.push([
        { text: `长缴奖励：${r.longPayDesc}，每月加发 `, type: "" },
        { text: `${r.longPayBonus}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    }
    if (r.ageBonus > 0) {
      paras.push([
        { text: `高龄倾斜：${r.ageBonusDesc}，每月加发 `, type: "" },
        { text: `${r.ageBonus}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    }
    paras.push([
      { text: `缴费档次 ${r.tier.amount} 元/年，政府补贴 ${r.tier.subsidy} 元/年，缴费 ${r.years} 年。`, type: "" }
    ]);
    if (r.isAutoEstimate) {
      paras.push([
        { text: "个人账户余额未填写，自动估算：年缴 ", type: "" },
        { text: `${r.tier.amount + r.tier.subsidy}`, type: "code" },
        { text: ` 元（含补贴），按6%年利率复利计算 ${r.years} 年，估算储存额约 `, type: "" },
        { text: `${Math.round(r.accountBalance)}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    } else {
      paras.push([
        { text: "个人账户余额为手动输入：", type: "" },
        { text: `${Math.round(r.accountBalance)}`, type: "code" },
        { text: " 元。", type: "" }
      ]);
    }
    paras.push([
      { text: "60岁退休，计发月数 ", type: "" },
      { text: "139", type: "code" },
      { text: " 个月（国发〔2014〕8号）。", type: "" }
    ]);
    return paras;
  }
});

/* ========== 拨打电话 ========== */
function makePhoneCall(phone) {
  const phoneDigits = phone.replace(/[^0-9\-]/g, "");
  uni.makePhoneCall({ phoneNumber: phoneDigits, fail: () => {} });
}

/* ========== 计算按钮 ========== */
function onCalc() {
  if (state.type === "employee") {
    const totalYears = parseFloat(state.empYears);
    const deemedYears = parseFloat(state.empDeemedYears);
    if (deemedYears > totalYears) {
      uni.showToast({ title: "视同缴费年限不能超过累计缴费年限", icon: "none" });
      return;
    }
    result.value = calculateEmployee();
    if (!result.value) return;
  } else {
    result.value = calculateResident();
    if (!result.value) return;
  }
  showResult.value = true;
  // 自动展开计算说明
  showCalcNote.value = true;
}

function closeResult() {
  showResult.value = false;
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
  padding: 0 var(--sp-4) var(--sp-10);
}

/* Hero */
.hero {
  padding: var(--sp-6) 0 var(--sp-6);
  text-align: center;
}

.hero__title {
  font-size: 64rpx;
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
  font-size: 28rpx;
  color: var(--text-2);
  line-height: 1.6;
}

/* Tab 切换 */
.tabs {
  display: flex;
  gap: var(--sp-1);
  padding: var(--sp-1);
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  margin-bottom: var(--sp-5);
}

.tab {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-2);
  white-space: nowrap;

  &.is-active {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    box-shadow: 0 8rpx 24rpx rgba(139, 92, 246, 0.3);
  }
}

/* 卡片 */
.card {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
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

  &:last-child {
    margin-bottom: 0;
  }
}

.form-section {
  /* wrapper for conditional form */
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
  font-weight: 500;
}

.hint {
  font-size: 22rpx;
  color: var(--text-3);
  font-weight: 400;
  margin-left: var(--sp-2);
}

/* Picker / Select */
.select {
  width: 100%;
  height: 96rpx;
  padding: 0 var(--sp-4);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__text {
    font-size: 30rpx;
    color: var(--text-1);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 24rpx;
    color: var(--text-3);
    flex-shrink: 0;
    margin-left: var(--sp-2);
  }
}

/* 输入框 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
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
}

.input-suffix {
  position: absolute;
  right: var(--sp-4);
  top: 50%;
  transform: translateY(-50%);
  font-size: 26rpx;
  color: var(--text-3);
  pointer-events: none;
}

/* 滑块 */
.slider-wrap {
  padding: var(--sp-2) 0;
}

.slider-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}

.slider-value {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--accent);
}

.slider-desc {
  font-size: 22rpx;
  color: var(--text-3);
}

.slider {
  width: 100%;
  margin: var(--sp-1) 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-2);
  font-size: 22rpx;
  color: var(--text-3);
}

/* 开关 */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3) 0;
}

.switch {
  position: relative;
  width: 88rpx;
  height: 48rpx;
  border-radius: var(--r-pill);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  flex-shrink: 0;

  &__thumb {
    position: absolute;
    top: 4rpx;
    left: 4rpx;
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background: var(--text-3);
    transition: all 0.25s var(--ease);
  }

  &.is-on {
    background: var(--primary-soft);
    border-color: var(--primary);

    .switch__thumb {
      left: 44rpx;
      background: linear-gradient(135deg, var(--primary), var(--primary-2));
    }
  }
}

/* 信息提示 */
.info-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: 4rpx var(--sp-2);
  background: var(--accent-soft);
  border: 1rpx solid rgba(34, 211, 238, 0.2);
  border-radius: var(--r-sm);
  font-size: 22rpx;
  color: var(--accent);
  margin-top: var(--sp-2);
}

/* 计算按钮 */
.calc-btn {
  margin-top: var(--sp-5);
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
  width: 100%;
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
  font-size: 32rpx;
  color: var(--accent);
}

.collapse__arrow {
  font-size: 28rpx;
  color: var(--text-3);
  transition: transform 0.3s var(--ease);

  &.is-flipped {
    transform: rotate(180deg);
    color: var(--primary);
  }
}

.collapse__body {
  border-top: 1rpx solid var(--border);
}

.collapse__inner {
  padding: 0 var(--sp-5) var(--sp-5);
}

/* 计算说明 */
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

.notice__para {
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.seg-strong {
  color: var(--accent);
  font-weight: 600;
}

.seg-code {
  display: inline-block;
  background: var(--bg-2);
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: var(--primary);
}

.seg-normal {
  color: var(--text-2);
}

/* ========== 模态框 ========== */
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

.modal__scroll {
  width: 100%;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
}

.modal__action-btn {
  height: 88rpx;
  width: 240rpx;
  font-size: 28rpx;
}

/* 结果展示 */
.result__header {
  text-align: center;
  padding-bottom: var(--sp-5);
  margin-bottom: var(--sp-5);
  border-bottom: 1rpx solid var(--border);
}

.result__amount-label {
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.result__amount {
  font-size: 72rpx;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: -0.02em;
}

.result__amount-unit {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-2);
  -webkit-text-fill-color: var(--text-2);
}

.result__annual {
  font-size: 26rpx;
  color: var(--text-3);
  margin-top: var(--sp-2);
}

.result__grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.result__item {
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result__item-left {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
  overflow: hidden;
}

.result__item-label {
  font-size: 24rpx;
  color: var(--text-3);
}

.result__item-formula {
  font-size: 20rpx;
  color: var(--text-3);
  opacity: 0.7;
  word-break: break-all;
}

.result__item-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-1);
  flex-shrink: 0;
  margin-left: var(--sp-2);

  &--accent {
    color: var(--accent);
  }
  &--primary {
    color: var(--primary);
  }
  &--success {
    color: var(--success);
  }
  &--warning {
    color: var(--warning);
  }
}

.result__item--full {
  flex-direction: column;
  align-items: stretch;
  gap: var(--sp-2);
  border-color: var(--border-strong);
  background: var(--primary-soft);
}

/* 人社部门卡片 */
.agency-card {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
}

.agency-card__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--r-sm);
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.agency-card__body {
  flex: 1;
  min-width: 0;
}

.agency-card__name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 8rpx;
}

.agency-card__row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: var(--text-2);
  margin-top: 4rpx;
}

.agency-card__phone {
  color: var(--accent);
  font-weight: 600;
}

/* 免责声明 */
.disclaimer {
  margin-top: var(--sp-4);
  padding: var(--sp-3) var(--sp-4);
  background: rgba(248, 113, 113, 0.08);
  border: 1rpx solid rgba(248, 113, 113, 0.2);
  border-radius: var(--r-md);
  font-size: 22rpx;
  color: var(--text-2);
  line-height: 1.6;
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

.footer__warning {
  margin-top: 12rpx;
  color: var(--warning);
  font-size: 22rpx;
  line-height: 1.6;
}

.footer__copy {
  margin-top: 8rpx;
  color: var(--text-3);
}
</style>
