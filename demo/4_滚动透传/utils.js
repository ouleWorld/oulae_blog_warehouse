/**
 * can-scroll: 元素本身支持 scroll，但是 scroll 触底，触顶时不希望 scroll 透传到其他元素中
 * no-scroll: 元素本身不支持 scroll，touchmove 发生时不希望 scroll 透传到其他元素中
 *
 * 特别注意点：
 * 1. 当前只支持针对 Y 轴方向的透传场景
 * 2. 当前只支持移动端的场景，如果要支持 PC 端的场景的话，需要进行事件的适配
 */
const documentEvent = () => {
  // 所有可以滚动的元素, 我们都加上 class属性: can-scroll 即可
  const scrollEl = document.querySelectorAll('.can-scroll');
  [].forEach.call(scrollEl, (el) => {
    let initialY = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.targetTouches.length === 1) {
        /**
         * Q: 为什么这里要记录 clientY
         * A: 我们要使用这个 clientY 去判断当前的方向，以此来判断到底是触顶还是触底
         */

        // 读取并缓存当前触摸点的 Y 轴坐标
        initialY = e.targetTouches[0].clientY;
      }

      // 如果发生 .can-scroll 嵌套 .can-scroll，可能会触发多次校验逻辑，因此这里需要阻止冒泡
      e.stopPropagation();
    });

    el.addEventListener(
      'touchmove',
      (e) => {
        const scrollTop = el.scrollTop; // 页面滚动值
        const scrollHeight = el.scrollHeight; // 页面滚动的高度
        const clientHeight = el.clientHeight; // 页面元素的高度
        // console.log('initialY: ', initialY);
        // console.log('scrollTop: ', scrollTop);
        // console.log('scrollHeight: ', scrollHeight)
        // console.log('clientHeight: ', clientHeight);

        // scrollHeight !== clientHeight：只有页面是能够发生滚动时，才需要对滚动透传进行判断
        if (e.targetTouches.length === 1 && scrollHeight !== clientHeight) {
          const clientY = e.targetTouches[0].clientY - initialY;

          // 注意, 这里必须使用 e.cancelable, 否则可能会报错
          // 触底时，阻止事件的默认行为
          // 1. scrollTop + clientHeight >= scrollHeight: 触底判断
          // 2. clientY < 0：手势向下滑
          // 3. e.cancelable：事件可以被取消
          if (
            scrollTop + clientHeight >= scrollHeight &&
            clientY < 0 &&
            e.cancelable
          ) {
            // 触底时，我们取消 scroll 事件的
            return e.preventDefault();
          }

          // 注意, 这里必须使用 e.cancelable, 否则可能会报错
          // 1. scrollTop <= 0: 触顶判断
          // 2. clientY > 0: 手势向上滑动
          // 3. e.cancelable: 事件可以被取消
          if (scrollTop <= 0 && clientY > 0 && e.cancelable) {
            // 向上滑至顶部
            return e.preventDefault();
          }
        }
        // 如果发生 .can-scroll 嵌套 .can-scroll，可能会触发多次校验逻辑，因此这里需要阻止冒泡
        e.stopPropagation();
      },
      { passive: false }
    );
  });

  const noScrollEl = document.querySelectorAll('.no-scroll');
  [].forEach.call(noScrollEl, (el) => {
    // 需要不希望发生透传的元素，我们直接阻断事件的默认行为
    el.addEventListener(
      'touchmove',
      (e) => {
        if (e.cancelable) {
          e.stopPropagation();
        }
      },
      { passive: false }
    );
  });
};
