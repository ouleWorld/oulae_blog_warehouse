const originalFetch = window.fetch;

window.fetch = function newFetch(url, config) {
  // 开始时间
  const startTime = Date.now();

  return originalFetch(url, config)
    .then((res) => {
      // 结束时间
      const endTime = Date.now();
      // 请求耗时
      const diff = endTime - startTime;

      const params = {
        ...res,
        ...config,
        url,
        startTime: startTime,
        endTime: endTime,
        diff,
      };
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
