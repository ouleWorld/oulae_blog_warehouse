// app.ts
const setColor = () => {
  const publicPath = ''; // 项目的publicPath，没有配置的可以置空
  const lessConfigNode = document.createElement('script');
  const lessScriptNode = document.createElement('script');
  const lessStyleNode = document.createElement('link');
  lessStyleNode.setAttribute('rel', 'stylesheet/less');
  lessStyleNode.setAttribute('href', publicPath + '/color.less');

  lessConfigNode.innerHTML = `
      less = {
        async: true,
        env: 'development',
      };
    `;
  lessScriptNode.src = 'https://cdn.bootcss.com/less.js/2.5.3/less.min.js';
  lessScriptNode.async = true;
  // 引入顺序不能改变
  document.body.appendChild(lessStyleNode);
  document.body.appendChild(lessConfigNode);
  document.body.appendChild(lessScriptNode);
};

export function render(oldRender) {
  setColor();

  oldRender();
}
