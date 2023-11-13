class PerformaceOulaeSdk {
  constructor(obj) {
    this.promiseCache = Promise.resolve();
    this.sessionId = undefined;
    this.init();
  }
  sdkLogInit() {
    let _resolve = undefined;
    let _reject = undefined;
    this.promiseCache = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    setTimeout(() => {
      this.sessionId = Math.random();
      _resolve();
    }, 3000);
  }
  init() {
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
