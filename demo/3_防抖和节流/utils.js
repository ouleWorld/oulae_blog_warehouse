/**
 * 节流函数
 *
 * ```js
 * const throttleRet = throttled(function(e){
 *   console.log('throttled');
 * });
 *
 * window.addEventListener('scroll', throttleRet);
 *
 * // throttleRet 将不可再执行
 * throttleRet.cancel();
 * ```
 *
 * @category Function
 * @param callback 调用的函数
 * @param delay 延迟时间，单位为 ms, 默认200ms
 * @param options 内部参数
 * @return 返回的值，可以调用 `cancel` 取消执行
 */
const throttled = (callback, delay, options) => {
  if (!delay) {
    delay = 200;
  }

  let isImmediate = true; // 是否立即执行一次逻辑，即立即调用一次 callback
  let isDebounce = false; // 是否是防抖逻辑

  let timeoutID; // 定时器的ID
  let lastExec = 0; // 上一次执行 wrapper 的时间点
  let callbackArgs; // args 缓存变量, 用于参数的传递
  let ctx; // this 缓存变量, 用于参数的传递
  let isCancelled = false; // 表示 wrapper 的状态值, false 表示正常执行, true 表示动作被取消了，不需要执行了

  // 如果 options 传递了 isImmediate, isDebounce 参数则采用 options 传递的参数, 否则采用默认值
  if (typeof options === 'object') {
    isImmediate =
      'isImmediate' in options ? !!options.isImmediate : isImmediate;
    isDebounce = 'isDebounce' in options ? !!options.isDebounce : isDebounce;
  }

  // 清除定时器 timeoutID
  const clearExistingTimeout = () => {
    if (timeoutID !== undefined) {
      clearTimeout(timeoutID);
    }
  };

  // 取消 wrapper 函数调用
  const cancel = () => {
    // 清空计时器
    clearExistingTimeout();
    // lastExec 清零(初始化操作)
    lastExec = 0;
    // isCancelled 状态变更为 true
    isCancelled = true;
  };

  // 执行用户调用的回调函数
  const exec = () => {
    lastExec = Date.now();
    // 这里一定要重新指定一下 this, 防止 callback 为 Function 函数
    // 给箭头函数绑定 this 是不会报错的
    callback.apply(ctx, callbackArgs);
  };

  const wrapper = (...arguments) => {
    // 此时表示用户执行了cancel 操作, 则直接 return
    if (isCancelled) {
      return;
    }

    // 收集 wrapper 函数调用的参数，我们需要将这些参数回传给 callback
    // 这个可以当做一个固定套路来理解
    const args = [];
    for (let _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    // 函数参数的赋值
    callbackArgs = args;
    // this 变量的缓存
    ctx = this;
    // 记录当前时间
    var now = Date.now();

    /*
      首次是否执行的判断逻辑
      lastExec === 0: 表示第一次调用 wrapper()
      isImmediate === false: 表示第一次不需要执行

      第一次不需要执行时: elapsed = now
      第一次需要执行时: elapsed = 0
    */
    if (lastExec === 0 && isImmediate === false) {
      lastExec = now;
    }
    // 计算时间差
    var elapsed = now - lastExec;

    // 清除定时器
    clearExistingTimeout();
    // 如果当前的时间差 > 设置的delay 延迟, 则执行 exec
    if (elapsed > delay) {
      exec();
    } else {
      // 特别注意点：防抖的逻辑 lastExec 的赋值只能在这里做
      // 防抖逻辑
      if (isDebounce) {
        /*
          防抖逻辑:
            1. 将 lastExec = now, 这样下一次 wrapper 执行计算出来的 elapsed 是正常的(可以理解为重置触发事件点, 从而达到防抖的目的)
        */
        lastExec = now;

        /*
          Q: 按照防抖的定义, 防抖的执行代码应该为下面代码, 但是实际代码并不是这样, 这是为什么?
          ```
            if (isDebounce) {
              lastExec = now;
              timeoutID = setTimeout(exec, delay);
            } else {
              timeoutID = setTimeout(exec, delay - elapsed);
            }
          ```
          A: 
            按照防抖的定义, 上述代码无疑是正确的, 但是这里我们思考一个场景:
              我们将实际代码写法定义为方案a,
              上述实例代码定义为方案b,
            
            防抖的场景1: 最后一次事件触发后, 最后一次 wrapper 执行时:
              方案a: delay - elapsed 后会执行 exec
              方案b: delay 后会执行 exec
            总结: 在最后一次触发场景下, 方案a 提前了 elapsed 毫秒执行

            防抖场景2: 非最后一次时间触发, 我们暂时定义为执行了 2 次 wrapper
              方案a: delay - elapsed 后会执行 exec
              方案b: 最后一次 wrapper 后, delay 毫秒后执行 exec
            总结: 在最后一次触发场景下, 方案a 提前了 elapsed 毫秒执行

            防抖场景3: 非最后一次时间触发, 我们暂时定义为执行了 3 次 wrapper
              方案a: delay - elapsed 后会执行 exec
              方案b: 最后一次 wrapper 后, delay 毫秒后执行 exec
            总结: 在非最后一次时间触发(3次)时, 方案a 提前了 elapsed 毫秒执行


            汇总总结:
              1. 根据上述场景, 方案a 能够保证功能正常, 且能够优化时间执行, 因此是一个更好的方案
              2. 方案1虽然比较难懂, 但是确实有价值
        */
      }

      // 此时不需要立即执行 exec, 但是在 delay - elapsed 之后, 我们需要调用 exec
      // 注意点: 节流有一个特点是, 时间在 t1 时间触发了, t1 时间之后一定会执行 exec
      timeoutID = setTimeout(exec, delay - elapsed);
    }
  };

  wrapper.cancel = cancel;
  return wrapper;
};
/**
 * 防抖函数
 *
 * ```js
 * const debounceRet = debounce(function(e){
 *   console.log('debounce');
 * });
 *
 * window.addEventListener('scroll', debounceRet);
 *
 * // debounceRet 将不可再执行
 * debounceRet.cancel();
 * ```
 *
 * @category Function
 * @param callback 调用的函数
 * @param delay 延迟时间，默认200ms
 * @param options 内部参数
 * @return 返回的值，可以调用 `cancel` 取消执行
 */
const debounce = (callback, delay, options) => {
  if (!delay) {
    delay = 200;
  }
  let isImmediate = true; // 是否立即执行一次逻辑，即立即调用一次 callback
  let isDebounce = true; // 是否是防抖逻辑
  if (typeof options === 'object') {
    isImmediate =
      'isImmediate' in options ? !!options.isImmediate : isImmediate;
    isDebounce = 'isDebounce' in options ? !!options.isDebounce : isDebounce;
  }
  return throttled(callback, delay, {
    isDebounce: isDebounce,
    isImmediate: isImmediate,
  });
};
