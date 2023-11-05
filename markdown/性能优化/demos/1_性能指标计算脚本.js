// @ts-nocheck
!(function () {
  const percentFormat = (number) => {
    return Number(number * 100).toFixed(2);
  };

  /**
   * 获取缓存命中率相关数据
   * @returns
   */
  const getCacheData = () => {
    const result = {
      // js 缓存相关
      jsCacheAll: 0,
      jsCacheNumbers: 0,
      // css 缓存相关
      cssCacheAll: 0,
      cssCacheNumbers: 0,
      // img 缓存相关
      imgCacheAll: 0,
      imgCacheNumbers: 0,
    };

    const entries = performance.getEntries();

    /**
     * 判断资源是否命中了缓存
     * @param {*} entry
     * @returns
     */
    const isCache = (entry) => {
      // 直接从缓存读取或 304
      return (
        // 强制缓存的情况
        entry.transferSize === 0 ||
        // 协商缓存的情况
        (entry.transferSize !== 0 && entry.encodedBodySize === 0)
      );
    };

    /**
     * 判断资源的类型
     * @param {*} item
     * @returns
     */
    const judgeEntriesType = (item) => {
      const { initiatorType, name } = item;

      if (initiatorType === 'link' && name.includes('.css')) {
        return 'css';
      } else if (initiatorType === 'script' && name.includes('.js')) {
        return 'js';
      } else if (initiatorType === 'img' && !name.includes('hm.baidu.com')) {
        return 'img';
      }

      return 'other';
    };

    entries.forEach((ele) => {
      const type = judgeEntriesType(ele);
      if (type !== 'other') {
        const indexAll = `${type}CacheAll`;
        const indexNumbers = `${type}CacheNumbers`;

        result[indexAll] += 1;
        if (isCache(ele)) {
          result[indexNumbers] += 1;
        }
      }
    });

    console.log(result);
    return result;
  };

  const fn = () => {
    const entries = performance.getEntries();
    const p = entries[0];

    // 常用指标
    const DCL = p.domContentLoadedEventEnd - p.fetchStart;
    const L = p.loadEventEnd - p.fetchStart;
    const cacheObj = getCacheData();

    // 非常用指标
    const DNSTime = p.domainLookupEnd - p.domainLookupStart;
    const TCPTime = p.connectEnd - p.secureConnectionStart;
    const SSLTime = p.connectEnd - p.connectStart;
    const urlRequestTime = p.responseStart - p.requestStart;
    const urlResponseTime = p.responseEnd - p.requestStart;
    const htmlLoadTime = p.responseEnd - p.fetchStart;

    // 其他`
    const domTagNumber = document.getElementsByTagName('*').length;

    let t1 = undefined;
    let t2 = undefined;

    entries.forEach((ele) => {
      if (ele.name === 'first-paint') {
        t1 = ele.startTime - p.fetchStart;
      } else if (ele.name === 'first-contentful-paint') {
        t2 = ele.startTime - p.fetchStart;
      }
    });

    const result = `
      FP: ${t1}
      FCP: ${t2}
      DOMContentLoaded: ${DCL}
      Load: ${L}
      js缓存命中率: ${percentFormat(
        cacheObj.jsCacheNumbers / cacheObj.jsCacheAll
      )}%
      css缓存命中率: ${percentFormat(
        cacheObj.cssCacheNumbers / cacheObj.cssCacheAll
      )}%
      img缓存命中率: ${percentFormat(
        cacheObj.imgCacheNumbers / cacheObj.imgCacheAll
      )}%

      DNS解析耗时: ${DNSTime}
      TCP连接耗时: ${TCPTime}
      SSL安全链接耗时: ${SSLTime}
      Request耗时: ${urlRequestTime}
      Response耗时: ${urlResponseTime}
      html文档加载耗时: ${htmlLoadTime}

      页面中tag数量: ${domTagNumber}
      `;
    console.log(result);

    // 输出 LCP 相关信息
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('LCP DOM=', entry.element, `time=${entry.startTime}`);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // 输出 CLS 相关信息
    // new PerformanceObserver((entryList) => {
    //   for (const entry of entryList.getEntries()) {
    //     // console.log('Layout shift:', entry);
    //     console.log('Layout shift:', entry.value);
    //   }
    // }).observe({ type: 'layout-shift', buffered: true });
  };

  if (document.readyState === 'complete') {
    fn();
  } else {
    window.addEventListener('load', (_event) => {
      setTimeout(() => {
        fn();
      });
    });
  }
})();
