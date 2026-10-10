<!-- 由 housing-fund/index.html 转换为 uniapp 小程序页面 -->
<template>
  <view class="page">
    <!-- 背景光晕装饰 -->
    <view class="bg-glow" aria-hidden="true"></view>

    <view class="container">
      <!-- Hero 区 -->
      <view class="hero">
        <view class="hero__badge">✦ 2025最新利率</view>
        <view class="hero__title">
          <text class="hero__title-main">公积金贷款</text>
          <text class="hero__title-sub">计算器</text>
        </view>
        <view class="hero__subtitle">
          计算每月公积金缴存额、可贷额度及还款计划，支持各城市不同缴存比例与贷款上限
        </view>
      </view>

      <!-- 所在城市 -->
      <view class="card">
        <view class="card__title">所在城市</view>
        <view class="form-group">
          <view class="form-label">选择城市</view>
          <picker
            class="select"
            mode="selector"
            :range="cityNames"
            :value="form.cityIndex"
            @change="onCityChange"
          >
            <view class="select__display">
              <text class="select__text">{{ cityNames[form.cityIndex] }}</text>
              <text class="select__arrow">▾</text>
            </view>
          </picker>
        </view>
        <view class="form-group form-group--last">
          <view class="check-item" @click="toggleAutoRate">
            <view class="check-box" :class="{ checked: form.cityAutoRate }">
              <text v-if="form.cityAutoRate" class="check-tick">✓</text>
            </view>
            <text class="check-label">自动同步城市缴存比例与贷款上限</text>
          </view>
        </view>
      </view>

      <!-- 缴存信息 -->
      <view class="card">
        <view class="card__title">缴存信息</view>

        <view class="form-group">
          <view class="form-label">月缴存基数（通常为月工资）</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.salary"
              placeholder="请输入月缴存基数"
              @input="onSalary"
            />
            <text class="input-wrap__suffix">元/月</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">个人缴存比例</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.employeeRate"
              @input="onEmployeeRate"
            />
            <text class="input-wrap__suffix">%</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">单位缴存比例</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.employerRate"
              @input="onEmployerRate"
            />
            <text class="input-wrap__suffix">%</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">公积金账户余额</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.balance"
              placeholder="请输入公积金账户余额"
              @input="onBalance"
            />
            <text class="input-wrap__suffix">元</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">已连续缴存月数</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.contribMonths"
              placeholder="请输入已缴存月数"
              @input="onContribMonths"
            />
            <text class="input-wrap__suffix">个月</text>
          </view>
        </view>

        <!-- 缴存明细 -->
        <view class="si-detail">
          <view class="si-detail__row">
            <text class="si-detail__label">个人月缴存额</text>
            <text class="si-detail__value">{{ money(contrib.empContrib) }}</text>
          </view>
          <view class="si-detail__row">
            <text class="si-detail__label">单位月缴存额</text>
            <text class="si-detail__value">{{ money(contrib.erContrib) }}</text>
          </view>
          <view class="si-detail__row si-detail__total">
            <text class="si-detail__label">月缴存总额</text>
            <text class="si-detail__value si-detail__value--total">{{ money(contrib.total) }}</text>
          </view>
        </view>
      </view>

      <!-- 贷款信息 -->
      <view class="card">
        <view class="card__title">贷款信息</view>

        <view class="form-group">
          <view class="form-label">房屋类型</view>
          <view class="seg-group">
            <view
              v-for="opt in houseTypeOptions"
              :key="opt.value"
              class="seg-item"
              :class="{ 'is-active': form.houseType === opt.value }"
              @click="form.houseType = opt.value"
            >
              <text>{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">申请人情况</view>
          <view class="seg-group">
            <view
              v-for="opt in applicantOptions"
              :key="opt.value"
              class="seg-item"
              :class="{ 'is-active': form.applicantType === opt.value }"
              @click="form.applicantType = opt.value"
            >
              <text>{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">申请人年龄</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.age"
              @input="onAge"
            />
            <text class="input-wrap__suffix">岁</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">申请人性别</view>
          <view class="seg-group seg-group--three">
            <view
              v-for="opt in genderOptions"
              :key="opt.value"
              class="seg-item"
              :class="{ 'is-active': form.gender === opt.value }"
              @click="onGenderChange(opt.value)"
            >
              <text>{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">期望贷款金额</view>
          <view class="input-wrap">
            <input
              class="input"
              type="digit"
              :value="form.loanAmount"
              placeholder="请输入期望贷款金额"
              @input="onLoanAmount"
            />
            <text class="input-wrap__suffix">元</text>
          </view>
        </view>

        <view class="form-group">
          <view class="form-label">还款方式</view>
          <view class="seg-group">
            <view
              v-for="opt in repayOptions"
              :key="opt.value"
              class="seg-item"
              :class="{ 'is-active': form.repayMethod === opt.value }"
              @click="form.repayMethod = opt.value"
            >
              <text>{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <!-- 城市贷款参数提示 -->
        <view class="info-box">
          <view class="info-box__text">
            <text class="info-box__strong">{{ currentCity.name }}：</text>
            <text>{{ cityLoanInfoText }}</text>
          </view>
        </view>
      </view>

      <!-- 计算按钮 -->
      <view class="calc-btn-wrap">
        <button class="btn btn--primary" @click="onCalc">
          <text>计算公积金贷款</text>
        </button>
      </view>

      <!-- 计算说明（折叠面板） -->
      <view class="collapse" :class="{ 'is-open': noteOpen }">
        <view class="collapse__header" @click="noteOpen = !noteOpen">
          <view class="collapse__header-left">
            <text class="collapse__header-icon">ℹ</text>
            <text class="collapse__header-title">计算说明与利率表</text>
          </view>
          <text class="collapse__arrow" :class="{ rotated: noteOpen }">▾</text>
        </view>
        <view v-if="noteOpen" class="collapse__body">
          <view class="collapse__inner">
            <view class="notice">
              <view class="notice__text">
                <view class="notice__line"><text class="notice__strong">缴存基数：</text><text>通常为职工上年度月平均工资，各地设有上下限。</text></view>
                <view class="notice__line"><text class="notice__strong">缴存比例：</text><text>单位和个人各5%-12%，上海为5%-7%。</text></view>
                <view class="notice__line"><text class="notice__strong">贷款额度：</text><text>取「余额倍数法」与「城市最高限额」的较小值，部分城市采用缴存年限挂钩（如北京）。</text></view>
                <view class="notice__line"><text class="notice__strong">可贷年限：</text><text>最长30年，且贷款期限不超过退休年龄后5年。</text></view>
                <view class="notice__line"><text class="notice__strong">退休年龄：</text><text>男性63岁，女性管理岗58岁，女性工人岗53岁（2025年延迟退休新规）。贷款期限不超过退休年龄后5年。</text></view>
                <view class="notice__line"><text class="notice__strong">等额本息：</text><text>每月还款额固定，前期利息多后期本金多。</text></view>
                <view class="notice__line"><text class="notice__strong">等额本金：</text><text>每月本金固定，利息逐月递减，月供逐月减少。</text></view>
              </view>
            </view>

            <view class="rate-title">公积金贷款利率表（2025年5月8日起执行）</view>
            <view class="rate-table">
              <view class="rate-row rate-row--head">
                <view class="rate-cell rate-cell--type">贷款类型</view>
                <view class="rate-cell">≤5年</view>
                <view class="rate-cell">&gt;5年</view>
              </view>
              <view class="rate-row">
                <view class="rate-cell rate-cell--type">首套房</view>
                <view class="rate-cell">2.10%</view>
                <view class="rate-cell">2.60%</view>
              </view>
              <view class="rate-row">
                <view class="rate-cell rate-cell--type">二套房</view>
                <view class="rate-cell">≥2.525%</view>
                <view class="rate-cell">≥3.075%</view>
              </view>
            </view>

            <view class="rate-title rate-title--mt">各城市公积金贷款额度上限</view>
            <view class="rate-table rate-table--four">
              <view class="rate-row rate-row--head">
                <view class="rate-cell rate-cell--type">城市</view>
                <view class="rate-cell">单人最高</view>
                <view class="rate-cell">双人最高</view>
                <view class="rate-cell">余额倍数</view>
              </view>
              <view v-for="r in cityCapRows" :key="r.name" class="rate-row">
                <view class="rate-cell rate-cell--type">{{ r.name }}</view>
                <view class="rate-cell">{{ r.single }}</view>
                <view class="rate-cell">{{ r.dual }}</view>
                <view class="rate-cell">{{ r.mult }}</view>
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
            本计算器计算结果仅供参考，实际可贷额度及利率以当地住房公积金管理中心核定为准。各城市公积金政策差异较大，缴存比例、贷款额度上限、利率可能随时调整。如有疑问，请咨询当地公积金管理中心或拨打住房公积金热线 12329。
          </view>
        </view>
        <view class="footer__brand">✦ 公积金贷款计算器</view>
        <view class="footer__line">数据来源：住房公积金管理中心 2025年最新政策</view>
        <view class="footer__line footer__line--mt">仅供参考，具体以官方政策为准 © {{ year }}</view>
      </view>
    </view>

    <!-- 结果弹层 -->
    <view v-if="resultOpen" class="modal" @click="closeResult">
      <view class="modal__card" @click.stop="">
        <view class="modal__close" @click="closeResult">
          <text>✕</text>
        </view>
        <view class="modal__title">贷款计算结果</view>

        <scroll-view scroll-y class="modal__body" v-if="result">
          <!-- 主要结果 -->
          <view class="result__header">
            <view class="result__label">月还款额（首月）</view>
            <view class="result__value">{{ money(result.monthly) }}</view>
            <view class="result__sub">
              贷款总额 <text class="result__sub-strong">{{ numStr(result.actualLoan) }}</text> 元　|　贷款年限 <text class="result__sub-strong">{{ result.actualYears }}</text> 年
            </view>
          </view>

          <!-- 关键指标网格 -->
          <view class="result__grid">
            <view class="result__item">
              <view class="result__item-label">月缴存总额</view>
              <view class="result__item-value result__item-value--accent">{{ money(result.contrib.total) }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">可贷额度</view>
              <view class="result__item-value result__item-value--primary">{{ fmtWan(result.loanInfo.maxLoanable) }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">贷款利率</view>
              <view class="result__item-value">{{ fmtRate(result.annualRate) }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">还款方式</view>
              <view class="result__item-value">{{ result.repayMethod === 'equal-payment' ? '等额本息' : '等额本金' }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">利息总额</view>
              <view class="result__item-value result__item-value--warning">{{ money(result.totalInterest) }}</view>
            </view>
            <view class="result__item">
              <view class="result__item-label">还款总额</view>
              <view class="result__item-value result__item-value--danger">{{ money(result.totalRepay) }}</view>
            </view>
            <view v-if="capHint" class="result__item result__item--full">
              <view class="result__item-label">{{ capHint.label }}</view>
              <view class="result__item-value result__item-value--success">{{ capHint.value }}</view>
            </view>
          </view>

          <!-- 还款明细表 -->
          <view class="result__section-title">还款明细（前12期 + 汇总）</view>
          <scroll-view scroll-x class="schedule-wrap" :show-scrollbar="false">
            <view class="schedule-table">
              <view class="schedule-row schedule-row--head">
                <view class="cell cell--period">期次</view>
                <view class="cell">月供</view>
                <view class="cell">本金</view>
                <view class="cell">利息</view>
                <view class="cell">剩余本金</view>
              </view>
              <view v-for="(m, i) in scheduleRows" :key="i" class="schedule-row">
                <view class="cell cell--period">第{{ m.month }}期</view>
                <view class="cell">{{ numStr(m.payment) }}</view>
                <view class="cell">{{ numStr(m.principal) }}</view>
                <view class="cell">{{ numStr(m.interest) }}</view>
                <view class="cell">{{ numStr(m.remaining) }}</view>
              </view>
              <view class="schedule-row schedule-row--summary">
                <view class="cell cell--period">合计</view>
                <view class="cell">{{ numStr(result.totalRepay) }}</view>
                <view class="cell">{{ numStr(result.actualLoan) }}</view>
                <view class="cell">{{ numStr(result.totalInterest) }}</view>
                <view class="cell">—</view>
              </view>
            </view>
          </scroll-view>

          <!-- 还款趋势图 -->
          <view class="result__section-title">年度还款趋势</view>
          <view class="chart">
            <view v-for="d in yearChartData" :key="d.year" class="chart__bar-group">
              <view class="chart__bars">
                <view class="chart__bar chart__bar--principal" :style="{ height: d.pH + 'rpx' }"></view>
                <view class="chart__bar chart__bar--interest" :style="{ height: d.iH + 'rpx' }"></view>
              </view>
              <text class="chart__month">{{ d.year }}年</text>
            </view>
          </view>
          <view class="chart__legend">
            <view class="chart__legend-item">
              <view class="chart__legend-dot chart__legend-dot--principal"></view>
              <text>本金</text>
            </view>
            <view class="chart__legend-item">
              <view class="chart__legend-dot chart__legend-dot--interest"></view>
              <text>利息</text>
            </view>
          </view>
        </scroll-view>

        <view class="modal__actions">
          <button class="btn btn--primary" @click="closeResult">
            <text>知道了</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

/* ========== 城市数据 ========== */
const CITY_DATA = {
  beijing: { name: "北京", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2540, baseMax: 35811, singleMax: 1200000, dualMax: 2400000, balanceMult: 0, method: "years", yearsPerLakh: 200000 },
  shanghai: { name: "上海", empRateMin: 5, empRateMax: 7, erRateMin: 5, erRateMax: 7, baseMin: 2690, baseMax: 37302, singleMax: 600000, dualMax: 1200000, balanceMult: 0, method: "cap" },
  guangzhou: { name: "广州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2500, baseMax: 39828, singleMax: 800000, dualMax: 1200000, balanceMult: 8, method: "balance" },
  shenzhen: { name: "深圳", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2360, baseMax: 44265, singleMax: 600000, dualMax: 1100000, balanceMult: 14, method: "balance" },
  hangzhou: { name: "杭州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2490, baseMax: 40694, singleMax: 900000, dualMax: 1800000, balanceMult: 20, method: "balance" },
  chengdu: { name: "成都", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2288, baseMax: 30564, singleMax: 600000, dualMax: 1000000, balanceMult: 20, method: "balance" },
  nanjing: { name: "南京", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2265, baseMax: 24003, singleMax: 500000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  wuhan: { name: "武汉", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2188, baseMax: 23531, singleMax: 1200000, dualMax: 1500000, balanceMult: 20, method: "balance" },
  tianjin: { name: "天津", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2246, baseMax: 24207, singleMax: 600000, dualMax: 800000, balanceMult: 20, method: "balance" },
  chongqing: { name: "重庆", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2233, baseMax: 23960, singleMax: 1000000, dualMax: 2000000, balanceMult: 20, method: "balance" },
  xian: { name: "西安", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2222, baseMax: 22965, singleMax: 900000, dualMax: 1200000, balanceMult: 15, method: "balance" },
  suzhou: { name: "苏州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2265, baseMax: 38900, singleMax: 1200000, dualMax: 1500000, balanceMult: 15, method: "balance" },
  qingdao: { name: "青岛", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2184, baseMax: 22576, singleMax: 360000, dualMax: 600000, balanceMult: 15, method: "balance" },
  ningbo: { name: "宁波", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2164, baseMax: 22365, singleMax: 800000, dualMax: 1200000, balanceMult: 15, method: "balance" },
  xiamen: { name: "厦门", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2146, baseMax: 22172, singleMax: 700000, dualMax: 1100000, balanceMult: 12, method: "balance" },
  dalian: { name: "大连", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2184, baseMax: 22576, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  shijiazhuang: { name: "石家庄", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  taiyuan: { name: "太原", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  huhehaote: { name: "呼和浩特", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  shenyang: { name: "沈阳", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  changchun: { name: "长春", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  haerbin: { name: "哈尔滨", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  hefei: { name: "合肥", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2146, baseMax: 22172, singleMax: 550000, dualMax: 900000, balanceMult: 15, method: "balance" },
  fuzhou: { name: "福州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2146, baseMax: 22172, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  nanchang: { name: "南昌", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2146, baseMax: 22172, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  jinan: { name: "济南", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2184, baseMax: 22576, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  zhengzhou: { name: "郑州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  changsha: { name: "长沙", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2217, baseMax: 22912, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  nanning: { name: "南宁", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  haikou: { name: "海口", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  guiyang: { name: "贵阳", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  kunming: { name: "昆明", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  lasa: { name: "拉萨", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  lanzhou: { name: "兰州", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  xining: { name: "西宁", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  yinchuan: { name: "银川", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  wulumuqi: { name: "乌鲁木齐", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2203, baseMax: 22762, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  wuxi: { name: "无锡", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2265, baseMax: 24003, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
  foshan: { name: "佛山", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2146, baseMax: 22172, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  dongguan: { name: "东莞", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2167, baseMax: 22397, singleMax: 500000, dualMax: 800000, balanceMult: 12, method: "balance" },
  other: { name: "其他城市", empRateMin: 5, empRateMax: 12, erRateMin: 5, erRateMax: 12, baseMin: 2000, baseMax: 20000, singleMax: 600000, dualMax: 1000000, balanceMult: 15, method: "balance" },
};

// 公积金贷款利率（2025年5月8日起执行）
const LOAN_RATES = {
  first: { short: 0.021, long: 0.026 },
  second: { short: 0.02525, long: 0.03075 },
};

// 退休年龄（2025延迟退休新规）
const RETIREMENT_AGE = {
  male: 63,
  female_mgmt: 58,
  female_worker: 53,
};

// 城市扁平列表（保留原 optgroup 分组顺序，用于 picker）
const CITY_LIST = [
  // 直辖市
  { key: "beijing", name: "北京" },
  { key: "shanghai", name: "上海" },
  { key: "tianjin", name: "天津" },
  { key: "chongqing", name: "重庆" },
  // 省会/首府城市
  { key: "shijiazhuang", name: "石家庄" },
  { key: "taiyuan", name: "太原" },
  { key: "huhehaote", name: "呼和浩特" },
  { key: "shenyang", name: "沈阳" },
  { key: "changchun", name: "长春" },
  { key: "haerbin", name: "哈尔滨" },
  { key: "nanjing", name: "南京" },
  { key: "hangzhou", name: "杭州" },
  { key: "hefei", name: "合肥" },
  { key: "fuzhou", name: "福州" },
  { key: "nanchang", name: "南昌" },
  { key: "jinan", name: "济南" },
  { key: "zhengzhou", name: "郑州" },
  { key: "wuhan", name: "武汉" },
  { key: "changsha", name: "长沙" },
  { key: "guangzhou", name: "广州" },
  { key: "nanning", name: "南宁" },
  { key: "haikou", name: "海口" },
  { key: "chengdu", name: "成都" },
  { key: "guiyang", name: "贵阳" },
  { key: "kunming", name: "昆明" },
  { key: "lasa", name: "拉萨" },
  { key: "xian", name: "西安" },
  { key: "lanzhou", name: "兰州" },
  { key: "xining", name: "西宁" },
  { key: "yinchuan", name: "银川" },
  { key: "wulumuqi", name: "乌鲁木齐" },
  // 计划单列市
  { key: "dalian", name: "大连" },
  { key: "qingdao", name: "青岛" },
  { key: "ningbo", name: "宁波" },
  { key: "xiamen", name: "厦门" },
  { key: "shenzhen", name: "深圳" },
  // 其他城市
  { key: "suzhou", name: "苏州" },
  { key: "wuxi", name: "无锡" },
  { key: "foshan", name: "佛山" },
  { key: "dongguan", name: "东莞" },
  { key: "other", name: "其他城市" },
];
const cityNames = CITY_LIST.map((c) => c.name);
const DEFAULT_CITY_INDEX = CITY_LIST.findIndex((c) => c.key === "hangzhou");

// 单选项配置
const houseTypeOptions = [
  { value: "first", label: "首套房" },
  { value: "second", label: "二套房" },
];
const applicantOptions = [
  { value: "single", label: "单人申请" },
  { value: "dual", label: "双人申请" },
];
const genderOptions = [
  { value: "male", label: "男性" },
  { value: "female_mgmt", label: "女性(管理岗)" },
  { value: "female_worker", label: "女性(工人岗)" },
];
const repayOptions = [
  { value: "equal-payment", label: "等额本息" },
  { value: "equal-principal", label: "等额本金" },
];

// 城市额度上限展示表
const cityCapRows = [
  { name: "北京", single: "120万", dual: "240万", mult: "年限挂钩" },
  { name: "上海", single: "60万", dual: "120万", mult: "—" },
  { name: "广州", single: "80万", dual: "120万", mult: "8倍" },
  { name: "深圳", single: "60万", dual: "110万", mult: "14倍" },
  { name: "杭州", single: "90万", dual: "180万", mult: "20倍" },
  { name: "成都", single: "60万", dual: "100万", mult: "20倍" },
  { name: "武汉", single: "120万", dual: "150万", mult: "20倍" },
  { name: "南京", single: "50万", dual: "100万", mult: "15倍" },
  { name: "苏州", single: "120万", dual: "150万", mult: "15倍" },
  { name: "天津", single: "60万", dual: "80万", mult: "20倍" },
  { name: "重庆", single: "100万", dual: "200万", mult: "20倍" },
  { name: "西安", single: "90万", dual: "120万", mult: "15倍" },
  { name: "其他城市", single: "60万", dual: "100万", mult: "15倍" },
];

/* ========== 响应式状态 ========== */
const form = reactive({
  cityIndex: DEFAULT_CITY_INDEX,
  cityAutoRate: true,
  salary: "15000",
  employeeRate: "12",
  employerRate: "12",
  balance: "50000",
  contribMonths: "36",
  age: "30",
  loanAmount: "800000",
  houseType: "first",
  applicantType: "single",
  gender: "male",
  repayMethod: "equal-payment",
});

const noteOpen = ref(false);
const resultOpen = ref(false);
const result = ref(null);
const year = new Date().getFullYear();

/* ========== 工具函数 ========== */
const currentCity = computed(() => CITY_DATA[CITY_LIST[form.cityIndex].key] || CITY_DATA.other);

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function money(n) {
  return "¥" + Math.round(n).toLocaleString("zh-CN");
}

function numStr(n) {
  return Math.round(n).toLocaleString("zh-CN");
}

function fmtWan(n) {
  return (n / 10000).toFixed(1) + "万";
}

function fmtRate(r) {
  return (r * 100).toFixed(2) + "%";
}

function getRetireAge() {
  return RETIREMENT_AGE[form.gender] || 63;
}

/* ========== 缴存额计算（响应式） ========== */
const contrib = computed(() => {
  const city = currentCity.value;
  let base = num(form.salary);
  base = Math.max(city.baseMin, Math.min(base, city.baseMax));
  const empRate = Math.max(city.empRateMin, Math.min(num(form.employeeRate), city.empRateMax));
  const erRate = Math.max(city.erRateMin, Math.min(num(form.employerRate), city.erRateMax));
  const empContrib = base * (empRate / 100);
  const erContrib = base * (erRate / 100);
  return { base, empRate, erRate, empContrib, erContrib, total: empContrib + erContrib };
});

const cityLoanInfoText = computed(() => {
  const city = currentCity.value;
  const singleMax = fmtWan(city.singleMax);
  const dualMax = fmtWan(city.dualMax);
  let methodText = "";
  if (city.method === "years") {
    methodText = "按缴存年限计算：每满1年可贷" + fmtWan(city.yearsPerLakh);
  } else if (city.method === "balance") {
    methodText = "按账户余额×" + city.balanceMult + "倍计算";
  } else {
    methodText = "按城市最高限额确定";
  }
  return "单人最高" + singleMax + "，双人最高" + dualMax + "。" + methodText + "。缴存比例" + city.empRateMin + "%-" + city.empRateMax + "%。";
});

/* ========== 可贷额度计算 ========== */
function calcMaxLoanable() {
  const city = currentCity.value;
  const c = contrib.value;
  const cap = form.applicantType === "dual" ? city.dualMax : city.singleMax;
  let balanceBased = Infinity;

  if (city.method === "years") {
    // 北京模式：缴存年限挂钩，每满1年可贷N万
    const years = Math.floor(num(form.contribMonths) / 12);
    balanceBased = years * city.yearsPerLakh * (form.applicantType === "dual" ? 2 : 1);
  } else if (city.method === "balance") {
    // 余额倍数法 + 月缴存额×到退休月数
    const retireAge = getRetireAge();
    const monthsToRetire = Math.max(0, (retireAge - num(form.age)) * 12);
    balanceBased = num(form.balance) * city.balanceMult + c.total * monthsToRetire;
  }

  const maxLoanable = Math.min(balanceBased, cap);
  return { maxLoanable, cap, balanceBased, method: city.method };
}

/* ========== 可贷年限计算 ========== */
function calcMaxYears() {
  const retireAge = RETIREMENT_AGE[form.gender] || 63;
  const yearsToRetire = retireAge - num(form.age) + 5;
  return Math.max(1, Math.min(30, yearsToRetire));
}

/* ========== 还款计算 ========== */
// 等额本息：每月还款额固定
function calcEqualPayment(principal, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 12;
  if (r === 0) {
    const m = principal / n;
    const schedule = [];
    for (let i = 0; i < n; i++) {
      schedule.push({
        month: i + 1,
        payment: m,
        principal: m,
        interest: 0,
        remaining: Math.max(0, principal - m * (i + 1)),
      });
    }
    return { monthly: m, schedule };
  }
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const schedule = [];
  let remaining = principal;
  for (let i = 0; i < n; i++) {
    const interest = remaining * r;
    const principalPart = monthly - interest;
    remaining -= principalPart;
    schedule.push({
      month: i + 1,
      payment: monthly,
      principal: principalPart,
      interest: interest,
      remaining: Math.max(0, remaining),
    });
  }
  return { monthly, schedule };
}

// 等额本金：每月本金固定，利息递减
function calcEqualPrincipal(principal, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 12;
  const monthlyPrincipal = principal / n;
  const schedule = [];
  let remaining = principal;
  let firstMonthly = 0;
  for (let i = 0; i < n; i++) {
    const interest = remaining * r;
    const payment = monthlyPrincipal + interest;
    if (i === 0) firstMonthly = payment;
    remaining -= monthlyPrincipal;
    schedule.push({
      month: i + 1,
      payment: payment,
      principal: monthlyPrincipal,
      interest: interest,
      remaining: Math.max(0, remaining),
    });
  }
  return { monthly: firstMonthly, schedule };
}

/* ========== 主计算函数 ========== */
function calculate() {
  const c = contrib.value;
  const loanInfo = calcMaxLoanable();
  const maxYears = calcMaxYears();

  // 实际贷款额 = min(期望额度, 可贷额度)
  const actualLoan = Math.min(num(form.loanAmount), loanInfo.maxLoanable);
  const actualYears = maxYears;

  // 利率
  const rateConfig = LOAN_RATES[form.houseType];
  const annualRate = actualYears <= 5 ? rateConfig.short : rateConfig.long;

  // 还款计算
  let res;
  if (form.repayMethod === "equal-payment") {
    res = calcEqualPayment(actualLoan, annualRate, actualYears);
  } else {
    res = calcEqualPrincipal(actualLoan, annualRate, actualYears);
  }

  const totalRepay = res.schedule.reduce((s, m) => s + m.payment, 0);
  const totalInterest = totalRepay - actualLoan;

  // 是否被额度限制
  const isCapped = num(form.loanAmount) > loanInfo.maxLoanable;

  return {
    contrib: c,
    loanInfo,
    maxYears,
    actualLoan,
    actualYears,
    annualRate,
    repayMethod: form.repayMethod,
    monthly: res.monthly,
    schedule: res.schedule,
    totalRepay,
    totalInterest,
    isCapped,
  };
}

/* ========== 结果派生展示 ========== */
const scheduleRows = computed(() => {
  if (!result.value) return [];
  const showMonths = Math.min(12, result.value.schedule.length);
  return result.value.schedule.slice(0, showMonths);
});

const capHint = computed(() => {
  if (!result.value) return null;
  const r = result.value;
  if (r.actualLoan <= 0) {
    return { label: "可贷额度不足，请检查账户余额或缴存月数", value: "无法计算" };
  }
  if (r.isCapped) {
    return { label: "期望贷款超过可贷额度，已按最高可贷额度计算", value: fmtWan(r.loanInfo.maxLoanable) };
  }
  return null;
});

const yearChartData = computed(() => {
  if (!result.value) return [];
  const sch = result.value.schedule;
  const years = Math.ceil(sch.length / 12);
  const data = [];
  for (let y = 0; y < years; y++) {
    let principal = 0;
    let interest = 0;
    for (let m = 0; m < 12; m++) {
      const idx = y * 12 + m;
      if (idx >= sch.length) break;
      principal += sch[idx].principal;
      interest += sch[idx].interest;
    }
    data.push({ principal, interest });
  }
  const maxTotal = Math.max(...data.map((d) => d.principal + d.interest));
  const showYears = Math.min(years, 30);
  const out = [];
  for (let i = 0; i < showYears; i++) {
    const d = data[i];
    out.push({
      year: i + 1,
      pH: maxTotal > 0 ? Math.round((d.principal / maxTotal) * 160) : 0,
      iH: maxTotal > 0 ? Math.round((d.interest / maxTotal) * 160) : 0,
    });
  }
  return out;
});

/* ========== 事件处理 ========== */
function onCityChange(e) {
  form.cityIndex = Number(e.detail.value);
  if (form.cityAutoRate) {
    const city = currentCity.value;
    form.employeeRate = String(city.empRateMax);
    form.employerRate = String(city.erRateMax);
  }
}

function toggleAutoRate() {
  form.cityAutoRate = !form.cityAutoRate;
  if (form.cityAutoRate) {
    const city = currentCity.value;
    form.employeeRate = String(city.empRateMax);
    form.employerRate = String(city.erRateMax);
  }
}

function onGenderChange(value) {
  form.gender = value;
  // 性别变更影响可贷额度计算（退休年龄变化），缴存明细响应式自动更新
}

function onSalary(e) { form.salary = e.detail.value; }
function onEmployeeRate(e) { form.employeeRate = e.detail.value; }
function onEmployerRate(e) { form.employerRate = e.detail.value; }
function onBalance(e) { form.balance = e.detail.value; }
function onContribMonths(e) { form.contribMonths = e.detail.value; }
function onAge(e) { form.age = e.detail.value; }
function onLoanAmount(e) { form.loanAmount = e.detail.value; }

function onCalc() {
  result.value = calculate();
  resultOpen.value = true;
}

function closeResult() {
  resultOpen.value = false;
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

.container {
  padding: 0 var(--sp-4) var(--sp-10);
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--sp-8) 0 var(--sp-6);
}

.hero__badge {
  display: inline-block;
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 12rpx 28rpx;
  border-radius: var(--r-pill);
  margin-bottom: var(--sp-4);
}

.hero__title {
  margin-bottom: var(--sp-3);
}

.hero__title-main {
  display: block;
  font-size: 80rpx;
  font-weight: 900;
  line-height: 1.15;
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__title-sub {
  display: block;
  font-size: 80rpx;
  font-weight: 900;
  line-height: 1.15;
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__subtitle {
  font-size: 26rpx;
  color: var(--text-2);
  margin: 0 auto;
  line-height: 1.6;
}

/* 卡片 */
.card {
  background: var(--bg-1);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  margin-bottom: var(--sp-4);
  box-shadow: var(--shadow-card);
}

.card__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-1);
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
  margin-bottom: var(--sp-4);
}

.form-group--last {
  margin-bottom: 0;
}

.form-label {
  font-size: 24rpx;
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: 0 var(--sp-3);
}

.input {
  flex: 1;
  padding: 24rpx 0;
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-1);
}

.input-wrap__suffix {
  font-size: 24rpx;
  color: var(--text-3);
  white-space: nowrap;
  padding-left: var(--sp-2);
}

/* select (picker) */
.select__display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: 24rpx var(--sp-3);
}

.select__text {
  flex: 1;
  font-size: 30rpx;
  color: var(--text-1);
  font-weight: 500;
}

.select__arrow {
  font-size: 24rpx;
  color: var(--text-3);
}

/* 复选框 */
.check-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.check-box {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-2);

  &.checked {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    border-color: var(--primary);
  }
}

.check-tick {
  font-size: 22rpx;
  color: #fff;
  line-height: 1;
}

.check-label {
  font-size: 26rpx;
  color: var(--text-2);
  flex: 1;
}

/* 分段切换 */
.seg-group {
  display: flex;
  gap: var(--sp-2);
}

.seg-group--three .seg-item {
  font-size: 24rpx;
}

.seg-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx var(--sp-3);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  font-size: 26rpx;
  color: var(--text-2);
  transition: all 0.2s var(--ease);

  &.is-active {
    border-color: var(--primary);
    background: var(--primary-soft);
    color: var(--text-1);
  }
}

/* 缴存明细 */
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
}

.si-detail__label {
  color: var(--text-2);
}

.si-detail__value {
  color: var(--text-1);
  font-weight: 600;
}

.si-detail__total {
  border-top: 1rpx solid var(--border);
  margin-top: var(--sp-2);
  padding-top: var(--sp-3);
}

.si-detail__value--total {
  color: var(--accent);
  font-size: 32rpx;
}

/* 信息提示 */
.info-box {
  background: var(--accent-soft);
  border: 1rpx solid rgba(34, 211, 238, 0.2);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  margin-top: var(--sp-3);
}

.info-box__text {
  font-size: 24rpx;
  color: var(--text-2);
  line-height: 1.7;
}

.info-box__strong {
  color: var(--accent);
  font-weight: 600;
}

/* 计算按钮 */
.calc-btn-wrap {
  margin-top: var(--sp-5);
}

/* 折叠面板 */
.collapse {
  background: var(--bg-1);
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
}

.collapse__header-icon {
  color: var(--accent);
  font-size: 32rpx;
}

.collapse__header-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-1);
}

.collapse__arrow {
  font-size: 28rpx;
  color: var(--text-3);
  transition: transform 0.3s var(--ease);

  &.rotated {
    transform: rotate(180deg);
    color: var(--primary);
  }
}

.collapse__inner {
  padding: 0 var(--sp-5) var(--sp-5);
}

.notice {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-4);
}

.notice__line {
  font-size: 24rpx;
  color: var(--text-2);
  line-height: 1.8;
  margin-bottom: 8rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.notice__strong {
  color: var(--text-1);
  font-weight: 600;
}

.rate-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: var(--sp-3);
}

.rate-title--mt {
  margin-top: var(--sp-5);
}

.rate-table {
  width: 100%;
  border-radius: var(--r-md);
  overflow: hidden;
  border: 1rpx solid var(--border);
  margin-bottom: var(--sp-4);
}

.rate-row {
  display: flex;
  border-bottom: 1rpx solid var(--border);

  &:last-child {
    border-bottom: none;
  }
}

.rate-row--head {
  border-bottom: 1rpx solid var(--border-strong);
}

.rate-row--head .rate-cell {
  color: var(--text-3);
  font-weight: 500;
  font-size: 22rpx;
}

.rate-cell {
  flex: 1;
  padding: 14rpx 16rpx;
  font-size: 24rpx;
  color: var(--text-2);
  text-align: right;
}

.rate-cell--type {
  flex: 1.2;
  text-align: left;
  color: var(--text-1);
  font-weight: 500;
}

.rate-table--four .rate-cell {
  flex: 1;
}

/* 页脚 */
.footer {
  margin-top: var(--sp-6);
  padding: var(--sp-6) 0;
  text-align: center;
  border-top: 1rpx solid var(--border);
}

.footer__disclaimer {
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-4);
  text-align: left;
}

.footer__disclaimer-title {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--warning);
  margin-bottom: var(--sp-1);
}

.footer__disclaimer-text {
  font-size: 22rpx;
  color: var(--text-3);
  line-height: 1.7;
}

.footer__brand {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--text-2);
  margin-bottom: 8rpx;
}

.footer__line {
  font-size: 22rpx;
  color: var(--text-3);
}

.footer__line--mt {
  margin-top: 8rpx;
}

/* 结果弹层 */
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
  background: rgba(7, 7, 15, 0.8);
}

.modal__card {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  max-height: 90vh;
  background: var(--bg-1);
  border: 1rpx solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
}

.modal__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--text-3);
  background: var(--surface);
  border: 1rpx solid var(--border);
  border-radius: var(--r-pill);
  z-index: 2;
}

.modal__title {
  font-size: 48rpx;
  font-weight: 800;
  margin-bottom: var(--sp-5);
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: var(--sp-8);
}

.modal__body {
  flex: 1;
  min-height: 0;
}

.modal__actions {
  margin-top: var(--sp-5);
}

/* 结果展示 */
.result__header {
  text-align: center;
  padding: var(--sp-5) 0;
  border-bottom: 1rpx solid var(--border);
  margin-bottom: var(--sp-5);
}

.result__label {
  font-size: 24rpx;
  color: var(--text-2);
  margin-bottom: var(--sp-2);
}

.result__value {
  font-size: 64rpx;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.2;
}

.result__sub {
  font-size: 24rpx;
  color: var(--text-3);
  margin-top: var(--sp-2);
}

.result__sub-strong {
  color: var(--text-1);
  font-weight: 600;
}

.result__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.result__item {
  width: calc(50% - var(--sp-3) / 2);
  background: var(--bg-2);
  border: 1rpx solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
}

.result__item--full {
  width: 100%;
}

.result__item-label {
  font-size: 22rpx;
  color: var(--text-3);
  margin-bottom: 8rpx;
}

.result__item-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-1);
}

.result__item-value--primary {
  color: var(--primary);
}

.result__item-value--accent {
  color: var(--accent);
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

.result__section-title {
  font-size: 26rpx;
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

/* 还款明细表 */
.schedule-wrap {
  width: 100%;
  white-space: nowrap;
}

.schedule-table {
  display: inline-flex;
  flex-direction: column;
  min-width: 100%;
}

.schedule-row {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--border);
}

.schedule-row--head {
  border-bottom: 1rpx solid var(--border);
}

.schedule-row--head .cell {
  color: var(--text-3);
  font-weight: 500;
  font-size: 22rpx;
}

.schedule-row--summary {
  border-bottom: none;
  border-top: 1rpx solid var(--border-strong);
  padding-top: 20rpx;

  .cell {
    color: var(--accent);
    font-weight: 700;
  }
}

.cell {
  width: 140rpx;
  padding: 14rpx 12rpx;
  font-size: 22rpx;
  color: var(--text-2);
  text-align: right;
  white-space: nowrap;
}

.cell--period {
  width: 120rpx;
  text-align: left;
  color: var(--text-1);
  font-weight: 500;
}

/* 柱状图 */
.chart {
  display: flex;
  align-items: flex-end;
  gap: 8rpx;
  height: 240rpx;
  padding: var(--sp-2) 0;
}

.chart__bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}

.chart__bars {
  display: flex;
  gap: 4rpx;
  align-items: flex-end;
  height: 160rpx;
  width: 100%;
  justify-content: center;
}

.chart__bar {
  width: 40%;
  min-height: 4rpx;
  border-radius: 6rpx 6rpx 0 0;
}

.chart__bar--principal {
  background: var(--primary);
}

.chart__bar--interest {
  background: var(--accent);
  opacity: 0.6;
}

.chart__month {
  font-size: 18rpx;
  color: var(--text-3);
}

.chart__legend {
  display: flex;
  gap: var(--sp-4);
  justify-content: center;
  margin-top: var(--sp-2);
  font-size: 22rpx;
  color: var(--text-3);
}

.chart__legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.chart__legend-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 4rpx;
}

.chart__legend-dot--principal {
  background: var(--primary);
}

.chart__legend-dot--interest {
  background: var(--accent);
  opacity: 0.6;
}

/* 按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  height: 88rpx;
  padding: 0 var(--sp-6);
  font-size: 30rpx;
  font-weight: 600;
  border-radius: var(--r-md);
}

.btn--primary {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  box-shadow: 0 8rpx 40rpx rgba(139, 92, 246, 0.4);
}
</style>
