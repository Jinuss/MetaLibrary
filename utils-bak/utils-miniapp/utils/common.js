/**
 * uniapp 小程序通用工具
 * 封装与 H5 端 localStorage / DOM 等价的能力，供各页面统一调用
 */

/**
 * 读取本地存储（对齐 localStorage.getItem）
 * @param {string} key
 * @returns {string|null}
 */
export function getStorage(key) {
  try {
    const v = uni.getStorageSync(key);
    return v === "" || v === undefined || v === null ? null : v;
  } catch (e) {
    return null;
  }
}

/**
 * 读取并解析 JSON（对齐 JSON.parse(localStorage.getItem(...))）
 * @param {string} key
 * @param {*} fallback 解析失败时的默认值
 * @returns {*}
 */
export function getStorageJSON(key, fallback = null) {
  const raw = getStorage(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

/**
 * 写入本地存储（对齐 localStorage.setItem）
 * @param {string} key
 * @param {string|number|boolean} value
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value);
  } catch (e) {
    /* ignore */
  }
}

/**
 * 写入 JSON（对齐 localStorage.setItem(key, JSON.stringify(...))）
 */
export function setStorageJSON(key, value) {
  setStorage(key, JSON.stringify(value));
}

/**
 * 移除本地存储
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key);
  } catch (e) {
    /* ignore */
  }
}

/**
 * 页面跳转（对齐 <a href="path">）
 * @param {string} url 形如 /pages/retirement/index
 */
export function navigateTo(url) {
  uni.navigateTo({
    url,
    fail: () => {
      // fallback to switchTab in case it's a tabbar page
      uni.switchTab({ url, fail: () => {} });
    }
  });
}

/**
 * 返回上一页
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({ delta });
}

/**
 * 格式化数字（保留 n 位小数，去除多余 0）
 * @param {number} v
 * @param {number} n
 * @returns {string}
 */
export function fmtNum(v, n = 2) {
  if (v == null || isNaN(v)) return "0";
  return Number(Number(v).toFixed(n)).toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: n
  });
}

/**
 * 格式化货币（带 ¥ 前缀，千分位）
 */
export function fmtMoney(v, n = 2) {
  return "¥" + fmtNum(v, n);
}

/**
 * 节流（用于 onPageScroll 等高频事件）
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function throttle(fn, ms = 100) {
  let last = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    } else if (timer == null) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, ms - (now - last));
    }
  };
}
