// @ts-ignore
!(function () {
  const originalFetch = window.fetch;

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
          console.log(
            `请求方法: ${config.method}; 请求路径: ${url}; 请求耗时: ${diff}; \n监控参数为`,
            params
          );

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
})();
