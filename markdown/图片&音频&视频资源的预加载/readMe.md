# 图片的预加载

## 方案：Image 对象(最佳实践)

图片预加载的核心内容其实就是使用 Image 对象，只要使用 Image 对象加载了图片信息的话，再次使用该图片浏览器可以直接使用缓存中的内容

```js
const img = new Image();
img.src = url;
img.onload = () => {
  console.log('图片资源加载完成!');
};
```

## demo

[预加载\_图片](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E5%9B%BE%E7%89%87.html)

**图片预加载完成之后, 页面 DOM 之后再使用该链接时, 并没有触发二次请求**

![](./_images/QQ20231015-220654@2x.png)

# 音频

## 方案: Audio 对象

### 定义

```js
const audio = new Audio();
audio.src = url;
audio.addEventListener('canplaythrough', () => {
  console.log('音频资源加载完成!');
});
```

### demo

[预加载\_音频\_Audio](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E9%9F%B3%E9%A2%91_audioDom.html)

### 抽象

备注: 这里是将这个方案抽象成为了 class 类, 这种方案可以兼容不同的场景, 如果有需求, 也可以根据相关的框架语法做修改

```js
class AudioPreload {
  constructor(initParams) {
    const { url, setConfig = () => {}, callback = () => {} } = initParams;
    this.$audio = new Audio(url);
    this.loadCallback = callback;
    setConfig && setConfig(this.$audio);
    this.init();
  }

  init() {
    this.$audio.addEventListener('canplaythrough', () => {
      console.log('音频预加载完成!');
      this.loadCallback();
    });
  }

  static new(initParams) {
    var i = new this({ ...initParams });
    return i;
  }

  play() {
    this.$audio.play();
  }

  pause() {
    this.$audio.pause();
  }

  changeMuted() {
    const temp = this.$audio.muted;
    this.$audio.muted = !temp;
  }
}
```

[预加载\_音频\_Audio 抽象化](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E9%9F%B3%E9%A2%91_Audio%E6%8A%BD%E8%B1%A1%E5%8C%96.html)

## 方案: <audio>

### 定义

这个方案, 就是在 DOM 中插入:

```html
<audio preload="auto"></audio>
```

利用浏览器自身的预加载能力, 然后监听 DOM 的 canplaythrough 事件来判断是否完成加载

### demo

[预加载\_音频\_audioDom](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E9%9F%B3%E9%A2%91_audioDom.html)

### 方案缺陷

由于要考虑页面的加载, 一般的我们会: 将 JS 文件放置在 body 最后面; 同时也由于 JS 是单线程的, 可能会受经常阻塞影响
这样我们就可能面临一种情况: 可能事件以及触发完成了, 但是我们绑定逻辑的脚本却还没执行完

[预加载\_音频\_audioDom 缺陷](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E9%9F%B3%E9%A2%91_audioDom%E7%BC%BA%E9%99%B7.html)

在我们写的 demo 中, 延迟 300 毫秒执行, 事件还是没有被监听到

**_ 不推荐使用 audioDom 的方式作音频的预加载, 这个会受 JS 执行时间的影响 _**

## 两种方案的比较

上面两种方案虽然本质上都差不多, 但是 Audio 方案能够 100%保证事件被监听到, 而 audioDom 方案受网页 JS 资源的影响可能会导致先加载完数据, 然后才做事件绑定

在如下场景中: 1. SSR 2. JS 资源打包顺序 3. JS 资源的大小

audioDOm 这个方案会可能不能正常监听事件, 在实际开发中就遇到过: 在 react + ssr 的场景下, 事件可能会失效

因此音频预加载的最佳实践是使用 Audio 对象

## 结论

1. 音频预加载最佳实践 - Audio 对象
2. 不推荐使用 audioDom 的方式作音频的预加载, 这个会受 JS 执行时间的影响
3. 对于不同的 HTMLDOM / Audio 对象, 不管 URL 是否相同, 都会对资源进行重新请求加载, 而不是类似于图片的处理方式

# 视频

视频场景比较特殊，JS 并没有 Video 这样一个对象，因此只能使用 video 标签本身的预加载能力

## video 预加载能力

[预加载\_视频](./demos/%E9%A2%84%E5%8A%A0%E8%BD%BD_%E8%A7%86%E9%A2%91.html)

# <audio> 和 <video> 标签被 app 端劫持

在 app 端的 webview 容器的场景下, app 端处于某些规划的原因, 可能会对 audio video 这两个标签进行劫持

即实现一套自定义的多媒体标签代码, 在开发的场景中, 具体有如下的表现:

1. video, 控件不能修改, 且 video 层级最高, 不能被其他元素遮盖
2. video audio 资源请求不是由浏览器发出(network 没有出现请求进程)
3. video 同一个资源循环播放不能使用缓存, 重播会重新加载一次资源(真实遇到过这个情况)

**因此，如果在 web mobile 场景下开发 video 标签相关的需求，一定要写相应的 demo 确保能够实现！很可能 webview 中的表现和你自己想象的会存在着出入！**

# 资源预加载 loading demo

这个是一个加载 图片/音频/视频 loading 内容的例子

**由于存在视频资源，且视频资源配置了跨域，因此测试需要使用 http-server 开启本地服务**

[资源预加载 loading demo](./demo/%E8%B5%84%E6%BA%90%E9%A2%84%E5%8A%A0%E8%BD%BDloading.html)

效果：
![](./_images/loading.gif)
