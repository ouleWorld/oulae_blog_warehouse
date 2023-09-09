/**
 * Q: 虚拟 DOM 更新的原理是什么？
 * A:
 * 1. 滚动事件发生之后，获取滚动之后的距离 offset
 * 2. 将 offset 更新到 this 上去，set 操作会自动触发 this.render
 */
export default class VirtualScroll {
  constructor($list, list, itemGenerator, options = {}) {
    this.$list = $list // 视口元素
    this.$listInner = undefined // 表示视口元素下真实的 div 展示内容，我们主要依靠这个元素做滚动效果
    this.list = list // 需要展示的列表数据
    this._list = undefined // 根据 list 生成的对象，它包含渲染所需要的一些信息
    this.itemGenerator = itemGenerator // 列表元素的 DOM 生成器
    this.containerHeight = undefined // 表示视口容器的高度
    this.contentHeight = undefined // 表示虚拟滚动操作 div 的高度，它是所有 cell 高度的累加和
    this.$scrollTrack = undefined // 自定义滚动条 - container dom
    this.$scrollBar = undefined // 自定义滚动条 - bar dom
    this.cacheCount = options.cacheCount || 5 // 数据加载时，在 head tail 需要多加载的元素的数量(即缓存的数量)
    this.renderListWithCache = [] // 当前状态下虚拟滚动列表的缓存信息
    this.offsetToEdge = 0 // 在渲染可视区域的元素时，由于我们使用了缓存的技术，因此我们一个 translateY 来将元素调整到目标视角之内，这个值就是 offsetToEdge
    this.unbindEvent = () => {} // 表示卸载组件时需要执行的函数

    // this._list 数据的初始化
    this.initItem(list)
    // this.containerHeight this.contentHeight 数据的初始化
    this.initContainer($list)
    // 自定义滚动条的初始化
    this.initScroll($list)
    // 初始化事件绑定
    this.bindEvent()

    // 这里只需要维护一个 offset 就可以了
    this.offset = options.initalOffset || 0 // 表示虚拟 dom 滚动的距离
  }

  set offset(val) {
    this.render(val)
  }

  // this._list 数据的初始化
  initItem(list) {
    this._list = list.map((item, i) => ({
      height: 40,
      index: i,
      raw: item,
    }))
  }

  // this.containerHeight this.contentHeight 数据的初始化
  initContainer($list) {
    this.containerHeight = $list.clientHeight
    this.contentHeight = sumHeight(this._list)
    // 由于这里我们自定义了滚动条，所以针对容器 overflow 属性，我们设置 hidden
    $list.style.overflow = 'hidden'
  }

  // 自定义滚动条的初始化
  initScroll($list) {
    const $scrollTrack = document.createElement('div')
    const $scrollBar = document.createElement('div')
    $scrollTrack.classList.add('vs__scroll')
    $scrollBar.classList.add('vs__scrollbar')

    $scrollTrack.appendChild($scrollBar)
    $list.appendChild($scrollTrack)
    this.$scrollTrack = $scrollTrack
    this.$scrollBar = $scrollBar
  }

  bindEvent() {
    let y = 0
    // 表示 contentHeight 能够向下滚动的总距离
    const contentSpace = this.contentHeight - this.containerHeight
    // 滚动事件触发时，将滚动的值实时更新到 y 变量中(这个函数开销比较小，因此我们不需要使用节流，当然使用了感觉也没啥问题，就是精度会损失一点点而已，但是感觉在这个场景下问题应该是不大的)
    const noThrolttle = (e) => {
      e.preventDefault()
      // e.deltaY 表示的是垂直滚动量
      y += e.deltaY
      y = Math.max(y, 0)
      y = Math.min(y, contentSpace)
    }
    // 将滚动的距离更新到 offset 中
    const updateOffset = () => {
      if (y !== this.offset) {
        this.offset = y
      }
    }

    // 自定义滚动条的回调函数(暂时没看)
    let lastPostion = 0
    const recordPostion = (e) => {
      const offset = extractPx(this.$scrollBar.style.transform)
      lastPostion = offset

      const noThrolttle = (e) => {
        const scrollSpace =
          this.$scrollTrack.clientHeight - this.$scrollBar.clientHeight
        lastPostion += e.movementY
        lastPostion = Math.max(lastPostion, 0)
        lastPostion = Math.min(lastPostion, scrollSpace)
      }
      const updatePostion = (e) => {
        const scrollSpace =
          this.$scrollTrack.clientHeight - this.$scrollBar.clientHeight
        const contentSpace = this.contentHeight - this.containerHeight
        const rate = lastPostion / scrollSpace

        const contentOffset = contentSpace * rate
        y = contentOffset

        this.offset = contentOffset
        this.$scrollBar.style.transform = `translateY(${lastPostion}px)`
      }
      const _updatePosition = throttle(updatePostion, 30)
      const removeEvent = () => {
        document.removeEventListener('mousemove', _updatePosition)
        document.removeEventListener('mousemove', noThrolttle)
        document.removeEventListener('mouseup', removeEvent)
      }

      document.addEventListener('mousemove', noThrolttle)
      document.addEventListener('mousemove', _updatePosition)
      document.addEventListener('mouseup', removeEvent)
    }

    // 将更新函数节流
    const _updateOffset = throttle(updateOffset, 60)

    // 时间的绑定
    this.$list.addEventListener('mousewheel', noThrolttle)
    this.$list.addEventListener('mousewheel', _updateOffset)
    this.$scrollBar.addEventListener('mousedown', recordPostion)

    this.unbindEvent = function () {
      // this.$list.removeEventListener("mousewheel", updateOffset)
      this.$scrollBar.removeEventListener('mousedown', recordPostion)
      this.$list.removeEventListener('mousewheel', _updateOffset)
      this.$list.removeEventListener('mousewheel', noThrolttle)
    }
  }

