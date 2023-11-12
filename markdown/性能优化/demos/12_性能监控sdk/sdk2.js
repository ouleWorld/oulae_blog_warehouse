/**
 * 生成 length 长度的字符串
 * @param {*} length
 * @returns
 */
function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function performanceBase() {
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
    // console.log(result);

    this.log({ type: 'performance', name: 'FP', t: t1 });
    this.log({ type: 'performance', name: 'FCP', t: t2 });
    this.log({ type: 'performance', name: 'DOMContentLoaded', t: DCL });
    this.log({ type: 'performance', name: 'Load', t: L });
    this.log({
      type: 'performance',
      name: 'js缓存命中率',
      t: percentFormat(cacheObj.jsCacheNumbers / cacheObj.jsCacheAll),
    });
    this.log({
      type: 'performance',
      name: 'css缓存命中率',
      t: percentFormat(cacheObj.cssCacheNumbers / cacheObj.cssCacheAll),
    });
    this.log({
      type: 'performance',
      name: 'img缓存命中率',
      t: percentFormat(cacheObj.imgCacheNumbers / cacheObj.imgCacheAll),
    });
    this.log({ type: 'performance', name: 'DNS解析耗时', t: DNSTime });
    this.log({ type: 'performance', name: 'TCP连接耗时', t: TCPTime });
    this.log({ type: 'performance', name: 'SSL安全链接耗时', t: SSLTime });
    this.log({ type: 'performance', name: 'Request耗时', t: urlRequestTime });
    this.log({ type: 'performance', name: 'Response耗时', t: urlResponseTime });
    this.log({
      type: 'performance',
      name: 'html文档加载耗时',
      t: htmlLoadTime,
    });
    this.log({ type: 'performance', name: '页面中tag数量', t: domTagNumber });

    // 输出 LCP 相关信息
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // console.log('LCP DOM=', entry.element, `time=${entry.startTime}`);
        this.log({
          type: 'performance',
          name: 'LCP',
          dom: entry.element,
          t: entry.startTime,
        });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // 输出 CLS 相关信息
    // new PerformanceObserver((entryList) => {
    //   for (const entry of entryList.getEntries()) {
    //     // console.log('Layout shift:', entry);
    //     console.log('Layout shift:', entry.value);
    //     this.log({ type: 'performance', value: entry.value })
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
}

function performanceMutationObserver() {
  const logFn = this.log.bind(this);
  let observer = undefined; // MutationObserver 监听的对象
  let entries = []; // observer 监听的元素变动集
  const viewportWidth = window.innerWidth; // 页面宽度
  const viewportHeight = window.innerHeight; // 页面高度

  // MutationObserver 监听函数
  function observeFirstScreenPaint() {
    if (!MutationObserver) return;

    const next = window.requestAnimationFrame || setTimeout;

    // 不需要判断的 DOM
    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META'];

    observer = new MutationObserver((mutationList) => {
      const entry = {
        startTime: 0,
        children: [],
      };

      // 在重绘之前获取时间
      next(() => {
        entry.startTime = performance.now();
      });

      for (const mutation of mutationList) {
        if (mutation.addedNodes.length) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (
              node.nodeType === 1 &&
              !ignoreDOMList.includes(node.tagName) &&
              !isInclude(node, entry.children)
            ) {
              entry.children.push(node);
            }
          }
        }
      }

      if (entry.children.length) {
        entries.push(entry);
      }
    });

    observer.observe(document, {
      childList: true, // 监听 target 节点中发生的节点的新增与删除
      subtree: true, // 将会监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。默认值为 false
    });
  }

  function isInclude(node, arr) {
    if (!node || node === document.documentElement) {
      return false;
    }

    if (arr.includes(node)) {
      return true;
    }

    return isInclude(node.parentElement, arr);
  }

  // 判断一个元素是否需要计算
  function needToCalculate(node) {
    // 隐藏的元素不用计算
    if (window.getComputedStyle(node).display === 'none') return false;

    // 用于统计的图片不用计算
    if (node.tagName === 'IMG' && node.width < 2 && node.height < 2) {
      return false;
    }

    return true;
  }

  // dom 对象是否在屏幕内
  function isInScreen(dom) {
    const rectInfo = dom.getBoundingClientRect();
    if (
      rectInfo.left >= 0 &&
      rectInfo.left < viewportWidth &&
      rectInfo.top >= 0 &&
      rectInfo.top < viewportHeight
    ) {
      return true;
    }
  }

  // 获取 FMP
  function getRenderTime() {
    let startTime = 0;
    entries.forEach((entry) => {
      for (const node of entry.children) {
        if (
          isInScreen(node) &&
          entry.startTime > startTime &&
          needToCalculate(node)
        ) {
          startTime = entry.startTime;
          break;
        }
      }
    });

    // console.log('首屏定义为所有图片未加载完成 FMP:', startTime);
    logFn({
      type: 'performance',
      name: 'FMP',
      des: '所有图片未加载完成',
      t: startTime,
    });

    // 需要和当前页面所有加载图片的时间做对比，取最大值
    // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
    performance.getEntriesByType('resource').forEach((item) => {
      if (
        item.initiatorType === 'img' &&
        item.fetchStart < startTime &&
        item.responseEnd > startTime
      ) {
        console.log('item: ', item);
        startTime = item.responseEnd;
      }
    });

    // console.log('首屏定义为所有图片加载完成 FMP:', startTime);
    logFn({
      type: 'performance',
      name: 'FMP',
      des: '所有图片已加载完成',
      t: startTime,
    });

    return startTime;
  }

  const __main = () => {
    window.addEventListener('load', () => {
      observer && observer.disconnect();
      getRenderTime();
    });

    observeFirstScreenPaint();
  };

  __main();
}

