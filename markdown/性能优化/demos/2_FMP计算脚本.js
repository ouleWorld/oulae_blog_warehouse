// @ts-nocheck
!(function () {
  let observer = undefined; // MutationObserver 监听的对象
  let entries = []; // observer 监听的元素变动集
  const viewportWidth = window.innerWidth; // 页面宽度
  const viewportHeight = window.innerHeight; // 页面高度

  // MutationObserver 监听函数
  function observeFirstScreenPaint() {
    if (!MutationObserver) return;

    const next = window.requestAnimationFrame || setTimeout;

    // 不需要判断的 DOM
    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META'];

    observer = new MutationObserver((mutationList) => {
      const entry = {
        startTime: 0,
        children: [],
      };

      // 在重绘之前获取时间
      next(() => {
        entry.startTime = performance.now();
      });

      for (const mutation of mutationList) {
        if (mutation.addedNodes.length) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (
              node.nodeType === 1 &&
              !ignoreDOMList.includes(node.tagName) &&
              !isInclude(node, entry.children)
            ) {
              entry.children.push(node);
            }
          }
        }
      }

      if (entry.children.length) {
        entries.push(entry);
      }
    });

    observer.observe(document, {
      childList: true, // 监听 target 节点中发生的节点的新增与删除
      subtree: true, // 将会监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。默认值为 false
    });
  }

  function isInclude(node, arr) {
    if (!node || node === document.documentElement) {
      return false;
    }

    if (arr.includes(node)) {
      return true;
    }

    return isInclude(node.parentElement, arr);
  }

  // 判断一个元素是否需要计算
  function needToCalculate(node) {
    // 隐藏的元素不用计算
    if (window.getComputedStyle(node).display === 'none') return false;

    // 用于统计的图片不用计算
    if (node.tagName === 'IMG' && node.width < 2 && node.height < 2) {
      return false;
    }

    return true;
  }

  // dom 对象是否在屏幕内
  function isInScreen(dom) {
    const rectInfo = dom.getBoundingClientRect();
    if (
      rectInfo.left >= 0 &&
      rectInfo.left < viewportWidth &&
      rectInfo.top >= 0 &&
      rectInfo.top < viewportHeight
    ) {
      return true;
    }
  }

  // 获取 FMP
  function getRenderTime() {
    let startTime = 0;
    entries.forEach((entry) => {
      for (const node of entry.children) {
        if (
          isInScreen(node) &&
          entry.startTime > startTime &&
          needToCalculate(node)
        ) {
          startTime = entry.startTime;
          break;
        }
      }
    });

    console.log('首屏定义为所有图片未加载完成 FMP:', startTime);

    // 需要和当前页面所有加载图片的时间做对比，取最大值
    // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
    performance.getEntriesByType('resource').forEach((item) => {
      if (
        item.initiatorType === 'img' &&
        item.fetchStart < startTime &&
        item.responseEnd > startTime
      ) {
        console.log('item: ', item);
        startTime = item.responseEnd;
      }
    });

    console.log('首屏定义为所有图片加载完成 FMP:', startTime);

    return startTime;
  }

  const __main = () => {
    window.addEventListener('load', () => {
      observer && observer.disconnect();
      getRenderTime();
    });

    observeFirstScreenPaint();
  };

  __main();
})();