  // render 函数
  render(offset) {
    // 触发自定义滚动条的更新
    updateScrollBar(
      this.$scrollBar,
      offset,
      this.contentHeight,
      this.containerHeight,
      this.navigating
    )

    // 根据当前的 offset 计算出开始坐标和结束坐标
    const headIndex = findOffsetIndex(this._list, offset)
    // 优化点：tailIndex 应该是可以使用加法来算的，没必要使用 findOffsetIndex 来计算
    const tailIndex = findOffsetIndex(this._list, offset + this.containerHeight)

    // 判断当前的 render 能否直接使用 cache 渲染
    if (withinCache(headIndex, tailIndex, this.renderListWithCache)) {
      // 改变translateY
      const headIndexWithCache = this.renderListWithCache[0].index
      const offsetToEdge = offset - sumHeight(this._list, 0, headIndexWithCache)
      this.$listInner.style.transform = `translateY(-${offsetToEdge}px)`
      return
    }
    console.log('重新渲染', this)

    // 由于我们默认的使用了缓存，因此这里我们需要对 headIndex， tailIndex 再重新处理一下
    const headIndexWithCache = Math.max(headIndex - this.cacheCount, 0)
    const tailIndexWithCache = Math.min(
      tailIndex + this.cacheCount,
      this._list.length
    )

    this.renderListWithCache = this._list.slice(
      headIndexWithCache,
      tailIndexWithCache
    )
    // 由于我们启用了缓存，因此如果我们需要拿到正确的位置的话，这里需要做一下 translateY 处理，translateY 的举例其实就是隐藏 Cell 内容高度
    this.offsetToEdge = offset - sumHeight(this._list, 0, headIndexWithCache)

    // this.$listInner 元素的初始化
    if (!this.$listInner) {
      const $listInner = document.createElement('div')
      $listInner.classList.add('vs__inner')
      this.$list.appendChild($listInner)
      this.$listInner = $listInner
    }

    // 下面都是 DOM 的更新操作
    // document.createDocumentFragment: 创建一个空白的文档片段
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < this.renderListWithCache.length; i++) {
      const item = this.renderListWithCache[i]
      const $item = this.itemGenerator(item)

      if ($item && $item.nodeType === 1) {
        fragment.appendChild($item)
      }
    }

    this.$listInner.innerHTML = ''
    this.$listInner.appendChild(fragment)
    this.$listInner.style.transform = `translateY(-${this.offsetToEdge}px)`
  }

  // 销毁时的回调函数
  destory() {
    this.unbindEvent()
  }
}

// 自定义滚动条的更新函数
function updateScrollBar(
  $scrollBar,
  offset,
  contentHeight,
  containerHeight,
  navigating
) {
  // 移动滑块时不用再更新滑块位置
  if (navigating) return

  const barHeight = $scrollBar.clientHeight
  const scrollSpace = containerHeight - barHeight
  const contentSpace = contentHeight - containerHeight

  let rate = offset / contentSpace
  if (rate > 1) {
    rate = 1
  }
  const barOffset = scrollSpace * rate
  $scrollBar.style.transform = `translateY(${barOffset}px)`
}

// 判断是否需要使用缓存展示
// 原理：判断新的 headIndex, tailIndex 是否是在缓存区间之内，如果是的话，则直接使用缓存，否则走更新重新 render 逻辑
function withinCache(currentHead, currentTail, renderListWithCache) {
  if (!renderListWithCache.length) return false
  const head = renderListWithCache[0]
  const tail = renderListWithCache[renderListWithCache.length - 1]
  const withinRange = (num, min, max) => num >= min && num <= max

  return (
    withinRange(currentHead, head.index, tail.index) &&
    withinRange(currentTail, head.index, tail.index)
  )
}

// 计算所有 cell 的总高度
function sumHeight(list, start = 0, end = list.length) {
  let height = 0
  for (let i = start; i < end; i++) {
    height += list[i].height
  }

  return height
}

// 根据当前的高度，寻找需要渲染的目标元素
// 原理参见这篇文章: https://juejin.cn/post/6844904183582162957?searchId=202307170606584E4881AE51E0D6D614DA#heading-3
function findOffsetIndex(list, offset) {
  let currentHeight = 0
  for (let i = 0; i < list.length; i++) {
    const { height } = list[i]
    currentHeight += height

    if (currentHeight > offset) {
      return i
    }
  }

  return list.length - 1
}

// 节流函数
function throttle(fn, wait) {
  let timer, lastApply

  return function (...args) {
    const now = Date.now()
    if (!lastApply) {
      fn.apply(this, args)
      lastApply = now
      return
    }

    if (timer) return
    const remain = now - lastApply > wait ? 0 : wait

    timer = setTimeout(() => {
      fn.apply(this, args)
      lastApply = Date.now()
      timer = null
    }, remain)
  }
}

function extractPx(string) {
  const r = string.match(/[\d|.]+(?=px)/)
  return r ? Number(r[0]) : 0
}
