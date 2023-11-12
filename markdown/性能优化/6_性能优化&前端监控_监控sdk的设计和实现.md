# 埋点协议

按照之前我们的设想，我们现在只需要一份埋点协议就可以完成这个性能监控 sdk 了；现在我们就来完成这个事情

## 埋点协议的设计

首先埋点协议这件事情是一件很严肃且复杂度较高的事情，这关系到我们 SDK 的应用场景，数据的清洗，数据的扩展等等问题，我们这里只是简单理一下思路，实际场景中协议肯定是要专门设计讨论的

首先我们埋点的参数可分为两类：

1. 公参: 所有埋点携带的公共参数，用于串联数据以及描述基本的场景
2. 私参: 具体到场景的参数，完全由用户输入自定义

```js
{
  // 公参
  sessionId: '', // 表示会话id，sdk 初始化时由服务器返回/sdk提供算法生成，这里要求 sessionId 具有唯一性；我们可以使用这个id来进行页面的漏斗分析
  ua: '', // user-agent
  url: '', // 页面当前的 url

  // 私参
  // 私参的设计有两种思路，1. 完全由用户自定义，但是限制参数数量和长度 2. 给点默认的 key，然后让用户去使用
  // 这里我们只定义一个 type 私参，然后所有的其他私参完全由用户自定义
  type: '', // 表示埋点的类型，pv|performance|interface|error|other
}
```

然后我们公参私参只是一个默认设置，允许用户在埋点的时候进行二次覆盖(兼容不同的场景)

这样我们就简单设计了一个协议

# 前端监控 sdk 的实现

## 基本架构

基于之前我们做的准备工作，我们的性能 sdk 基础架构为:

```js
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
```

整个流程的交互为：
![](./_images/前端监控sdk架构图.png)

## 实现源码

实现的源码这部分其实很简单，只需要把我们之前完成的脚本嵌入到我们基本架构就可以了
[实现源码](./demos/12_%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7sdk/sdk.js)

## 场景测试

测试方案: [暴力猴](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=zh-CN)

这里我们使用掘金首页作为我们的测试场景, 下面是测试结果:
![](./_images/sdk_result.png)
