// @ts-ignore
!(function () {
  const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
  // 由于我们需要重写 XMLHttpRequest.open, XMLHttpRequest.send, 这里我们将这两个函数缓存一下
  const XMLHttpRequestOpen = XMLHttpRequestPrototype.open;
  const XMLHttpRequestSend = XMLHttpRequestPrototype.send;

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
        console.log(
          `请求方法: ${this.method}; 请求路径: ${this.url}; 请求耗时: ${diff}; \n监控参数为`,
          params
        );

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
})();
