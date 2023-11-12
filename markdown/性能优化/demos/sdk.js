class PerformaceOulaeSdk {
  constructor(obj) {
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
  instance(obj) {
    this.i = this.i || new this(obj);
    return this.i;
  }
  /**
   * sdk 基础配置和公参的初始化
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
    }, 3000);
  }
  /**
   * 性能数据 init
   */
  performanceApiInit() {}
  /**
   * 接口监控 init
   */
  interfaceInit() {}
  /**
   * error init
   */
  errorInit() {}
  init() {
    this.sdkInit();
    this.performanceApiInit();
    this.interfaceInit();
    this.errorInit();

    // 发送一个页面的pv点
  }
  log(...params) {
    this.promiseCache.then(() => {
      // 调用埋点
    });
  }
}