function xmlRequest() {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
  // 由于我们需要重写 XMLHttpRequest.open, XMLHttpRequest.send, 这里我们将这两个函数缓存一下
  const XMLHttpRequestOpen = XMLHttpRequestPrototype.open;
  const XMLHttpRequestSend = XMLHttpRequestPrototype.send;
  const logFn = this.log.bind(this);

  /**
   *
   * @param {Function} paramsFormat XMLHttpRequest 接口上报参数格式化函数
   *
   * 注意点: 如果需要监听异常的情况，可以直接在 paramsFormat 这个参数中处理
   *
   * Q: 这里为什么需要提供一个 paramsFormat 呢？(为什么这里需要这么设计)
   * A:
   * 在监听的时候，作为监控 SDK 的维护方，我们不可能枚举所有的监控参数和监控场景(如果所有参数都写入埋点对于数据库存储时不友好的，会增加存储成本)
   * 因此这里我们可以将参数的上报格式交由具体的开发者去管理，我们只需要关注上报即可
   * 同时这里我们直接把 response 返回给开发者了，则接口请求的成功与否直接交由给开发者维护了
   */
  const XMLHttpRequestTimeScript = (
    paramsFormat = (response = { diff: 0 }) => ({ diff: response.diff })
  ) => {
    XMLHttpRequestPrototype.open = function (...args) {
      // 将 method url 写入到 this 对象中，后续我们上报耗时需要这个内容
      // 这里可以使用对象进行变量缓存，也可以使用闭包进行对象缓存
      this.method = args[0];
      this.url = args[1];

      // 调用 XMLHttpRequest open
      XMLHttpRequestOpen.apply(this, args);
    };

    XMLHttpRequestPrototype.send = function (...args) {
      // 请求的开始时间
      this.startTime = Date.now();

      const loadendCallback = () => {
        // 请求的结束时间
        this.endTime = Date.now();
        // 请求耗时
        const diff = this.endTime - this.startTime;

        const params = paramsFormat({
          ...this.response,
          ...args,
          url: this.url,
          method: this.method,
          startTime: this.startTime,
          endTime: this.endTime,
          diff,
        });
        // console.log(
        //   `请求方法: ${this.method}; 请求路径: ${this.url}; 请求耗时: ${diff}; \n监控参数为`,
        //   params
        // );
        logFn({
          type: 'interface',
          ...params,
        });

        this.removeEventListener('loadend', loadendCallback, true);
      };

      // send 之后我们绑定 loadend 回调事件
      this.addEventListener('loadend', loadendCallback, true);
      // 我们还需要重新调用 XMLHttpRequestPrototype.send 方法，这样请求才能够正常发送
      XMLHttpRequestSend.apply(this, args);
    };
  };

  XMLHttpRequestTimeScript((response) => ({
    url: response.url,
    method: response.method,
    startTime: response.startTime,
    endTime: response.endTime,
    diff: response.diff,
  }));
}

