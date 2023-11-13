# 前端性能监控平台

- 前端性能监控平台
  - 数据采集与上报
    - 错误监控
      - 资源加载错误
      - js 错误
      - promise 错误
      - 自定义错误
    - 性能监控
      - 资源加载时间
      - 接口请求耗时
      - 其他性能指标
    - 行为监控
      - UV/PV
      - 页面访问深度
      - 页面停留时长
      - 用户点击
      - 路由切换
      - 自定义统计事件
  - 数据整理和存储
  - 数据展示

## js 中的错误

1. 资源加载错误，通过 addEventListener('error', callback, true) 在捕获阶段捕捉资源加载失败错误。
2. js 执行错误，通过 window.onerror 捕捉 js 错误。
3. promise 错误，通过 addEventListener('unhandledrejection', callback)捕捉 promise 错误，但是没有发生错误的行数，列数等信息，只能手动抛出相关错误信息。

## 数据上报的方法

1. xhr
2. sendBeacon
3. image

## 数据上报的时机

1. requestldleCallback
2. setTimeout
3. beforeunload
4. 达到缓存上线时上报

# TODO

1. 性能数据上报的时机
2. 错误数据上报的时机
3. 在 React 中如何获取路由切换所使用的时间(感觉在 React 应该存在一个通用的解决方案)

# 关键结果

1. 掘金博客输出 --doing
2. 性能指标计算脚本 --doing
3. 性能指标 sdk demo --doing
4. 一个简单的性能 sdk 分享
5. 一个简单埋点工具的抽象

其实这个内容包括了 3 个点：

1. 如何做性能优化
2. 如何完成一个数据采集的 SDK
3. 如何做一个埋点 SDK(这个部分本质上是不属于性能优化的，但是所用的知识和数据采集 SDK 是高度重合的)

# 参考链接

1. [深入了解前端监控原理](https://juejin.cn/post/6899430989404045320)
2. [前端监控 SDK 的一些技术要点原理分析](https://juejin.cn/post/7017974567943536671)
