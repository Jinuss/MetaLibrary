/**
 * 退休金计算器数据
 * 数据来源：人社部、各省人社厅、政府公开文件（2024-2025年度）
 * 城乡居民地市级数据来源：各省人社厅、地市政府公开文件
 */
window.PENSION_DATA = {

  /* ============================================================
   * 企业城镇职工基本养老保险
   * ============================================================ */
  employee: {
    provinces: [
      { code: "shanghai",   name: "上海",   base: 12307, wageMin: 7460,  wageMax: 37302 },
      { code: "beijing",    name: "北京",   base: 11883, wageMin: 7162,  wageMax: 35811 },
      { code: "guangdong",  name: "广东",   base: 9307,  wageMin: 4775,  wageMax: 27549 },
      { code: "tianjin",    name: "天津",   base: 9232,  wageMin: 5124,  wageMax: 25620 },
      { code: "jiangsu",    name: "江苏",   base: 8785,  wageMin: 4952,  wageMax: 24762 },
      { code: "hubei",      name: "湖北",   base: 8613,  wageMin: 4498,  wageMax: 22488 },
      { code: "sichuan",    name: "四川",   base: 8321,  wageMin: 4588,  wageMax: 22938 },
      { code: "zhejiang",   name: "浙江",   base: 8130,  wageMin: 4986,  wageMax: 25299 },
      { code: "anhui",      name: "安徽",   base: 7842,  wageMin: 4311,  wageMax: 21556 },
      { code: "fujian",     name: "福建",   base: 7776,  wageMin: 4043,  wageMax: 22607 },
      { code: "shaanxi",    name: "陕西",   base: 7727,  wageMin: 4650,  wageMax: 23250 },
      { code: "shandong",   name: "山东",   base: 7678,  wageMin: 4504,  wageMax: 22518 },
      { code: "hunan",      name: "湖南",   base: 7417,  wageMin: 4072,  wageMax: 20361 },
      { code: "chongqing",  name: "重庆",   base: 7339,  wageMin: 4404,  wageMax: 22017 },
      { code: "hebei",      name: "河北",   base: 7265,  wageMin: 4007,  wageMax: 20034 },
      { code: "henan",      name: "河南",   base: 6738,  wageMin: 3831,  wageMax: 19155 }
    ],
    pensionMonths: {
      45: 216, 46: 212, 47: 208, 48: 204, 49: 199,
      50: 195, 51: 190, 52: 185, 53: 180, 54: 175,
      55: 170, 56: 164, 57: 158, 58: 152, 59: 145,
      60: 139, 61: 132, 62: 125, 63: 117, 64: 109,
      65: 101, 66: 93,  67: 84,  68: 75,  69: 65, 70: 56
    },
    transitionalRate: 0.013,
    personalAccountRate: 0.06
  },

  /* ============================================================
   * 城乡居民基本养老保险（含地市级数据）
   * ============================================================ */
  resident: {
    provinces: [
      {
        code: "shanghai", name: "上海", base: 1555,
        cities: [{ code: "shanghai", name: "上海", base: 1555 }]
      },
      {
        code: "beijing", name: "北京", base: 998,
        cities: [{ code: "beijing", name: "北京", base: 998 }]
      },
      {
        code: "jiangsu", name: "江苏", base: 248,
        longPayReward: { type: "percent", rate: 0.01 },
        cities: [
          { code: "nanjing",   name: "南京", base: 616 },
          { code: "suzhou",    name: "苏州", base: 705 },
          { code: "wuxi",      name: "无锡", base: 536 },
          { code: "changzhou", name: "常州", base: 400 },
          { code: "nantong",   name: "南通", base: 344 },
          { code: "zhenjiang", name: "镇江", base: 293 },
          { code: "yangzhou",  name: "扬州", base: 260 },
          { code: "taizhou_js", name: "泰州", base: 248 },
          { code: "xuzhou",    name: "徐州", base: 248 },
          { code: "lianyungang", name: "连云港", base: 248 },
          { code: "suqian",    name: "宿迁", base: 248 },
          { code: "huaian",    name: "淮安", base: 248 },
          { code: "yancheng",  name: "盐城", base: 248 }
        ]
      },
      {
        code: "zhejiang", name: "浙江", base: 295,
        paymentTiers: [
          { amount: 300,  subsidy: 30 },
          { amount: 500,  subsidy: 80 },
          { amount: 1000, subsidy: 200 },
          { amount: 2000, subsidy: 500 },
          { amount: 3000, subsidy: 600 },
          { amount: 5000, subsidy: 600 },
          { amount: 7000, subsidy: 700 }
        ],
        longPayReward: { type: "fixed", amount: 5 },
        cities: [
          { code: "ningbo",   name: "宁波", base: 390 },
          { code: "hangzhou", name: "杭州", base: 370 },
          { code: "wenzhou",  name: "温州", base: 370 },
          { code: "huzhou",   name: "湖州", base: 380 },
          { code: "jiaxing",  name: "嘉兴", base: 380 },
          { code: "jinhua",   name: "金华", base: 370 },
          { code: "shaoxing", name: "绍兴", base: 330 },
          { code: "taizhou_zj", name: "台州", base: 330 },
          { code: "quzhou",   name: "衢州", base: 315 },
          { code: "lishui",   name: "丽水", base: 295 }
        ]
      },
      {
        code: "guangdong", name: "广东", base: 240,
        longPayReward: { type: "fixed", amount: 3 },
        cities: [
          { code: "shenzhen", name: "深圳", base: 620 },
          { code: "guangzhou", name: "广州", base: 580 },
          { code: "zhuhai",  name: "珠海", base: 543 },
          { code: "foshan",  name: "佛山", base: 400 },
          { code: "dongguan", name: "东莞", base: 400 },
          { code: "jiangmen", name: "江门", base: 242 },
          { code: "shaoguan", name: "韶关", base: 240 },
          { code: "zhaoqing", name: "肇庆", base: 240 },
          { code: "other",    name: "其它地市", base: 240 }
        ]
      },
      {
        code: "shandong", name: "山东", base: 208,
        paymentTiers: [
          { amount: 350,  subsidy: 30 },
          { amount: 500,  subsidy: 40 },
          { amount: 1000, subsidy: 60 },
          { amount: 2000, subsidy: 70 },
          { amount: 3000, subsidy: 75 },
          { amount: 5000, subsidy: 80 },
          { amount: 8000, subsidy: 80 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 5 },
          { minAge: 75, amount: 10 }
        ],
        cities: [
          { code: "qingdao",  name: "青岛", base: 258 },
          { code: "dongying", name: "东营", base: 253 },
          { code: "yantai",   name: "烟台", base: 230 },
          { code: "weihai",   name: "威海", base: 220 },
          { code: "jinan",    name: "济南", base: 218 },
          { code: "liaocheng", name: "聊城", base: 218 },
          { code: "taian",    name: "泰安", base: 208 },
          { code: "jining",   name: "济宁", base: 208 },
          { code: "linyi",    name: "临沂", base: 208 },
          { code: "dezhou",   name: "德州", base: 208 },
          { code: "zaozhuang", name: "枣庄", base: 208 },
          { code: "rizhao",   name: "日照", base: 208 },
          { code: "binzhou",  name: "滨州", base: 208 },
          { code: "heze",     name: "菏泽", base: 208 }
        ]
      },
      {
        code: "fujian", name: "福建", base: 190,
        cities: [
          { code: "xiamen", name: "厦门", base: 390 },
          { code: "putian", name: "莆田", base: 205 },
          { code: "zhangzhou", name: "漳州", base: 195 },
          { code: "longyan", name: "龙岩", base: 215 },
          { code: "quanzhou", name: "泉州", base: 192 },
          { code: "fuzhou", name: "福州", base: 190 },
          { code: "sanming", name: "三明", base: 190 },
          { code: "nanping", name: "南平", base: 190 },
          { code: "ningde", name: "宁德", base: 190 }
        ]
      },
      {
        code: "anhui", name: "安徽", base: 195,
        paymentTiers: [
          { amount: 200,  subsidy: 40 },
          { amount: 300,  subsidy: 50 },
          { amount: 400,  subsidy: 60 },
          { amount: 500,  subsidy: 70 },
          { amount: 600,  subsidy: 80 },
          { amount: 700,  subsidy: 90 },
          { amount: 800,  subsidy: 100 },
          { amount: 900,  subsidy: 110 },
          { amount: 1000, subsidy: 120 },
          { amount: 1500, subsidy: 150 },
          { amount: 2000, subsidy: 200 },
          { amount: 3000, subsidy: 200 },
          { amount: 4000, subsidy: 200 },
          { amount: 5000, subsidy: 200 },
          { amount: 6000, subsidy: 200 },
          { amount: 9000, subsidy: 200 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 2 },
          { minAge: 75, amount: 3 }
        ],
        cities: [
          { code: "hefei",    name: "合肥", base: 270 },
          { code: "wuhu",     name: "芜湖", base: 240 },
          { code: "maanshan", name: "马鞍山", base: 238 },
          { code: "luan",     name: "六安", base: 205 },
          { code: "huainan",  name: "淮南", base: 195 },
          { code: "other",     name: "其它地市", base: 195 }
        ]
      },
      {
        code: "henan", name: "河南", base: 173,
        paymentTiers: [
          { amount: 200,  subsidy: 30 },
          { amount: 300,  subsidy: 40 },
          { amount: 400,  subsidy: 50 },
          { amount: 500,  subsidy: 60 },
          { amount: 600,  subsidy: 80 },
          { amount: 700,  subsidy: 100 },
          { amount: 800,  subsidy: 120 },
          { amount: 900,  subsidy: 140 },
          { amount: 1000, subsidy: 160 },
          { amount: 1500, subsidy: 190 },
          { amount: 2000, subsidy: 220 },
          { amount: 2500, subsidy: 250 },
          { amount: 3000, subsidy: 280 },
          { amount: 4000, subsidy: 310 },
          { amount: 5000, subsidy: 340 }
        ],
        cities: [
          { code: "zhengzhou", name: "郑州", base: 240 },
          { code: "luohe",     name: "漯河", base: 185 },
          { code: "anyang",    name: "安阳", base: 184 },
          { code: "nanyang",   name: "南阳", base: 183 },
          { code: "xinxiang",  name: "新乡", base: 175 },
          { code: "zhumadian", name: "驻马店", base: 175 },
          { code: "kaifeng",   name: "开封", base: 173 },
          { code: "xinyang",   name: "信阳", base: 173 },
          { code: "xuchang",   name: "许昌", base: 173 },
          { code: "other",     name: "其它地市", base: 173 }
        ]
      },
      {
        code: "hubei", name: "湖北", base: 172,
        paymentTiers: [
          { amount: 300,  subsidy: 45 },
          { amount: 500,  subsidy: 81 },
          { amount: 700,  subsidy: 81 },
          { amount: 900,  subsidy: 138 },
          { amount: 1000, subsidy: 180 },
          { amount: 1500, subsidy: 285 },
          { amount: 2000, subsidy: 402 },
          { amount: 3000, subsidy: 402 },
          { amount: 5000, subsidy: 402 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        cities: [
          { code: "wuhan",    name: "武汉", base: 367 },
          { code: "jingzhou", name: "荆州", base: 190 },
          { code: "yichang",  name: "宜昌", base: 190 },
          { code: "xiangyang", name: "襄阳", base: 188 },
          { code: "huanggang", name: "黄冈", base: 180 },
          { code: "other",    name: "其它地市", base: 172 }
        ]
      },
      {
        code: "hunan", name: "湖南", base: 176,
        paymentTiers: [
          { amount: 300,  subsidy: 30 },
          { amount: 400,  subsidy: 40 },
          { amount: 500,  subsidy: 60 },
          { amount: 700,  subsidy: 60 },
          { amount: 800,  subsidy: 60 },
          { amount: 1000, subsidy: 60 },
          { amount: 1500, subsidy: 60 },
          { amount: 2000, subsidy: 60 },
          { amount: 2500, subsidy: 60 },
          { amount: 3000, subsidy: 60 },
          { amount: 4000, subsidy: 100 },
          { amount: 5000, subsidy: 100 },
          { amount: 6000, subsidy: 100 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 2 }
        ],
        cities: [
          { code: "changde",  name: "常德", base: 195 },
          { code: "hengyang", name: "衡阳", base: 214 },
          { code: "changsha", name: "长沙", base: 185 },
          { code: "other",    name: "其它地市", base: 176 }
        ]
      },
      {
        code: "hebei", name: "河北", base: 188,
        paymentTiers: [
          { amount: 200,  subsidy: 30 },
          { amount: 300,  subsidy: 30 },
          { amount: 400,  subsidy: 30 },
          { amount: 500,  subsidy: 60 },
          { amount: 800,  subsidy: 60 },
          { amount: 1000, subsidy: 60 },
          { amount: 2000, subsidy: 60 },
          { amount: 3000, subsidy: 60 },
          { amount: 5000, subsidy: 60 },
          { amount: 8000, subsidy: 60 }
        ],
        ageAdjust: [
          { minAge: 65, amount: 2 },
          { minAge: 75, amount: 3 }
        ],
        cities: [
          { code: "cangzhou",   name: "沧州", base: 212 },
          { code: "shijiazhuang", name: "石家庄", base: 210 },
          { code: "tangshan",   name: "唐山", base: 205 },
          { code: "handan",     name: "邯郸", base: 200 },
          { code: "zhangjiakou", name: "张家口", base: 200 },
          { code: "chengde",    name: "承德", base: 200 },
          { code: "baoding",   name: "保定", base: 195 },
          { code: "dingzhou",  name: "定州", base: 198 },
          { code: "other",     name: "其它地市", base: 188 }
        ]
      },
      {
        code: "sichuan", name: "四川", base: 193,
        paymentTiers: [
          { amount: 100,  subsidy: 40 },
          { amount: 200,  subsidy: 45 },
          { amount: 300,  subsidy: 50 },
          { amount: 400,  subsidy: 60 },
          { amount: 500,  subsidy: 60 },
          { amount: 600,  subsidy: 65 },
          { amount: 700,  subsidy: 70 },
          { amount: 800,  subsidy: 75 },
          { amount: 900,  subsidy: 80 },
          { amount: 1000, subsidy: 100 },
          { amount: 1500, subsidy: 120 },
          { amount: 2000, subsidy: 160 },
          { amount: 3000, subsidy: 200 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        cities: [
          { code: "chengdu",  name: "成都", base: 213 },
          { code: "other",    name: "其它地市", base: 193 }
        ]
      },
      {
        code: "shaanxi", name: "陕西", base: 188,
        paymentTiers: [
          { amount: 300,  subsidy: 45 },
          { amount: 500,  subsidy: 75 },
          { amount: 800,  subsidy: 90 },
          { amount: 1000, subsidy: 100 },
          { amount: 1500, subsidy: 150 },
          { amount: 2000, subsidy: 200 },
          { amount: 3000, subsidy: 300 },
          { amount: 4000, subsidy: 300 },
          { amount: 5000, subsidy: 300 },
          { amount: 6000, subsidy: 300 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 5 },
          { minAge: 80, amount: 10 }
        ],
        cities: [
          { code: "xian",    name: "西安", base: 239 },
          { code: "yanan",   name: "延安", base: 225 },
          { code: "hanzhong", name: "汉中", base: 206 },
          { code: "weinan",  name: "渭南", base: 192 },
          { code: "other",   name: "其它地市", base: 188 }
        ]
      },
      {
        code: "chongqing", name: "重庆", base: 165,
        paymentTiers: [
          { amount: 100,  subsidy: 30 },
          { amount: 200,  subsidy: 40 },
          { amount: 300,  subsidy: 50 },
          { amount: 400,  subsidy: 60 },
          { amount: 500,  subsidy: 70 },
          { amount: 800,  subsidy: 100 },
          { amount: 1000, subsidy: 110 },
          { amount: 1500, subsidy: 120 },
          { amount: 2000, subsidy: 130 },
          { amount: 3000, subsidy: 140 },
          { amount: 4000, subsidy: 160 },
          { amount: 5000, subsidy: 175 },
          { amount: 6000, subsidy: 180 },
          { amount: 7000, subsidy: 180 },
          { amount: 8000, subsidy: 180 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 5 }
        ],
        cities: [
          { code: "chongqing", name: "重庆", base: 165 }
        ]
      },
      {
        code: "liaoning", name: "辽宁", base: 174,
        paymentTiers: [
          { amount: 200,  subsidy: 40 },
          { amount: 300,  subsidy: 50 },
          { amount: 500,  subsidy: 70 },
          { amount: 800,  subsidy: 100 },
          { amount: 1000, subsidy: 120 },
          { amount: 2000, subsidy: 140 },
          { amount: 3000, subsidy: 160 },
          { amount: 4000, subsidy: 170 },
          { amount: 5000, subsidy: 180 }
        ],
        longPayReward: { type: "fixed", amount: 2 },
        ageAdjust: [
          { minAge: 65, amount: 5 },
          { minAge: 80, amount: 10 }
        ],
        cities: [
          { code: "dalian",   name: "大连", base: 284 },
          { code: "shenyang", name: "沈阳", base: 234 },
          { code: "other",    name: "其它地市", base: 174 }
        ]
      },
      {
        code: "heilongjiang", name: "黑龙江", base: 193,
        paymentTiers: [
          { amount: 200,  subsidy: 40 },
          { amount: 300,  subsidy: 50 },
          { amount: 400,  subsidy: 60 },
          { amount: 500,  subsidy: 70 },
          { amount: 600,  subsidy: 70 },
          { amount: 800,  subsidy: 70 },
          { amount: 1000, subsidy: 70 },
          { amount: 1500, subsidy: 100 },
          { amount: 2000, subsidy: 120 },
          { amount: 3000, subsidy: 140 },
          { amount: 4000, subsidy: 140 },
          { amount: 5000, subsidy: 140 }
        ],
        ageAdjust: [
          { minAge: 65, amount: 5 },
          { minAge: 80, amount: 10 }
        ],
        cities: [
          { code: "haerbin_city", name: "哈尔滨（市区）", base: 213 },
          { code: "haerbin_county", name: "哈尔滨（县城）", base: 193 },
          { code: "jiamusi",  name: "佳木斯", base: 193 },
          { code: "daqing",   name: "大庆", base: 193 },
          { code: "other",    name: "其它地市", base: 193 }
        ]
      },
      {
        code: "tianjin", name: "天津", base: 245,
        cities: [{ code: "tianjin", name: "天津", base: 245 }]
      },
      {
        code: "tibet", name: "西藏", base: 295,
        cities: [{ code: "tibet", name: "西藏", base: 295 }]
      },
      {
        code: "hainan", name: "海南", base: 271,
        cities: [{ code: "hainan", name: "海南", base: 271 }]
      },
      {
        code: "ningxia", name: "宁夏", base: 220,
        cities: [{ code: "ningxia", name: "宁夏", base: 220 }]
      },
      {
        code: "qinghai", name: "青海", base: 210,
        cities: [{ code: "qinghai", name: "青海", base: 210 }]
      },
      {
        code: "neimenggu", name: "内蒙古", base: 197,
        cities: [{ code: "neimenggu", name: "内蒙古", base: 197 }]
      },
      {
        code: "xinjiang", name: "新疆", base: 195,
        cities: [{ code: "xinjiang", name: "新疆", base: 195 }]
      },
      {
        code: "guangxi", name: "广西", base: 186,
        cities: [{ code: "guangxi", name: "广西", base: 186 }]
      },
      {
        code: "guizhou", name: "贵州", base: 178,
        cities: [{ code: "guizhou", name: "贵州", base: 178 }]
      },
      {
        code: "jiangxi", name: "江西", base: 173,
        cities: [{ code: "jiangxi", name: "江西", base: 173 }]
      },
      {
        code: "gansu", name: "甘肃", base: 168,
        cities: [{ code: "gansu", name: "甘肃", base: 168 }]
      },
      {
        code: "yunnan", name: "云南", base: 163,
        cities: [{ code: "yunnan", name: "云南", base: 163 }]
      },
      {
        code: "shanxi", name: "山西", base: 156,
        cities: [{ code: "shanxi", name: "山西", base: 156 }]
      },
      {
        code: "jilin", name: "吉林", base: 154,
        cities: [{ code: "jilin", name: "吉林", base: 154 }]
      }
    ],

    // 全国统一缴费档次（未单独设档的省份使用此默认值）
    defaultPaymentTiers: [
      { amount: 100,  subsidy: 30 },
      { amount: 200,  subsidy: 30 },
      { amount: 300,  subsidy: 40 },
      { amount: 400,  subsidy: 50 },
      { amount: 500,  subsidy: 60 },
      { amount: 600,  subsidy: 70 },
      { amount: 700,  subsidy: 80 },
      { amount: 800,  subsidy: 90 },
      { amount: 900,  subsidy: 100 },
      { amount: 1000, subsidy: 120 },
      { amount: 1500, subsidy: 150 },
      { amount: 2000, subsidy: 180 },
      { amount: 3000, subsidy: 220 },
      { amount: 4000, subsidy: 260 },
      { amount: 5000, subsidy: 300 }
    ],

    pensionMonths: 139,
    retireAge: 60,
    minYears: 15
  },

  /* ============================================================
   * 全国数据
   * ============================================================ */
  national: {
    residentBaseMin: 143,
    residentBaseMin2025: 163,
    accountInterestRate: 0.06
  },

  /* ============================================================
   * 各地人社部门联系方式
   * 数据来源：各地人社局官网、12333平台
   * 多数城市统一使用12333热线，外地拨打需加区号
   * ============================================================ */
  agencies: {
    // 直辖市
    beijing:  { name: "北京市人力资源和社会保障局", phone: "010-12333", address: "西城区永定门西街7号" },
    shanghai: { name: "上海市人力资源和社会保障局", phone: "021-23111111", address: "浦东新区世博村路300号2号楼" },
    tianjin:  { name: "天津市人力资源和社会保障局", phone: "022-12333", address: "和平区建设路18号" },
    chongqing:{ name: "重庆市人力资源和社会保障局", phone: "023-12333", address: "两江新区春华大道99号" },

    // 省级（企业职工无城市选择时使用）
    guangdong: { name: "广东省人力资源和社会保障厅", phone: "020-12333", address: "广州市越秀区教育路88号" },
    jiangsu:   { name: "江苏省人力资源和社会保障厅", phone: "025-12333", address: "南京市北京西路16号" },
    hubei:     { name: "湖北省人力资源和社会保障厅", phone: "027-12333", address: "武汉市武昌区水果湖路10号" },
    sichuan:   { name: "四川省人力资源和社会保障厅", phone: "028-12333", address: "成都市青羊区陕西街54号" },
    zhejiang:  { name: "浙江省人力资源和社会保障厅", phone: "0571-12333", address: "杭州市西湖区省府路8号" },
    anhui:     { name: "安徽省人力资源和社会保障厅", phone: "0551-12333", address: "合肥市庐阳区长江中路333号" },
    fujian:    { name: "福建省人力资源和社会保障厅", phone: "0591-12333", address: "福州市鼓楼区鼓屏路61号" },
    shaanxi:   { name: "陕西省人力资源和社会保障厅", phone: "029-12333", address: "西安市新城区新城大院" },
    shandong:  { name: "山东省人力资源和社会保障厅", phone: "0531-12333", address: "济南市历下区解放路16号" },
    hunan:     { name: "湖南省人力资源和社会保障厅", phone: "0731-12333", address: "长沙市天心区青园路1号" },
    hebei:     { name: "河北省人力资源和社会保障厅", phone: "0311-12333", address: "石家庄市新华区维明北大街118号" },
    henan:     { name: "河南省人力资源和社会保障厅", phone: "0371-12333", address: "郑州市金水区政五街2号" },

    // 江苏
    nanjing:      { name: "南京市人社局", phone: "025-12333", address: "建邺区水西门大街61号" },
    suzhou:       { name: "苏州市人社局", phone: "0512-12333", address: "姑苏区平泷路251号" },
    wuxi:         { name: "无锡市人社局", phone: "0510-12333", address: "观山路市民中心4号楼" },
    changzhou:    { name: "常州市人社局", phone: "0519-12333", address: "龙城大道1280号市行政中心1号楼B座" },
    nantong:      { name: "南通市人社局", phone: "0513-12333", address: "工农南路150号市政务服务中心" },
    zhenjiang:    { name: "镇江市人社局", phone: "0511-12333", address: "运河路79号" },
    yangzhou:     { name: "扬州市人社局", phone: "0514-12333", address: "扬州市文昌中路" },
    taizhou_js:   { name: "泰州市人社局", phone: "0523-12333", address: "泰州市海陵区" },
    xuzhou:       { name: "徐州市人社局", phone: "0516-12333", address: "徐州市云龙区" },
    lianyungang:  { name: "连云港市人社局", phone: "0518-12333", address: "海州区朝阳东路22号" },
    suqian:       { name: "宿迁市人社局", phone: "0527-12333", address: "洪泽湖路891号便民方舟1号楼" },
    huaian:       { name: "淮安市人社局", phone: "0517-12333", address: "翔宇中道150号" },
    yancheng:     { name: "盐城市人社局", phone: "0515-12333", address: "世纪大道19号城投商务楼" },

    // 浙江
    hangzhou: { name: "杭州市人社局", phone: "0571-12333", address: "西湖区古翠路50号" },
    ningbo:   { name: "宁波市人社局", phone: "0574-12333", address: "宁波市鄞州区" },
    wenzhou:  { name: "温州市人社局", phone: "0577-12333", address: "温州市鹿城区" },
    huzhou:   { name: "湖州市人社局", phone: "0572-12333", address: "湖州市吴兴区" },
    jiaxing:  { name: "嘉兴市人社局", phone: "0573-12333", address: "嘉兴市南湖区" },
    jinhua:   { name: "金华市人社局", phone: "0579-12333", address: "金华市婺城区" },
    shaoxing: { name: "绍兴市人社局", phone: "0575-12333", address: "绍兴市越城区" },
    taizhou_zj: { name: "台州市人社局", phone: "0576-12333", address: "台州市椒江区" },
    quzhou:   { name: "衢州市人社局", phone: "0570-12333", address: "衢州市柯城区" },
    lishui:   { name: "丽水市人社局", phone: "0578-12333", address: "丽水市莲都区" },

    // 广东
    guangzhou: { name: "广州市人社局", phone: "020-12333", address: "越秀区连新路43号" },
    shenzhen:  { name: "深圳市人社局", phone: "0755-12333", address: "福田区深南大道8005号深圳人才园" },
    zhuhai:    { name: "珠海市人社局", phone: "0756-12333", address: "珠海市香洲区" },
    foshan:    { name: "佛山市人社局", phone: "0757-12333", address: "佛山市禅城区" },
    dongguan:  { name: "东莞市人社局", phone: "0769-12345", address: "南城鸿福路199号市民服务中心" },
    jiangmen:  { name: "江门市人社局", phone: "0750-12333", address: "江门市蓬江区" },
    shaoguan:  { name: "韶关市人社局", phone: "0751-12333", address: "韶关市武江区" },
    zhaoqing:  { name: "肇庆市人社局", phone: "0758-12333", address: "肇庆市端州区" },

    // 山东
    jinan:      { name: "济南市人社局", phone: "0531-12333", address: "历下区解放东路16号" },
    qingdao:    { name: "青岛市人社局", phone: "0532-12333", address: "青岛市市南区" },
    yantai:     { name: "烟台市人社局", phone: "0535-12333", address: "烟台市莱山区" },
    weihai:      { name: "威海市人社局", phone: "0631-12333", address: "环翠区胶州路7号" },
    dongying:   { name: "东营市人社局", phone: "0546-12333", address: "东营市东营区" },
    jining:     { name: "济宁市人社局", phone: "0537-12333", address: "济宁市任城区" },
    liaocheng:  { name: "聊城市人社局", phone: "0635-12333", address: "聊城市东昌府区" },
    taian:      { name: "泰安市人社局", phone: "0538-12333", address: "泰安市泰山区" },
    linyi:      { name: "临沂市人社局", phone: "0539-12333", address: "北城新区北京路8号政务服务中心" },
    dezhou:     { name: "德州市人社局", phone: "0534-12333", address: "德州市德城区" },
    zaozhuang:  { name: "枣庄市人社局", phone: "0632-12333", address: "枣庄市薛城区" },
    rizhao:     { name: "日照市人社局", phone: "0633-12333", address: "日照市东港区" },
    binzhou:    { name: "滨州市人社局", phone: "0543-12333", address: "滨州市滨城区" },
    heze:       { name: "菏泽市人社局", phone: "0530-12333", address: "菏泽市牡丹区" },

    // 河南
    zhengzhou:  { name: "郑州市人社局", phone: "0371-12333", address: "郑东新区正光路11号" },
    kaifeng:    { name: "开封市人社局", phone: "0378-12333", address: "开封市鼓楼区" },
    xinyang:    { name: "信阳市人社局", phone: "0376-12333", address: "信阳市浉河区" },
    anyang:     { name: "安阳市人社局", phone: "0372-12333", address: "安阳市文峰区" },
    nanyang:    { name: "南阳市人社局", phone: "0377-12333", address: "南阳市卧龙区" },
    xinxiang:   { name: "新乡市人社局", phone: "0373-12333", address: "新乡市红旗区" },
    xuchang:    { name: "许昌市人社局", phone: "0374-12333", address: "许昌市魏都区" },
    zhumadian:  { name: "驻马店市人社局", phone: "0396-12333", address: "驻马店市驿城区" },
    luohe:      { name: "漯河市人社局", phone: "0395-12333", address: "漯河市源汇区" },

    // 四川
    chengdu:    { name: "成都市人社局", phone: "028-12333", address: "锦城大道366号3号楼" },

    // 安徽
    hefei:      { name: "合肥市人社局", phone: "0551-12333", address: "政务区政务环路88号" },
    wuhu:       { name: "芜湖市人社局", phone: "0553-12333", address: "鸠江区政通路66号" },
    maanshan:   { name: "马鞍山市人社局", phone: "0555-12333", address: "湖南东路900号" },
    huainan:    { name: "淮南市人社局", phone: "0554-12333", address: "田家庵区陈洞南路21号" },
    luan:       { name: "六安市人社局", phone: "0564-12333", address: "裕安区佛子岭路人力资源大厦" },

    // 湖北
    wuhan:      { name: "武汉市人社局", phone: "027-12333", address: "江岸区金桥大道111号" },
    jingzhou:   { name: "荆州市人社局", phone: "0716-12333", address: "荆州市沙市区" },
    yichang:    { name: "宜昌市人社局", phone: "0717-12333", address: "宜昌市西陵区" },
    xiangyang:  { name: "襄阳市人社局", phone: "0710-12333", address: "襄阳市樊城区" },
    huanggang:  { name: "黄冈市人社局", phone: "0713-12333", address: "黄冈市黄州区" },

    // 湖南
    changsha:   { name: "长沙市人社局", phone: "0731-12333", address: "长沙市岳麓区" },
    changde:    { name: "常德市人社局", phone: "0736-12333", address: "武陵区柳叶大道189号" },
    hengyang:   { name: "衡阳市人社局", phone: "0734-12333", address: "衡阳市蒸湘区" },

    // 河北
    shijiazhuang: { name: "石家庄市人社局", phone: "0311-12333", address: "桥西区自强路128号省招大厦3楼" },
    tangshan:     { name: "唐山市人社局", phone: "0315-12333", address: "唐山市路北区" },
    handan:       { name: "邯郸市人社局", phone: "0310-12333", address: "邯郸市丛台区" },
    zhangjiakou:  { name: "张家口市人社局", phone: "0313-12333", address: "张家口市桥东区" },
    chengde:      { name: "承德市人社局", phone: "0314-12333", address: "承德市双桥区" },
    baoding:      { name: "保定市人社局", phone: "0312-12333", address: "保定市竞秀区" },
    cangzhou:     { name: "沧州市人社局", phone: "0317-12333", address: "沧州市运河区" },

    // 陕西
    xian:       { name: "西安市人社局", phone: "029-12333", address: "凤城八路109号" },
    yanan:      { name: "延安市人社局", phone: "0911-12333", address: "延安市宝塔区" },
    hanzhong:   { name: "汉中市人社局", phone: "0916-12333", address: "汉中市汉台区" },
    weinan:     { name: "渭南市人社局", phone: "0913-12333", address: "渭南市临渭区" },

    // 辽宁
    shenyang:   { name: "沈阳市人社局", phone: "024-12333", address: "和平区和平北大街59号" },
    dalian:     { name: "大连市人社局", phone: "0411-12333", address: "沙河口区联合路100号" },

    // 黑龙江
    haerbin_city:    { name: "哈尔滨市人社局", phone: "0451-12333", address: "哈尔滨市道里区" },
    jiamusi:         { name: "佳木斯市人社局", phone: "0454-12333", address: "佳木斯市前进区" },
    daqing:          { name: "大庆市人社局", phone: "0459-12333", address: "大庆市萨尔图区" },

    // 福建
    xiamen:     { name: "厦门市人社局", phone: "0592-12333", address: "厦门市思明区" },
    putian:     { name: "莆田市人社局", phone: "0594-12333", address: "莆田市城厢区" },
    zhangzhou:  { name: "漳州市人社局", phone: "0596-12333", address: "漳州市芗城区" },
    longyan:    { name: "龙岩市人社局", phone: "0597-12333", address: "龙岩市新罗区" },
    quanzhou:   { name: "泉州市人社局", phone: "0595-12333", address: "泉州市丰泽区" },
    fuzhou:     { name: "福州市人社局", phone: "0591-12333", address: "福州市鼓楼区" },
    sanming:    { name: "三明市人社局", phone: "0598-12333", address: "三明市梅列区" },
    nanping:    { name: "南平市人社局", phone: "0599-12333", address: "南平市延平区" },
    ningde:     { name: "宁德市人社局", phone: "0593-12333", address: "宁德市蕉城区" },

    // 其它省份默认（未单独搜集的地市）
    tibet:      { name: "西藏自治区人社厅", phone: "0891-12333", address: "拉萨市城关区" },
    hainan:     { name: "海南省人社厅", phone: "0898-12333", address: "海口市美兰区" },
    ningxia:    { name: "宁夏自治区人社厅", phone: "0951-12333", address: "银川市金凤区" },
    qinghai:    { name: "青海省人社厅", phone: "0971-12333", address: "西宁市城西区" },
    neimenggu:  { name: "内蒙古自治区人社厅", phone: "0471-12333", address: "呼和浩特市赛罕区" },
    xinjiang:   { name: "新疆自治区人社厅", phone: "0991-12333", address: "乌鲁木齐市天山区" },
    guangxi:    { name: "广西自治区人社厅", phone: "0771-12333", address: "南宁市青秀区" },
    guizhou:    { name: "贵州省人社厅", phone: "0851-12333", address: "贵阳市云岩区" },
    jiangxi:    { name: "江西省人社厅", phone: "0791-12333", address: "南昌市红谷滩区" },
    gansu:      { name: "甘肃省人社厅", phone: "0931-12333", address: "兰州市城关区" },
    yunnan:     { name: "云南省人社厅", phone: "0871-12333", address: "昆明市西山区" },
    shanxi:     { name: "山西省人社厅", phone: "0351-12333", address: "太原市万柏林区" },
    jilin:      { name: "吉林省人社厅", phone: "0431-12333", address: "长春市南关区" }
  },

  // 默认联系方式（未匹配到具体城市时使用）
  defaultAgency: {
    name: "当地人力资源和社会保障局",
    phone: "12333",
    address: "请通过12333热线查询当地人社部门地址"
  }
};
