// @ts-ignore
!(function () {
  const next = window.requestAnimationFrame
    ? requestAnimationFrame
    : (callback) => {
        setTimeout(callback, 1000 / 60);
      };

  const frames = [];

  let frame = 0;
  let lastSecond = Date.now();

  function calculateFPS() {
    frame++;
    const now = Date.now();
    if (lastSecond + 1000 <= now) {
      // 由于 now - lastSecond 的单位是毫秒，所以 frame 要 * 1000
      const fps = Math.round((frame * 1000) / (now - lastSecond));
      frames.push(fps);

      frame = 0;
      lastSecond = now;
    }

    // 避免上报太快，缓存一定数量再上报
    if (frames.length >= 20) {
      console.log('frames: ', frames);

      frames.length = 0;
    }

    next(calculateFPS);
  }

  calculateFPS();
})();
