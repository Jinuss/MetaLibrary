(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var bg3 = style.getPropertyValue('--bg3').trim();

  var palette = [accent, accent2, accent3, '#9c7c3a', '#6b8e23', '#8b4513', '#4b6985', '#a0522d'];

  // --- Chart 1: 剑谱排名与门派 ---
  var chart1 = echarts.init(document.getElementById('chart-swords'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: bg3,
      borderColor: rule,
      textStyle: { color: ink, fontSize: 13 },
      formatter: function(p) {
        return '<b style="color:' + accent + '">' + p.data.name + '</b><br/>' +
               '排名：第' + p.data.rank + '<br/>' +
               '剑主：' + p.data.wielder + '<br/>' +
               '门派：' + p.data.sect + '<br/>' +
               (p.data.note ? '备注：' + p.data.note : '');
      }
    },
    grid: { left: 120, right: 60, top: 40, bottom: 30 },
    xAxis: {
      type: 'value',
      name: '剑谱排名',
      nameTextStyle: { color: muted, fontSize: 12 },
      min: 0,
      max: 16,
      inverse: true,
      interval: 2,
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.3 } }
    },
    yAxis: {
      type: 'category',
      data: ['墨眉', '残虹', '非攻', '鲨齿', '含光', '天照', '虎魄', '巨阙', '凌虚', '秋骊', '水寒', '雪霁', '干将莫邪', '赤霄', '太阿', '渊虹', '天问'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: ink, fontSize: 12, fontFamily: '"Noto Serif SC", serif' },
      axisTick: { show: false }
    },
    series: [{
      type: 'scatter',
      symbolSize: function(d) { return d[2]; },
      data: [
        { name: '天问', value: [1, 16, 28], rank: 1, wielder: '秦始皇', sect: '帝王', note: '天子之剑', itemStyle: { color: accent } },
        { name: '渊虹', value: [2, 15, 26], rank: 2, wielder: '盖聂', sect: '纵横家', note: '残虹重铸', itemStyle: { color: accent } },
        { name: '太阿', value: [3, 14, 22], rank: 3, wielder: '伏念', sect: '儒家', note: '威道之剑', itemStyle: { color: palette[3] } },
        { name: '赤霄', value: [4, 13, 20], rank: 4, wielder: '刘季（刘邦）', sect: '农家', note: '斩白蛇之剑', itemStyle: { color: '#8b4513' } },
        { name: '干将莫邪', value: [5, 12, 24], rank: 5, wielder: '田赐', sect: '农家', note: '雌雄双剑', itemStyle: { color: '#8b4513' } },
        { name: '雪霁', value: [6, 11, 20], rank: 6, wielder: '逍遥子', sect: '道家人宗', note: '掌门信物', itemStyle: { color: palette[5] } },
        { name: '水寒', value: [7, 10, 22], rank: 7, wielder: '高渐离', sect: '墨家', note: '与渊虹相克', itemStyle: { color: palette[6] } },
        { name: '秋骊', value: [9, 8, 18], rank: 9, wielder: '晓梦', sect: '道家天宗', note: '威力在雪霁之上', itemStyle: { color: palette[5] } },
        { name: '凌虚', value: [10, 7, 16], rank: 10, wielder: '张良', sect: '儒家', note: '无半分血腥', itemStyle: { color: palette[3] } },
        { name: '巨阙', value: [11, 5, 20], rank: 11, wielder: '胜七（陈胜）', sect: '农家', note: '原排名200+', itemStyle: { color: '#8b4513' } },
        { name: '虎魄', value: [12, 4, 16], rank: 12, wielder: '田虎', sect: '农家', note: '', itemStyle: { color: '#8b4513' } },
        { name: '天照', value: [13, 3, 16], rank: 13, wielder: '徐福（云中君）', sect: '阴阳家', note: '', itemStyle: { color: palette[4] } },
        { name: '含光', value: [16, 2, 14], rank: 16, wielder: '颜路', sect: '儒家', note: '儒家二当家', itemStyle: { color: palette[3] } },
        { name: '鲨齿', value: [0, 1, 26], rank: '—', wielder: '卫庄', sect: '流沙', note: '妖剑，未入剑谱', itemStyle: { color: accent2 } },
        { name: '残虹', value: [0, 0, 22], rank: '—', wielder: '荆轲', sect: '—', note: '渊虹前身', itemStyle: { color: accent2 } },
        { name: '墨眉', value: [0, 6, 18], rank: '—', wielder: '荆天明', sect: '墨家', note: '巨子信物', itemStyle: { color: palette[6] } },
        { name: '非攻', value: [0, 9, 16], rank: '—', wielder: '—', sect: '墨家', note: '机关宝剑', itemStyle: { color: palette[6] } }
      ],
      label: {
        show: true,
        position: 'right',
        formatter: function(p) { return p.data.name; },
        color: ink,
        fontSize: 12,
        fontFamily: '"Noto Serif SC", serif'
      },
      labelLine: { show: false }
    }]
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: 门派分布 ---
  var chart2 = echarts.init(document.getElementById('chart-sects'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: bg3,
      borderColor: rule,
      textStyle: { color: ink, fontSize: 13 },
      formatter: '{b}<br/>名剑数量：{c} 柄'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: { color: muted, fontSize: 12 },
      itemWidth: 14,
      itemHeight: 14
    },
    series: [{
      type: 'pie',
      radius: ['38%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: bg2,
        borderWidth: 3
      },
      label: {
        show: true,
        formatter: '{b}\n{c}柄',
        color: ink,
        fontSize: 13,
        fontFamily: '"Noto Serif SC", serif'
      },
      labelLine: {
        lineStyle: { color: rule },
        length: 15,
        length2: 15
      },
      data: [
        { value: 5, name: '农家', itemStyle: { color: '#8b4513' } },
        { value: 3, name: '儒家', itemStyle: { color: palette[3] } },
        { value: 3, name: '墨家', itemStyle: { color: palette[6] } },
        { value: 2, name: '道家', itemStyle: { color: palette[5] } },
        { value: 1, name: '纵横家', itemStyle: { color: accent } },
        { value: 1, name: '帝王', itemStyle: { color: '#c4a000' } },
        { value: 1, name: '阴阳家', itemStyle: { color: palette[4] } },
        { value: 1, name: '流沙', itemStyle: { color: accent2 } }
      ]
    }]
  });
  window.addEventListener('resize', function() { chart2.resize(); });
})();
