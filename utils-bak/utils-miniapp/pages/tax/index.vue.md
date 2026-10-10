<!-- 由 tax/index.html 转换为 uniapp 小程序页面 -->
<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <view class="container">
      <!-- Hero 区 -->
      <view class="hero animate-in animate-in--1">
        <view class="hero__title">个人所得税计算器</view>
        <view class="hero__subtitle">基于2026年最新个税税率表，支持按城市计算五险一金、七项专项附加扣除及年终奖单独计税</view>
      </view>

      <!-- 所在城市 -->
      <view class="card animate-in animate-in--2">
        <view class="card__title">所在城市</view>
        <view class="form-group">
          <view class="form-label">选择城市</view>
          <picker class="select-picker" mode="selector" :range="cityNames" :value="cityIndex" @change="onCityChange">
            <view class="select">{{ currentCityName }}</view>
          </picker>
        </view>
        <view class="form-group form-group--last">
          <view class="checkbox-item" @click="onCityAutoSIToggle">
            <view class="checkbox" :class="{ 'is-checked': state.cityAutoSI }"></view>
            <text class="checkbox-label">自动同步城市社保公积金缴费基数与比例</text>
          </view>
        </view>
      </view>

      <!-- 收入信息 -->
      <view class="card animate-in animate-in--3">
        <view class="card__title">收入信息</view>

        <view class="form-group">
          <view class="form-label">税前月工资</view>
          <view class="input-wrap">
            <input class="input" type="digit" :value="state.salary" placeholder="请输入税前月工资" @input="onSalaryInput" />
            <view class="input-wrap__suffix">元/月</view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">年终奖（可选）</view>
          <view class="input-wrap">
            <input class="input" type="digit" :value="state.bonus" placeholder="请输入年终奖金额" @input="onBonusInput" />
            <view class="input-wrap__suffix">元</view>
          </view>
        </view>

        <view v-if="bonusNum > 0" class="form-group form-group--last">
          <view class="form-label">年终奖计税方式</view>
          <view class="radio-group">
            <view class="radio-item" @click="setBonusMethod('separate')">
              <view class="radio" :class="{ 'is-checked': state.bonusMethod === 'separate' }"></view>
              <text class="radio-label" :class="{ active: state.bonusMethod === 'separate' }">单独计税</text>
            </view>
            <view class="radio-item" @click="setBonusMethod('combined')">
              <view class="radio" :class="{ 'is-checked': state.bonusMethod === 'combined' }"></view>
              <text class="radio-label" :class="{ active: state.bonusMethod === 'combined' }">并入综合所得</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 五险一金 -->
      <view class="card animate-in animate-in--4">
        <view class="card__title">五险一金</view>

        <view class="form-group">
          <view class="form-label">
            <view class="checkbox-item" @click="toggleSiAutoBase">
              <view class="checkbox" :class="{ 'is-checked': state.siAutoBase }"></view>
              <text class="checkbox-label">社保公积金缴费基数</text>
            </view>
          </view>
          <view class="input-wrap">
            <input class="input" type="digit" :value="state.siBase" :disabled="state.siAutoBase" placeholder="缴费基数" @input="onSiBaseInput" />
            <view class="input-wrap__suffix">元/月</view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">住房公积金缴存比例</view>
          <picker class="select-picker" mode="selector" :range="hfRateLabels" :value="hfRateIndex" @change="onHfRateChange">
            <view class="select">{{ hfRateDisplay }}</view>
          </picker>
        </view>

        <view class="form-group">
          <view class="checkbox-item" @click="toggleSiCustom">
            <view class="checkbox" :class="{ 'is-checked': state.siCustom }"></view>
            <text class="checkbox-label">自定义五险一金总额（不使用默认比例）</text>
          </view>
        </view>

        <view v-if="state.siCustom" class="form-group">
          <view class="input-wrap">
            <input class="input" type="digit" :value="state.siCustomAmount" placeholder="请输入每月五险一金个人缴纳总额" @input="onSiCustomAmountInput" />
            <view class="input-wrap__suffix">元/月</view>
          </view>
        </view>

        <view v-else class="si-detail">
          <view class="si-detail__row">
            <text class="si-detail__label">养老保险（{{ (cityData.pension * 100).toFixed(0) }}%）</text>
            <text class="si-detail__value">¥{{ fmt(si.pension) }}</text>
          </view>
          <view class="si-detail__row">
            <text class="si-detail__label">医疗保险（{{ medicalLabel }}）</text>
            <text class="si-detail__value">¥{{ fmt(si.medical + si.medicalExtra) }}</text>
          </view>
          <view class="si-detail__row">
            <text class="si-detail__label">失业保险（{{ (cityData.unemployment * 100).toFixed(1) }}%）</text>
            <text class="si-detail__value">¥{{ fmt(si.unemployment) }}</text>
          </view>
          <view class="si-detail__row">
            <text class="si-detail__label">住房公积金</text>
            <text class="si-detail__value">¥{{ fmt(si.hf) }}</text>
          </view>
          <view class="si-detail__row si-detail__total">
            <text class="si-detail__label">个人缴纳合计</text>
            <text class="si-detail__value">¥{{ fmt(si.total) }}</text>
          </view>
        </view>
      </view>

      <!-- 专项附加扣除（可折叠） -->
      <view class="card animate-in animate-in--5" :class="{ 'is-open': state.dedCollapseOpen }">
        <view class="card__collapse-trigger" @click="toggleDedCollapse">
          <view class="card__title card__title--flex">专项附加扣除</view>
          <view class="card__collapse-summary">已启用 {{ dedEnabledCount }} 项</view>
          <view class="collapse__arrow" :class="{ 'is-open': state.dedCollapseOpen }">
            <text class="arrow-glyph">▾</text>
          </view>
        </view>

        <view v-show="state.dedCollapseOpen" class="card__collapse-body">
          <view class="card__collapse-inner">

            <!-- 子女教育 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('childEdu')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.childEdu.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">子女教育</view>
                <view class="deduction-row__desc">满3岁至全日制学历教育，2000元/月/子女</view>
                <view class="deduction-row__input">
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" type="number" :value="state.deductionCount.childEdu" @input="onDedCountInput('childEdu', $event)" />
                    <view class="input-wrap__suffix">个子女</view>
                  </view>
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" :value="dedMonthly.childEdu" disabled />
                    <view class="input-wrap__suffix">元/月</view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 3岁以下婴幼儿照护 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('infant')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.infant.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">3岁以下婴幼儿照护</view>
                <view class="deduction-row__desc">3周岁以下，2000元/月/婴幼儿</view>
                <view class="deduction-row__input">
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" type="number" :value="state.deductionCount.infant" @input="onDedCountInput('infant', $event)" />
                    <view class="input-wrap__suffix">个婴幼儿</view>
                  </view>
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" :value="dedMonthly.infant" disabled />
                    <view class="input-wrap__suffix">元/月</view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 继续教育 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('contEdu')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.contEdu.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">继续教育</view>
                <view class="deduction-row__desc">学历教育400元/月（最长48个月），职业资格3600元/年</view>
                <view class="deduction-row__input">
                  <picker class="select-picker select-picker--flex" mode="selector" :range="contEduLabels" :value="contEduIndex" @change="onContEduTypeChange">
                    <view class="select select--sm">{{ contEduDisplay }}</view>
                  </picker>
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" :value="dedMonthly.contEdu" disabled />
                    <view class="input-wrap__suffix">元/月</view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 住房贷款利息 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('loan')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.loan.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">住房贷款利息</view>
                <view class="deduction-row__desc">首套住房贷款，1000元/月，最长240个月</view>
                <view class="deduction-row__text">
                  <text class="deduction-static-value">{{ dedMonthly.loan }}</text>
                  <text class="deduction-static-unit">元/月</text>
                </view>
              </view>
            </view>

            <!-- 住房租金 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('rent')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.rent.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">住房租金</view>
                <view class="deduction-row__desc">与住房贷款利息不可同时享受，扣除标准按所在城市确定</view>
                <view class="deduction-row__text">
                  <text class="deduction-city-label">{{ rentCityLabel }}</text>
                  <text class="deduction-static-value">{{ dedMonthly.rent }}</text>
                  <text class="deduction-static-unit">元/月</text>
                </view>
              </view>
            </view>

            <!-- 赡养老人 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('elder')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.elder.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">赡养老人</view>
                <view class="deduction-row__desc">被赡养人年满60周岁</view>
                <view class="deduction-row__input">
                  <picker class="select-picker select-picker--flex" mode="selector" :range="elderLabels" :value="elderIndex" @change="onElderTypeChange">
                    <view class="select select--sm">{{ elderDisplay }}</view>
                  </picker>
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" :value="dedMonthly.elder" disabled />
                    <view class="input-wrap__suffix">元/月</view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 大病医疗 -->
            <view class="deduction-row">
              <view class="deduction-row__checkbox">
                <view class="checkbox-item" @click="toggleDed('medical')">
                  <view class="checkbox" :class="{ 'is-checked': state.deductions.medical.enabled }"></view>
                </view>
              </view>
              <view class="deduction-row__main">
                <view class="deduction-row__label">大病医疗</view>
                <view class="deduction-row__desc">医保目录内自付超15000元部分据实扣除，年上限80000元（年度汇算时扣除）</view>
                <view class="deduction-row__input">
                  <view class="input-wrap input-wrap--flex">
                    <input class="input input--sm" type="digit" :value="state.deductionCount.medical" placeholder="年度自付金额" @input="onDedCountInput('medical', $event)" />
                    <view class="input-wrap__suffix">元/年</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 计算按钮 -->
      <view class="calc-btn-wrap animate-in animate-in--6">
        <button class="btn btn--primary" @click="onCalcClick">计算个税</button>
      </view>

      <!-- 计算说明（折叠面板） -->
      <view class="collapse" :class="{ 'is-open': noteOpen }">
        <view class="collapse__header" @click="noteOpen = !noteOpen">
          <view class="collapse__header-left">
            <view class="collapse__header-icon">ℹ</view>
            <text>计算说明与税率表</text>
          </view>
          <view class="collapse__arrow" :class="{ 'is-open': noteOpen }">
            <text class="arrow-glyph">▾</text>
          </view>
        </view>
        <view v-show="noteOpen" class="collapse__body">
          <view class="collapse__inner">
            <view class="notice">
              <view class="notice__text">
                <view class="notice__p"><text class="strong">累计预扣法：</text>每月按累计应纳税所得额计算预扣税额，年初月份扣税较少，年末随累计收入跨档逐渐增多。</view>
                <view class="notice__p"><text class="strong">免征额：</text>5000元/月（60000元/年）。</view>
                <view class="notice__p"><text class="strong">五险一金：</text>个人缴纳部分税前扣除，缴费比例及基数上下限按所选城市确定，公积金比例5%-12%可选。</view>
                <view class="notice__p"><text class="strong">年终奖单独计税：</text>将奖金÷12确定适用税率，政策执行至2027年12月31日。</view>
                <view class="notice__p"><text class="strong">住房贷款利息与住房租金不可同时享受。</text></view>
              </view>
            </view>

            <view class="sub-title">综合所得年度税率表（累计预扣预缴同表）</view>
            <view class="tax-table">
              <view class="tax-table__row tax-table__row--head">
                <view class="tax-table__cell tax-table__cell--left">级数</view>
                <view class="tax-table__cell">全年应纳税所得额</view>
                <view class="tax-table__cell">税率</view>
                <view class="tax-table__cell">速算扣除数</view>
              </view>
              <view v-for="row in annualTableRows" :key="'a' + row.idx" class="tax-table__row">
                <view class="tax-table__cell tax-table__cell--left">{{ row.idx }}</view>
                <view class="tax-table__cell">{{ row.range }}</view>
                <view class="tax-table__cell">{{ row.rate }}</view>
                <view class="tax-table__cell">{{ row.quick }}</view>
              </view>
            </view>

            <view class="sub-title sub-title--mt">全年一次性奖金税率表（÷12后查找）</view>
            <view class="tax-table">
              <view class="tax-table__row tax-table__row--head">
                <view class="tax-table__cell tax-table__cell--left">级数</view>
                <view class="tax-table__cell">月均奖金额</view>
                <view class="tax-table__cell">税率</view>
                <view class="tax-table__cell">速算扣除数</view>
              </view>
              <view v-for="row in bonusTableRows" :key="'b' + row.idx" class="tax-table__row">
                <view class="tax-table__cell tax-table__cell--left">{{ row.idx }}</view>
                <view class="tax-table__cell">{{ row.range }}</view>
                <view class="tax-table__cell">{{ row.rate }}</view>
                <view class="tax-table__cell">{{ row.quick }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 页脚 -->
      <view class="footer">
        <view class="footer__disclaimer">
          <view class="footer__disclaimer-title">⚠ 免责声明</view>
          <view class="footer__disclaimer-text">
            本计算器计算结果仅供参考，实际应缴税额以税务机关核定为准。五险一金缴费比例因地区而异，本工具采用常见默认比例。年终奖单独计税政策执行至2027年12月31日。如有疑问，请咨询当地税务机关或拨打纳税服务热线 12366。
          </view>
        </view>
        <view class="footer__brand">✦ 个税计算器</view>
        <view class="footer__line">数据来源：国家税务总局 2026年最新税率表</view>
        <view class="footer__line footer__line--mt">仅供参考，具体以官方政策为准 © {{ year }}</view>
      </view>
    </view>

    <!-- 结果模态框 -->
    <view class="modal" :class="{ 'is-open': modalOpen }">
      <view class="modal__overlay" @click="closeModal"></view>
      <view class="modal__card">
        <view class="modal__close" @click="closeModal">✕</view>
        <scroll-view scroll-y class="modal__scroll" v-if="result">
          <view class="modal__title">个税计算结果</view>
          <view class="result">
            <!-- 主要结果 -->
            <view class="result__header">
              <view class="result__label">月到手工资（年均）</view>
              <view class="result__value">{{ fmt(Math.round(result.monthlyAfterTax)) }}</view>
              <view class="result__sub">
                月均个税 <text class="strong-accent">{{ fmt(Math.round(result.monthlyAvgTax)) }}</text> 元　|　有效税率 <text class="strong-accent">{{ result.effectiveRatePct.toFixed(2) }}%</text>
              </view>
            </view>

            <!-- 关键指标网格 -->
            <view class="result__grid">
              <view class="result__item">
                <view class="result__item-label">月均应纳税所得额</view>
                <view class="result__item-value result__item-value--primary">¥{{ fmt(Math.round(result.monthlyTaxable)) }}</view>
              </view>
              <view class="result__item">
                <view class="result__item-label">月均个税</view>
                <view class="result__item-value result__item-value--danger">¥{{ fmt(Math.round(result.monthlyAvgTax)) }}</view>
              </view>
              <view class="result__item">
                <view class="result__item-label">全年个税合计</view>
                <view class="result__item-value result__item-value--danger">¥{{ fmt(Math.round(result.totalAnnualTax)) }}</view>
              </view>
              <view class="result__item">
                <view class="result__item-label">全年到手收入</view>
                <view class="result__item-value result__item-value--success">¥{{ fmt(Math.round(result.annualAfterTax)) }}</view>
              </view>
              <view v-if="result.bonus > 0" class="result__item result__item--full">
                <view class="result__item-label">年终奖个税（{{ result.bonusMethodLabel }}）</view>
                <view class="result__item-value result__item-value--warning">¥{{ fmt(Math.round(result.bonusTax)) }}</view>
              </view>
              <view v-if="result.medReimbursement > 0" class="result__item result__item--full">
                <view class="result__item-label">大病医疗汇算退税</view>
                <view class="result__item-value result__item-value--success">¥{{ fmt(Math.round(result.medReimbursement)) }}</view>
              </view>
            </view>

            <!-- 月度税收柱状图 -->
            <view class="result__section-title">月度税额分布</view>
            <view class="chart">
              <view v-for="bar in result.chartBars" :key="bar.month" class="chart__bar-wrap">
                <view class="chart__bar" :style="{ height: bar.heightPct + '%' }"></view>
                <text class="chart__month">{{ bar.month }}</text>
              </view>
            </view>

            <!-- 扣除明细 -->
            <view class="result__section-title">月度扣除明细</view>
            <view class="breakdown">
              <view
                v-for="(row, i) in result.breakdownRows"
                :key="i"
                class="breakdown__row"
                :class="{ 'breakdown__row--total': row.isTotal }"
              >
                <text class="breakdown__label">{{ row.label }}</text>
                <text class="breakdown__value" :class="{ 'is-tax': row.isTax }">{{ fmtRow(row.value) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="modal__actions">
          <button class="btn btn--primary modal__btn" @click="closeModal">知道了</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";

/* ========== 税率表 ========== */
// 综合所得年度税率表（累计预扣预缴同表）
const ANNUAL_TAX_TABLE = [
  { max: 36000, rate: 0.03, quick: 0 },
  { max: 144000, rate: 0.10, quick: 2520 },
  { max: 300000, rate: 0.20, quick: 16920 },
  { max: 420000, rate: 0.25, quick: 31920 },
  { max: 660000, rate: 0.30, quick: 52920 },
  { max: 960000, rate: 0.35, quick: 85920 },
  { max: Infinity, rate: 0.45, quick: 181920 },
];

// 全年一次性奖金税率表（奖金÷12后查找）
const BONUS_TAX_TABLE = [
  { max: 3000, rate: 0.03, quick: 0 },
  { max: 12000, rate: 0.10, quick: 210 },
  { max: 25000, rate: 0.20, quick: 1410 },
  { max: 35000, rate: 0.25, quick: 2660 },
  { max: 55000, rate: 0.30, quick: 4410 },
  { max: 80000, rate: 0.35, quick: 7160 },
  { max: Infinity, rate: 0.45, quick: 15160 },
];

// 五险一金个人缴费比例（默认值，部分城市有差异）
const SI_RATES_DEFAULT = {
  pension: 0.08,
  medical: 0.02,
  unemployment: 0.005,
};

// 城市数据：租金扣除档位 + 社保公积金参数
const CITY_DATA = {
  // 直辖市
  beijing: { name: "北京", rentTier: 1, siBaseMin: 7162, siBaseMax: 35811, hfBaseMin: 2540, hfBaseMax: 35811, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, medicalExtra: 3, unemployment: 0.005 },
  shanghai: { name: "上海", rentTier: 1, siBaseMin: 7460, siBaseMax: 37302, hfBaseMin: 2690, hfBaseMax: 37302, hfRateDefault: 0.07, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  tianjin: { name: "天津", rentTier: 1, siBaseMin: 4492, siBaseMax: 24207, hfBaseMin: 2246, hfBaseMax: 24207, hfRateDefault: 0.11, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  chongqing: { name: "重庆", rentTier: 1, siBaseMin: 4465, siBaseMax: 23960, hfBaseMin: 2233, hfBaseMax: 23960, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  // 省会/首府
  shijiazhuang: { name: "石家庄", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  taiyuan: { name: "太原", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  huhehaote: { name: "呼和浩特", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  shenyang: { name: "沈阳", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  changchun: { name: "长春", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  haerbin: { name: "哈尔滨", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  nanjing: { name: "南京", rentTier: 1, siBaseMin: 4539, siBaseMax: 24003, hfBaseMin: 2265, hfBaseMax: 24003, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  hangzhou: { name: "杭州", rentTier: 1, siBaseMin: 4986, siBaseMax: 25299, hfBaseMin: 2490, hfBaseMax: 40694, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  hefei: { name: "合肥", rentTier: 1, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  fuzhou: { name: "福州", rentTier: 1, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  nanchang: { name: "南昌", rentTier: 1, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  jinan: { name: "济南", rentTier: 1, siBaseMin: 4368, siBaseMax: 22576, hfBaseMin: 2184, hfBaseMax: 22576, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  zhengzhou: { name: "郑州", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  wuhan: { name: "武汉", rentTier: 1, siBaseMin: 4283, siBaseMax: 23531, hfBaseMin: 2188, hfBaseMax: 23531, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  changsha: { name: "长沙", rentTier: 1, siBaseMin: 4434, siBaseMax: 22912, hfBaseMin: 2217, hfBaseMax: 22912, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  guangzhou: { name: "广州", rentTier: 1, siBaseMin: 5510, siBaseMax: 27549, hfBaseMin: 2500, hfBaseMax: 39828, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.002 },
  nanning: { name: "南宁", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  haikou: { name: "海口", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  chengdu: { name: "成都", rentTier: 1, siBaseMin: 4588, siBaseMax: 22791, hfBaseMin: 2288, hfBaseMax: 30564, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  guiyang: { name: "贵阳", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  kunming: { name: "昆明", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  lasa: { name: "拉萨", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  xian: { name: "西安", rentTier: 1, siBaseMin: 4443, siBaseMax: 22965, hfBaseMin: 2222, hfBaseMax: 22965, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  lanzhou: { name: "兰州", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  xining: { name: "西宁", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  yinchuan: { name: "银川", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  wulumuqi: { name: "乌鲁木齐", rentTier: 1, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  // 计划单列市
  dalian: { name: "大连", rentTier: 1, siBaseMin: 4368, siBaseMax: 22576, hfBaseMin: 2184, hfBaseMax: 22576, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  qingdao: { name: "青岛", rentTier: 1, siBaseMin: 4368, siBaseMax: 22576, hfBaseMin: 2184, hfBaseMax: 22576, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  ningbo: { name: "宁波", rentTier: 1, siBaseMin: 4327, siBaseMax: 22365, hfBaseMin: 2164, hfBaseMax: 22365, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  xiamen: { name: "厦门", rentTier: 1, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  shenzhen: { name: "深圳", rentTier: 1, siBaseMin: 6733, siBaseMax: 33666, hfBaseMin: 2360, hfBaseMax: 44265, hfRateDefault: 0.05, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  // 第二档（1100元）主要城市
  suzhou: { name: "苏州", rentTier: 2, siBaseMin: 4515, siBaseMax: 24003, hfBaseMin: 2265, hfBaseMax: 24003, hfRateDefault: 0.08, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  wuxi: { name: "无锡", rentTier: 2, siBaseMin: 4515, siBaseMax: 24003, hfBaseMin: 2265, hfBaseMax: 24003, hfRateDefault: 0.08, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  foshan: { name: "佛山", rentTier: 2, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.002 },
  dongguan: { name: "东莞", rentTier: 2, siBaseMin: 4333, siBaseMax: 22397, hfBaseMin: 2167, hfBaseMax: 22397, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.002 },
  wenzhou: { name: "温州", rentTier: 2, siBaseMin: 4327, siBaseMax: 22365, hfBaseMin: 2164, hfBaseMax: 22365, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  zhuhai: { name: "珠海", rentTier: 2, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  xuzhou: { name: "徐州", rentTier: 2, siBaseMin: 4515, siBaseMax: 24003, hfBaseMin: 2265, hfBaseMax: 24003, hfRateDefault: 0.08, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  yantai: { name: "烟台", rentTier: 2, siBaseMin: 4368, siBaseMax: 22576, hfBaseMin: 2184, hfBaseMax: 22576, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  tangshan: { name: "唐山", rentTier: 2, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  luoyang: { name: "洛阳", rentTier: 2, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  xiangyang: { name: "襄阳", rentTier: 2, siBaseMin: 4283, siBaseMax: 23531, hfBaseMin: 2188, hfBaseMax: 23531, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  yichang: { name: "宜昌", rentTier: 2, siBaseMin: 4283, siBaseMax: 23531, hfBaseMin: 2188, hfBaseMax: 23531, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  zhuzhou: { name: "株洲", rentTier: 2, siBaseMin: 4434, siBaseMax: 22912, hfBaseMin: 2217, hfBaseMax: 22912, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  huizhou: { name: "惠州", rentTier: 2, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  jiangmen: { name: "江门", rentTier: 2, siBaseMin: 4291, siBaseMax: 22172, hfBaseMin: 2146, hfBaseMax: 22172, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  liuzhou: { name: "柳州", rentTier: 2, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  guilin: { name: "桂林", rentTier: 2, siBaseMin: 4405, siBaseMax: 22762, hfBaseMin: 2203, hfBaseMax: 22762, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  nanchong: { name: "南充", rentTier: 2, siBaseMin: 4588, siBaseMax: 22791, hfBaseMin: 2288, hfBaseMax: 30564, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  mianyang: { name: "绵阳", rentTier: 2, siBaseMin: 4588, siBaseMax: 22791, hfBaseMin: 2288, hfBaseMax: 30564, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  baoji: { name: "宝鸡", rentTier: 2, siBaseMin: 4443, siBaseMax: 22965, hfBaseMin: 2222, hfBaseMax: 22965, hfRateDefault: 0.12, pension: 0.08, medical: 0.02, unemployment: 0.005 },
  // 第三档
  other_small: { name: "其他城市", rentTier: 3, siBaseMin: 4000, siBaseMax: 20000, hfBaseMin: 2000, hfBaseMax: 20000, hfRateDefault: 0.08, pension: 0.08, medical: 0.02, unemployment: 0.005 },
};

// 城市顺序（保留原 H5 optgroup 分组顺序，扁平化为 picker 列表）
const CITY_ORDER = [
  // 直辖市（第一档·1500元）
  "beijing", "shanghai", "tianjin", "chongqing",
  // 省会/首府城市（第一档·1500元）
  "shijiazhuang", "taiyuan", "huhehaote", "shenyang", "changchun", "haerbin",
  "nanjing", "hangzhou", "hefei", "fuzhou", "nanchang", "jinan", "zhengzhou",
  "wuhan", "changsha", "guangzhou", "nanning", "haikou", "chengdu", "guiyang",
  "kunming", "lasa", "xian", "lanzhou", "xining", "yinchuan", "wulumuqi",
  // 计划单列市（第一档·1500元）
  "dalian", "qingdao", "ningbo", "xiamen", "shenzhen",
  // 其他城市（第二档·1100元）
  "suzhou", "wuxi", "foshan", "dongguan", "wenzhou", "zhuhai", "xuzhou",
  "yantai", "tangshan", "luoyang", "xiangyang", "yichang", "zhuzhou",
  "huizhou", "jiangmen", "liuzhou", "guilin", "nanchong", "mianyang", "baoji",
  // 其他城市（第三档·800元）
  "other_small",
];

const cityList = CITY_ORDER.map((k) => ({ value: k, name: CITY_DATA[k].name }));
const cityNames = cityList.map((c) => c.name);

// 租金扣除档位对应金额
const RENT_TIER_AMOUNT = { 1: 1500, 2: 1100, 3: 800 };
const RENT_TIER_LABEL = { 1: "第一档", 2: "第二档", 3: "第三档" };

// 基本减除费用
const MONTHLY_EXEMPTION = 5000;
const ANNUAL_EXEMPTION = 60000;

// 公积金比例选项
const hfRateOptions = [0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12];
const hfRateLabels = ["5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%"];

// 继续教育类型选项
const contEduOptions = [
  { value: "degree", label: "学历教育（400元/月）" },
  { value: "cert", label: "职业资格（3600元/年）" },
];
const contEduLabels = contEduOptions.map((o) => o.label);

// 赡养老人类型选项
const elderOptions = [
  { value: "only", label: "独生子女（3000元/月）" },
  { value: "share", label: "非独生子女（分摊≤1500元/月）" },
];
const elderLabels = elderOptions.map((o) => o.label);

// 税率表展示数据
const annualTableRows = [
  { idx: 1, range: "≤36,000", rate: "3%", quick: "0" },
  { idx: 2, range: "36,000~144,000", rate: "10%", quick: "2,520" },
  { idx: 3, range: "144,000~300,000", rate: "20%", quick: "16,920" },
  { idx: 4, range: "300,000~420,000", rate: "25%", quick: "31,920" },
  { idx: 5, range: "420,000~660,000", rate: "30%", quick: "52,920" },
  { idx: 6, range: "660,000~960,000", rate: "35%", quick: "85,920" },
  { idx: 7, range: ">960,000", rate: "45%", quick: "181,920" },
];

const bonusTableRows = [
  { idx: 1, range: "≤3,000", rate: "3%", quick: "0" },
  { idx: 2, range: "3,000~12,000", rate: "10%", quick: "210" },
  { idx: 3, range: "12,000~25,000", rate: "20%", quick: "1,410" },
  { idx: 4, range: "25,000~35,000", rate: "25%", quick: "2,660" },
  { idx: 5, range: "35,000~55,000", rate: "30%", quick: "4,410" },
  { idx: 6, range: "55,000~80,000", rate: "35%", quick: "7,160" },
  { idx: 7, range: ">80,000", rate: "45%", quick: "15,160" },
];

/* ========== 状态 ========== */
const state = reactive({
  city: "hangzhou",
  cityAutoSI: true,
  salary: "15000",
  bonus: "0",
  bonusMethod: "separate",
  siBase: "15000",
  siAutoBase: true,
  hfRate: 0.12,
  siCustom: false,
  siCustomAmount: "0",
  deductionCount: {
    childEdu: "1",
    infant: "1",
    medical: "0",
  },
  deductionType: {
    contEdu: "degree",
    elder: "only",
  },
  deductions: {
    childEdu: { enabled: true },
    infant: { enabled: false },
    contEdu: { enabled: false },
    loan: { enabled: false },
    rent: { enabled: false },
    elder: { enabled: true },
    medical: { enabled: false },
  },
  dedCollapseOpen: true,
});

const noteOpen = ref(false);
const modalOpen = ref(false);
const result = ref(null);
const year = ref(new Date().getFullYear());

/* ========== 工具函数 ========== */
function fmt(n) {
  if (n === 0) return "0";
  if (!n || isNaN(n)) return "—";
  return Number(n).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
}

function fmtRow(v) {
  const sign = v < 0 ? "-" : "";
  return sign + "¥" + fmt(Math.abs(Math.round(v)));
}

function toNum(v) {
  const n = Number(v);
  return isNaN(n) ? 0 : Math.max(0, n);
}

/* ========== 计算属性 ========== */
const cityData = computed(() => CITY_DATA[state.city] || CITY_DATA.other_small);

const cityIndex = computed(() => {
  const i = cityList.findIndex((c) => c.value === state.city);
  return i < 0 ? 0 : i;
});

const currentCityName = computed(() => cityList[cityIndex.value].name);

const rentCityLabel = computed(() => {
  const city = cityData.value;
  return city.name + "（" + RENT_TIER_LABEL[city.rentTier] + "·" + RENT_TIER_AMOUNT[city.rentTier] + "元）";
});

const rentAmount = computed(() => RENT_TIER_AMOUNT[cityData.value.rentTier]);

const salaryNum = computed(() => toNum(state.salary));
const bonusNum = computed(() => toNum(state.bonus));
const siCustomAmountNum = computed(() => toNum(state.siCustomAmount));

const hfRateIndex = computed(() => {
  const i = hfRateOptions.indexOf(state.hfRate);
  return i < 0 ? 7 : i;
});
const hfRateDisplay = computed(() => hfRateLabels[hfRateIndex.value]);

const contEduIndex = computed(() => {
  const i = contEduOptions.findIndex((o) => o.value === state.deductionType.contEdu);
  return i < 0 ? 0 : i;
});
const contEduDisplay = computed(() => contEduLabels[contEduIndex.value]);

const elderIndex = computed(() => {
  const i = elderOptions.findIndex((o) => o.value === state.deductionType.elder);
  return i < 0 ? 0 : i;
});
const elderDisplay = computed(() => elderLabels[elderIndex.value]);

// 专项附加扣除月度金额（按当前选择实时计算）
const dedMonthly = computed(() => ({
  childEdu: toNum(state.deductionCount.childEdu) * 2000,
  infant: toNum(state.deductionCount.infant) * 2000,
  contEdu:
    state.deductionType.contEdu === "degree"
      ? 400
      : Math.round((3600 / 12) * 10) / 10,
  loan: 1000,
  rent: rentAmount.value,
  elder: state.deductionType.elder === "only" ? 3000 : 1500,
}));

const dedEnabledCount = computed(() => {
  let c = 0;
  for (const k in state.deductions) {
    if (state.deductions[k].enabled) c++;
  }
  return c;
});

// 五险一金计算
const si = computed(() => {
  const city = cityData.value;
  if (state.siCustom) {
    return {
      pension: 0,
      medical: 0,
      unemployment: 0,
      hf: 0,
      medicalExtra: 0,
      total: siCustomAmountNum.value,
    };
  }
  // 社保基数夹在上下限之间
  const rawBase = toNum(state.siBase);
  const base = Math.max(city.siBaseMin, Math.min(rawBase, city.siBaseMax));
  // 公积金基数可能与社保基数不同（部分城市公积金上限更高）
  const hfBase = Math.max(city.hfBaseMin, Math.min(rawBase, city.hfBaseMax));
  const pension = base * city.pension;
  const medical = base * city.medical;
  const unemployment = base * city.unemployment;
  const medicalExtra = city.medicalExtra || 0;
  const hf = hfBase * state.hfRate;
  return {
    pension,
    medical,
    unemployment,
    medicalExtra,
    hf,
    total: pension + medical + unemployment + medicalExtra + hf,
  };
});

const medicalLabel = computed(() => {
  const city = cityData.value;
  const base = (city.medical * 100).toFixed(0) + "%";
  const extra = si.value.medicalExtra;
  return extra > 0 ? base + "+" + extra + "元" : base;
});

// 专项附加扣除汇总
const deductions = computed(() => {
  const items = [
    { key: "childEdu", label: "子女教育", amount: state.deductions.childEdu.enabled ? dedMonthly.value.childEdu : 0 },
    { key: "infant", label: "3岁以下婴幼儿照护", amount: state.deductions.infant.enabled ? dedMonthly.value.infant : 0 },
    { key: "contEdu", label: "继续教育", amount: state.deductions.contEdu.enabled ? dedMonthly.value.contEdu : 0 },
    { key: "loan", label: "住房贷款利息", amount: state.deductions.loan.enabled ? dedMonthly.value.loan : 0 },
    { key: "rent", label: "住房租金", amount: state.deductions.rent.enabled ? dedMonthly.value.rent : 0 },
    { key: "elder", label: "赡养老人", amount: state.deductions.elder.enabled ? dedMonthly.value.elder : 0 },
  ];
  const monthlyTotal = items.reduce((s, i) => s + i.amount, 0);
  const annualMedical = state.deductions.medical.enabled
    ? Math.max(0, Math.min(toNum(state.deductionCount.medical) - 15000, 80000))
    : 0;
  return { items, monthlyTotal, annualMedical };
});

/* ========== 税额计算 ========== */
function findBracket(taxable, table) {
  for (const b of table) {
    if (taxable <= b.max) return b;
  }
  return table[table.length - 1];
}

function calcAnnualTax(annualTaxableIncome) {
  if (annualTaxableIncome <= 0) return 0;
  const b = findBracket(annualTaxableIncome, ANNUAL_TAX_TABLE);
  return annualTaxableIncome * b.rate - b.quick;
}

function calcBonusTax(bonus) {
  if (bonus <= 0) return 0;
  const monthly = bonus / 12;
  const b = findBracket(monthly, BONUS_TAX_TABLE);
  return bonus * b.rate - b.quick;
}

function calculateTax() {
  const salary = salaryNum.value;
  const bonus = bonusNum.value;
  const siv = si.value;
  const ded = deductions.value;

  // 月度可扣除金额（不含大病医疗，大病医疗仅在年度汇算时扣除）
  const monthlyDeductions = siv.total + ded.monthlyTotal;
  // 月度应纳税所得额（月度预扣用）
  const monthlyTaxable = Math.max(0, salary - MONTHLY_EXEMPTION - monthlyDeductions);
  // 年度预扣应纳税所得额
  const annualTaxable = monthlyTaxable * 12;
  // 年度汇算应纳税所得额（扣除大病医疗）
  const annualTaxableAfterMed = Math.max(0, annualTaxable - ded.annualMedical);

  // 累计预扣法：按月计算（月度预扣不包含大病医疗）
  const monthlyTaxes = [];
  let cumTaxable = 0;
  let cumTaxPaid = 0;

  for (let m = 1; m <= 12; m++) {
    cumTaxable += monthlyTaxable;
    const cumTax = calcAnnualTax(cumTaxable);
    const monthTax = Math.max(0, cumTax - cumTaxPaid);
    cumTaxPaid += monthTax;
    monthlyTaxes.push({
      month: m,
      tax: monthTax,
      afterTax: salary - siv.total - monthTax,
    });
  }

  // 年度预扣个税合计（12个月预扣总额，大病医疗为0时等于年度汇算税额）
  const annualWithholdingTax = monthlyTaxes.reduce((s, m) => s + m.tax, 0);

  // 年度汇算后实际工资个税（扣除大病医疗）
  const annualSalaryTax = calcAnnualTax(annualTaxableAfterMed);

  // 大病医疗汇算退税额（预扣多缴的部分）
  const medReimbursement = annualWithholdingTax - annualSalaryTax;

  // 年终奖个税
  let bonusTaxResult = 0;
  let bonusMethodLabel = "";
  if (bonus > 0) {
    if (state.bonusMethod === "separate") {
      bonusTaxResult = calcBonusTax(bonus);
      bonusMethodLabel = "单独计税";
    } else {
      // 并入综合所得（使用年度汇算后的应纳税所得额）
      const combinedTaxable = annualTaxableAfterMed + bonus;
      const combinedTax = calcAnnualTax(combinedTaxable);
      bonusTaxResult = combinedTax - annualSalaryTax;
      bonusMethodLabel = "并入综合所得";
    }
  }

  const totalAnnualTax = annualSalaryTax + bonusTaxResult;
  const annualSalary = salary * 12;
  const annualSI = siv.total * 12;
  const annualAfterTax = annualSalary + bonus - annualSI - totalAnnualTax;
  // 月均个税（仅工资部分，不含年终奖）
  const monthlyAvgTax = annualSalaryTax / 12;
  // 月到手工资（年均，仅工资部分）
  const monthlyAfterTax = (annualSalary - annualSI - annualSalaryTax) / 12;
  const totalIncome = annualSalary + bonus;
  const effectiveRatePct = totalIncome > 0 ? (totalAnnualTax / totalIncome) * 100 : 0;

  // 月度柱状图数据
  const maxTax = Math.max(...monthlyTaxes.map((m) => m.tax), 1);
  const chartBars = monthlyTaxes.map((m) => ({
    month: m.month,
    tax: m.tax,
    heightPct: Math.max(2, (m.tax / maxTax) * 100),
  }));

  // 扣除明细行
  const breakdownRows = [
    { label: "税前月薪", value: salary },
    { label: "五险一金（个人）", value: -siv.total },
    { label: "基本减除费用", value: -MONTHLY_EXEMPTION },
  ];
  ded.items.filter((i) => i.amount > 0).forEach((i) => {
    breakdownRows.push({ label: i.label, value: -i.amount });
  });
  breakdownRows.push({
    label: "月度应纳税所得额（预扣）",
    value: monthlyTaxable,
    isTotal: true,
  });
  if (ded.annualMedical > 0) {
    breakdownRows.push({ label: "大病医疗（年度汇算扣除）", value: -ded.annualMedical / 12 });
    breakdownRows.push({
      label: "年度汇算应纳税所得额",
      value: monthlyTaxable - ded.annualMedical / 12,
      isTotal: true,
    });
  }
  breakdownRows.push({ label: "月均个税（汇算后）", value: -monthlyAvgTax, isTax: true });

  return {
    monthlyTaxable,
    monthlyTaxes,
    annualWithholdingTax,
    annualSalaryTax,
    medReimbursement,
    bonusTax: bonusTaxResult,
    bonusMethodLabel,
    totalAnnualTax,
    annualAfterTax,
    monthlyAvgTax,
    monthlyAfterTax,
    effectiveRatePct,
    si: siv,
    ded,
    salary,
    bonus,
    annualSalary,
    annualSI,
    chartBars,
    breakdownRows,
  };
}

/* ========== 事件处理 ========== */
function syncCityData() {
  const city = cityData.value;
  state.hfRate = city.hfRateDefault;
  if (state.siAutoBase) {
    const base = Math.max(city.siBaseMin, Math.min(salaryNum.value, city.siBaseMax));
    state.siBase = String(Math.round(base));
  }
}

function onCityChange(e) {
  const idx = Number(e.detail.value);
  state.city = cityList[idx].value;
  if (state.cityAutoSI) {
    syncCityData();
  }
}

function onCityAutoSIToggle() {
  state.cityAutoSI = !state.cityAutoSI;
  if (state.cityAutoSI) {
    syncCityData();
  }
}

function onSalaryInput(e) {
  state.salary = e.detail.value;
  if (state.siAutoBase) {
    const city = cityData.value;
    const base = Math.max(city.siBaseMin, Math.min(salaryNum.value, city.siBaseMax));
    state.siBase = String(Math.round(base));
  }
}

function onBonusInput(e) {
  state.bonus = e.detail.value;
}

function setBonusMethod(m) {
  state.bonusMethod = m;
}

function toggleSiAutoBase() {
  state.siAutoBase = !state.siAutoBase;
  if (state.siAutoBase) {
    const city = cityData.value;
    const base = Math.max(city.siBaseMin, Math.min(salaryNum.value, city.siBaseMax));
    state.siBase = String(Math.round(base));
  }
}

function onSiBaseInput(e) {
  if (!state.siAutoBase) {
    state.siBase = e.detail.value;
  }
}

function onHfRateChange(e) {
  state.hfRate = hfRateOptions[Number(e.detail.value)];
}

function toggleSiCustom() {
  state.siCustom = !state.siCustom;
}

function onSiCustomAmountInput(e) {
  state.siCustomAmount = e.detail.value;
}

function onDedCountInput(key, e) {
  state.deductionCount[key] = e.detail.value;
}

function onContEduTypeChange(e) {
  state.deductionType.contEdu = contEduOptions[Number(e.detail.value)].value;
}

function onElderTypeChange(e) {
  state.deductionType.elder = elderOptions[Number(e.detail.value)].value;
}

function toggleDed(key) {
  state.deductions[key].enabled = !state.deductions[key].enabled;
  // 互斥：住房贷款利息 vs 住房租金
  if (state.deductions[key].enabled) {
    if (key === "loan" && state.deductions.rent.enabled) {
      state.deductions.rent.enabled = false;
    } else if (key === "rent" && state.deductions.loan.enabled) {
      state.deductions.loan.enabled = false;
    }
  }
}

function toggleDedCollapse() {
  state.dedCollapseOpen = !state.dedCollapseOpen;
}

function onCalcClick() {
  result.value = calculateTax();
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

/* ========== 生命周期 ========== */
onMounted(() => {
  // 初始化城市数据（同步公积金默认比例、社保基数）
  syncCityData();
});
</script>

<style lang="scss" scoped>
/* ========== 页面根 ========== */
.page {
  position: relative;
  min-height: 100vh;
}

/* 背景光晕装饰 */
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

/* ========== 容器 ========== */
.container {
  padding: 0 var(--sp-4) var(--sp-8);
}

/* ========== Hero 区 ========== */
.hero {
  padding: var(--sp-6) 0 var(--sp-6);
  text-align: center;
}

.hero__title {
  font-size: 56rpx;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-4);
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__subtitle {
  font-size: 26rpx;
  color: var(--text-2);
  line-height: 1.6;
}

/* ========== 卡片 ========== */
.card {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
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

  &--flex {
    flex: 1;
    margin-bottom: 0;
  }
}

/* 可折叠卡片标题 */
.card__collapse-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-align: left;
}

.card__collapse-summary {
  font-size: 24rpx;
  color: var(--accent);
  font-weight: 500;
  background: var(--accent-soft);
  padding: 8rpx 20rpx;
  border-radius: var(--r-pill);
  white-space: nowrap;
}

.card__collapse-body {
  overflow: hidden;
}

.card__collapse-inner {
  padding-top: var(--sp-5);
}

/* ========== 表单 ========== */
.form-group {
  margin-bottom: var(--sp-5);

  &--last {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
  font-weight: 500;
}

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 var(--sp-4);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-1);
  font-size: 28rpx;

  &::placeholder {
    color: var(--text-3);
  }

  &[disabled] {
    opacity: 0.5;
  }
}

.input--sm {
  height: 72rpx;
  font-size: 24rpx;
}

.select-picker {
  width: 100%;
}

.select {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 var(--sp-4);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-1);
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;

  &::after {
    content: "▾";
    position: absolute;
    right: var(--sp-4);
    top: 0;
    color: var(--text-3);
    font-size: 24rpx;
    pointer-events: none;
  }
}

.select--sm {
  height: 72rpx;
  line-height: 72rpx;
  font-size: 24rpx;
}

.select-picker--flex {
  flex: 1;
  min-width: 0;
}

/* 输入框带单位后缀 */
.input-wrap {
  position: relative;

  .input {
    padding-right: 96rpx;
  }

  &--flex {
    flex: 1;
    min-width: 0;
  }
}

.input-wrap__suffix {
  position: absolute;
  right: var(--sp-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  font-size: 24rpx;
  pointer-events: none;
}

/* 复选框（自定义） */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 26rpx;
  color: var(--text-2);
}

.checkbox-label {
  flex: 1;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 12rpx;
  background: var(--bg-2);
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s var(--ease);

  &.is-checked {
    border-color: var(--primary);
    background: linear-gradient(135deg, var(--primary), var(--primary-2));

    &::after {
      content: "";
      position: absolute;
      top: 6rpx;
      left: 12rpx;
      width: 10rpx;
      height: 18rpx;
      border: solid #fff;
      border-width: 0 4rpx 4rpx 0;
      transform: rotate(45deg);
    }
  }
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
  font-size: 26rpx;
  color: var(--text-2);
}

.radio-label {
  &.active {
    color: var(--text-1);
    font-weight: 500;
  }
}

.radio {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 50%;
  background: var(--bg-2);
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.2s var(--ease);

  &.is-checked {
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
}

/* 专项附加扣除行 */
.deduction-row {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-4) 0;
  border-bottom: 1rpx solid var(--border);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
}

.deduction-row__checkbox {
  flex-shrink: 0;
  padding-top: 4rpx;
}

.deduction-row__main {
  flex: 1;
  min-width: 0;
}

.deduction-row__label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text-1);
  margin-bottom: 4rpx;
}

.deduction-row__desc {
  font-size: 24rpx;
  color: var(--text-3);
  line-height: 1.5;
}

.deduction-row__input {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
}

.deduction-row__text {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
  flex-wrap: wrap;
}

.deduction-static-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--accent);
}

.deduction-static-unit {
  font-size: 24rpx;
  color: var(--text-3);
}

.deduction-city-label {
  font-size: 24rpx;
  color: var(--text-2);
  background: var(--bg-2);
  padding: 8rpx 20rpx;
  border-radius: var(--r-sm);
  border: 1rpx solid var(--border);
  white-space: nowrap;
}

/* 五险一金明细 */
.si-detail {
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  margin-top: var(--sp-4);
}

.si-detail__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  font-size: 26rpx;

  & + .si-detail__row {
    border-top: 1rpx solid var(--border);
  }
}

.si-detail__label {
  color: var(--text-2);
}

.si-detail__value {
  color: var(--text-1);
  font-weight: 500;
}

.si-detail__total {
  margin-top: var(--sp-2);
  padding-top: var(--sp-3);
  border-top: 1rpx solid var(--border-strong) !important;

  .si-detail__label {
    color: var(--text-1);
    font-weight: 600;
  }

  .si-detail__value {
    color: var(--accent);
    font-weight: 700;
    font-size: 30rpx;
  }
}

/* ========== 计算按钮 ========== */
.calc-btn-wrap {
  margin-top: var(--sp-5);
}

/* ========== 折叠面板 ========== */
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
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 32rpx;
  flex-shrink: 0;
}

.collapse__arrow {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-3);
  flex-shrink: 0;
  transition: transform 0.3s var(--ease);

  &.is-open {
    transform: rotate(180deg);
    color: var(--primary);
  }
}

.arrow-glyph {
  font-size: 28rpx;
  line-height: 1;
}

.collapse__body {
  overflow: hidden;
}

.collapse__inner {
  padding: 0 var(--sp-5) var(--sp-5);
}

/* 提示信息 */
.notice {
  background: var(--accent-soft);
  border: 1rpx solid rgba(34, 211, 238, 0.2);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-4);
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

.strong {
  color: var(--accent);
  font-weight: 600;
}

/* 税率表（假表格 - flex 布局） */
.sub-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: var(--sp-3);

  &--mt {
    margin-top: var(--sp-5);
  }
}

.tax-table {
  width: 100%;
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: var(--sp-5);
}

.tax-table__row {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: var(--text-2);

  & + .tax-table__row {
    border-top: 1rpx solid var(--border);
  }
}

.tax-table__row--head {
  background: var(--bg-2);
  color: var(--text-1);
  font-weight: 600;
}

.tax-table__cell {
  flex: 1;
  padding: 16rpx 20rpx;
  text-align: right;
}

.tax-table__cell--left {
  text-align: left;
  flex: 0 0 80rpx;
}

/* ========== 页脚 ========== */
.footer {
  text-align: center;
  padding: var(--sp-8) 0 var(--sp-6);
  color: var(--text-3);
  font-size: 24rpx;
}

.footer__disclaimer {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  margin-bottom: var(--sp-4);
  text-align: left;
}

.footer__disclaimer-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--warning);
  margin-bottom: var(--sp-2);
}

.footer__disclaimer-text {
  font-size: 24rpx;
  color: var(--text-3);
  line-height: 1.8;
}

.footer__brand {
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.footer__line {
  font-size: 24rpx;

  &--mt {
    margin-top: 8rpx;
  }
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
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s var(--ease), visibility 0.3s var(--ease);

  &.is-open {
    opacity: 1;
    visibility: visible;
  }
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
  max-height: 90vh;
  background: var(--bg-1);
  border: 1rpx solid var(--border-strong);
  border-radius: var(--r-lg);
  box-shadow: 0 60rpx 160rpx -40rpx rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  transform: scale(0.96) translateY(24rpx);
  transition: transform 0.35s var(--ease);
  overflow: hidden;
}

.modal.is-open .modal__card {
  transform: scale(1) translateY(0);
}

.modal__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: var(--r-md);
  color: var(--text-2);
  font-size: 32rpx;
  z-index: 2;
}

.modal__scroll {
  flex: 1;
  padding: var(--sp-6);
  max-height: 80vh;
}

.modal__title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: var(--sp-5);
  text-align: center;
  padding-right: var(--sp-8);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-6);
  border-top: 1rpx solid var(--border);
}

.modal__btn {
  height: 80rpx;
  width: 240rpx;
  font-size: 28rpx;
}

/* 结果区域 */
.result__header {
  text-align: center;
  padding-bottom: var(--sp-5);
  margin-bottom: var(--sp-5);
  border-bottom: 1rpx solid var(--border);
}

.result__label {
  font-size: 26rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.result__value {
  font-size: 72rpx;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.result__sub {
  font-size: 24rpx;
  color: var(--text-3);
  margin-top: var(--sp-2);
}

.strong-accent {
  color: var(--accent);
  font-weight: 600;
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

  &--full {
    width: 100%;
  }
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

.result__item-value--danger {
  color: var(--danger);
}

/* 月度税收柱状图 */
.result__section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: var(--sp-3);
  margin-top: var(--sp-5);
  display: flex;
  align-items: center;
  gap: var(--sp-2);

  &::before {
    content: "";
    width: 6rpx;
    height: 28rpx;
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 4rpx;
  }
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
  height: 240rpx;
  padding: var(--sp-3);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
}

.chart__bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  height: 100%;
  justify-content: flex-end;
  min-width: 0;
}

.chart__bar {
  width: 100%;
  max-width: 40rpx;
  background: linear-gradient(180deg, var(--accent), var(--primary));
  border-radius: 8rpx 8rpx 0 0;
  min-height: 4rpx;
}

.chart__month {
  font-size: 18rpx;
  color: var(--text-3);
  line-height: 1;
}

/* 扣除明细列表 */
.breakdown {
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
}

.breakdown__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  font-size: 26rpx;

  & + .breakdown__row {
    border-top: 1rpx solid var(--border);
  }
}

.breakdown__label {
  color: var(--text-2);
  flex: 1;
}

.breakdown__value {
  color: var(--text-1);
  font-weight: 500;
  text-align: right;

  &.is-tax {
    color: var(--danger);
  }
}

.breakdown__row--total {
  margin-top: var(--sp-2);
  padding-top: var(--sp-3);
  border-top: 1rpx solid var(--border-strong) !important;

  .breakdown__label {
    color: var(--text-1);
    font-weight: 600;
  }

  .breakdown__value {
    color: var(--danger);
    font-weight: 700;
    font-size: 30rpx;
  }
}

/* ========== 入场动画 ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(32rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.6s var(--ease) forwards;
  opacity: 0;
}

.animate-in--1 {
  animation-delay: 0.05s;
}

.animate-in--2 {
  animation-delay: 0.1s;
}

.animate-in--3 {
  animation-delay: 0.15s;
}

.animate-in--4 {
  animation-delay: 0.2s;
}

.animate-in--5 {
  animation-delay: 0.25s;
}

.animate-in--6 {
  animation-delay: 0.3s;
}
</style>
