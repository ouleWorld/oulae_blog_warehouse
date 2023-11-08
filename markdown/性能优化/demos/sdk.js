const PerformaceOulaeSdk = function () {
  this.promiseCache = undefined;
};

PerformaceOulaeSdk.prototype.init = function () {
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
};

PerformaceOulaeSdk.prototype.log = function (...params) {
  // TODO: 这里需要判断一下是否需要额外赋值
  this.promiseCache = this.promiseCache.then(() => {
    // 调用埋点
  });
};