function fetchRequest() {
  const originalFetch = window.fetch;
  const logFn = this.log.bind(this);

  /**
   *
   * @param {Function} paramsFormat XMLHttpRequest 接口上报参数格式化函数
   *
   * 注意点: 如果需要监听异常的情况，可以直接在 paramsFormat 这个参数中处理
   *
   * Q: 这里为什么需要提供一个 paramsFormat 呢？(为什么这里需要这么设计)
   * A:
   * 在监听的时候，作为监控 SDK 的维护方，我们不可能枚举所有的监控参数和监控场景
   * 因此这里我们可以将参数的上报格式交由具体的开发者去管理，我们直观上报即可
   * 同时这里我们直接把 response 返回给开发者了，则接口请求的成功与否直接交由给开发者维护了
   */
  const initFetch = (
    paramsFormat = (response = { diff: 0 }) => ({ diff: response.diff })
  ) => {
    window.fetch = function newFetch(url, config) {
      // 开始时间
      const startTime = Date.now();

      return originalFetch(url, config)
        .then((res) => {
          // 结束时间
          const endTime = Date.now();
          // 请求耗时
          const diff = endTime - startTime;

          const params = paramsFormat({
            ...res,
            ...config,
            url,
            startTime: startTime,
            endTime: endTime,
            diff,
          });
          // console.log(
          //   `请求方法: ${config.method}; 请求路径: ${url}; 请求耗时: ${diff}; \n监控参数为`,
          //   params
          // );
          logFn({
            type: 'interface',
            ...params,
          });

          return res;
        })
        .catch((err) => {
          console.log('err: ', err);

          throw err;
        });
    };
  };

  initFetch((response) => ({
    url: response.url,
    method: response.method,
    startTime: response.startTime,
    endTime: response.endTime,
    diff: response.diff,
  }));
}

function errorFn() {
  // 资源加载错误
  window.addEventListener(
    'error',
    (e) => {
      const { target } = e;
      const tag = target.tagName;
      const url = target.src || target.href;
      // console.log(
      //   `捕获到了加载错误, 加载标签类型为 ${tag}; 资源 url 为 ${url}`
      // );
      this.log({
        type: 'error',
        errorType: 'source',
        url,
        tag,
      });
    },
    // 错误的监听必须在捕获的时候进行监听
    true
  );

  window.onerror = (message, source, lineno, colno, error) => {
    // console.log('捕获到异常：', { message, source, lineno, colno, error });
    this.log({
      type: 'error',
      errorType: 'javascript',
      message,
      source,
      lineno,
      colno,
      error,
    });
  };

  window.addEventListener('unhandledrejection', (e) => {
    console.log('e: ', e);
    this.log({
      type: 'error',
      errorType: 'unhandledrejection',
      info: e,
    });
  });
}

class PerformaceOulaeSdk {
  constructor() {
    // 单例对象的 cache
    this.i = undefined;
    // log promise 队列
    this.promiseCache = Promise.resolve();
    // 页面的会话id
    this.sessionId = undefined;

    this.init();
  }
  /**
   * 单例模式写法
   * @param  {...any} args
   * @returns
   */
  static instance() {
    this.i = this.i || new this();
    return this.i;
  }
  /**
   * get - 获取公共参数
   */
  getPublicParams() {
    return {
      sessionId: this.sessionId,
      ua: navigator.userAgent,
      url: window.location.href,
    };
  }
  /**
   * init - sdk 基础配置和公参的初始化
   */
  sdkLogInit() {
    let _resolve = undefined;
    let _reject = undefined;
    this.promiseCache = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    // 这里假设我们的初始化流程是非常慢的，最起码需要 3 秒钟
    setTimeout(() => {
      _resolve();
      // mock 生成 sessionId
      this.sessionId = generateRandomString(20);
    }, 3000);
  }
  /**
   * init - 性能数据 init
   */
  performanceApiInit() {
    performanceBase.call(this);
    performanceMutationObserver.call(this);
  }
  /**
   * init - 接口监控 init
   */
  interfaceInit() {
    xmlRequest.call(this);
    fetchRequest.call(this);
  }
  /**
   * init - error init
   */
  errorInit() {
    errorFn.call(this);
  }
  init() {
    this.sdkLogInit();
    this.performanceApiInit();
    this.interfaceInit();
    this.errorInit();

    this.log({ type: 'pv' });
  }
  log(params) {
    this.promiseCache.then(() => {
      const temp = {
        ...this.getPublicParams(),
        ...params,
      };

      console.log('成功发送一个埋点: ', temp);
    });
  }
}

const __main = () => {
  const sdk = PerformaceOulaeSdk.instance();
  window.PERFORMACE_SDK_LOG = sdk.log;
};

__main();
