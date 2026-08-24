(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: Power Ranking Bar Chart ---
  var chart1 = echarts.init(document.getElementById('chart-power-ranking'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      backgroundColor: 'rgba(20,20,28,0.95)',
      borderColor: accent,
      textStyle: { color: ink, fontSize: 13 }
    },
    grid: { left: '8%', right: '5%', top: '12%', bottom: '15%' },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    yAxis: {
      type: 'category',
      data: ['卜云鹤', '温上师', '窟耀', '陆元镇', '马知墨', '谷双蒲', '天哭先生', '乐上师', '韩立', '仲神师'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: ink, fontSize: 12 }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 45, itemStyle: { color: '#5B8C5A' } },
        { value: 52, itemStyle: { color: '#8B5E3C' } },
        { value: 55, itemStyle: { color: '#8B5E3C' } },
        { value: 55, itemStyle: { color: '#5B8C5A' } },
        { value: 56, itemStyle: { color: '#5B8C5A' } },
        { value: 60, itemStyle: { color: '#7B6B8B' } },
        { value: 62, itemStyle: { color: '#8B5E3C' } },
        { value: 78, itemStyle: { color: '#8B5E3C' } },
        { value: 82, itemStyle: { color: '#5B8C5A' } },
        { value: 95, itemStyle: { color: '#C0392B' } }
      ],
      barWidth: '55%',
      label: {
        show: true,
        position: 'right',
        color: muted,
        fontSize: 11,
        formatter: '{c}'
      }
    }]
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: Radar Chart - Both Sides Comparison ---
  var chart2 = echarts.init(document.getElementById('chart-radar-comparison'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: { appendToBody: true, backgroundColor: 'rgba(20,20,28,0.95)', borderColor: accent, textStyle: { color: ink, fontSize: 13 } },
    legend: {
      data: ['天南方面', '慕兰方面'],
      bottom: 0,
      textStyle: { color: muted, fontSize: 12 },
      itemWidth: 15,
      itemHeight: 10
    },
    radar: {
      indicator: [
        { name: '元婴数量', max: 10 },
        { name: '顶尖战力', max: 10 },
        { name: '法宝底蕴', max: 10 },
        { name: '阵法加成', max: 10 },
        { name: '战术谋略', max: 10 },
        { name: '协同配合', max: 10 }
      ],
      center: ['50%', '48%'],
      radius: '62%',
      axisName: { color: ink, fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.03)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [5, 7, 7, 8, 6, 6],
          name: '天南方面',
          itemStyle: { color: '#5B8C5A' },
          areaStyle: { color: 'rgba(91,140,90,0.25)' },
          lineStyle: { color: '#5B8C5A', width: 2 }
        },
        {
          value: [4, 8, 7, 3, 7, 7],
          name: '慕兰方面',
          itemStyle: { color: '#C0392B' },
          areaStyle: { color: 'rgba(192,57,43,0.25)' },
          lineStyle: { color: '#C0392B', width: 2 }
        }
      ]
    }]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // --- Chart 3: Battle Outcome Pie Chart ---
  var chart3 = echarts.init(document.getElementById('chart-outcome'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: { appendToBody: true, backgroundColor: 'rgba(20,20,28,0.95)', borderColor: accent, textStyle: { color: ink, fontSize: 13 } },
    legend: {
      bottom: 0,
      textStyle: { color: muted, fontSize: 11 },
      itemWidth: 12,
      itemHeight: 10
    },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '45%'],
      data: [
        { value: 1, name: '阵亡(陆元镇)', itemStyle: { color: '#7B1B0E' } },
        { value: 2, name: '逃遁(韩立、马知墨)', itemStyle: { color: '#D4823A' } },
        { value: 1, name: '伤退(卜云鹤)', itemStyle: { color: '#8B7355' } },
        { value: 2, name: '结丹逃遁(缨宁、慕容)', itemStyle: { color: '#5B7B6B' } }
      ],
      label: {
        color: ink,
        fontSize: 11,
        formatter: '{b}\n{d}%'
      },
      labelLine: { lineStyle: { color: rule } },
      itemStyle: { borderColor: bg2, borderWidth: 2 }
    }]
  });
  window.addEventListener('resize', function() { chart3.resize(); });
})();
