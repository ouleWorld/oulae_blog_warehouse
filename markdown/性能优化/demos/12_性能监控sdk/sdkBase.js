class PerformaceOulaeSdk {
  constructor(obj) {
    // 单例对象的 cache
    this.i = undefined;
    // log promise 队列
    this.promiseCache = Promise.resolve();
    // 页面的会话id
    this.sessionId = undefined;

    // sdk 初始化函数
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
      this.sessionId = Math.random();
      _resolve();
    }, 3000);
  }
  init() {
    // 埋点 log 的初始化
    // sessionId 的初始化
    this.sdkLogInit();

    // TODO: 性能监控数据脚本初始化
    // TODO: 接口请求监控脚本初始化
    // TODO: 错误监控脚本初始化

    // TODO: 发送一个页面的pv点
  }
  log(...params) {
    this.promiseCache.then(() => {
      // 调用埋点
      // TODO: 将埋点发送给服务端
      console.log('成功发送一个埋点: ', params);
    });
  }
}
