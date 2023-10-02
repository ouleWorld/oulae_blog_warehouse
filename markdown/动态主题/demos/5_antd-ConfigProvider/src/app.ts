// app.ts
const setColor = () => {
  const publicPath = ''; // 项目的publicPath，没有配置的可以置空
  const lessStyleNode = document.createElement('link');
  lessStyleNode.setAttribute('rel', 'stylesheet');
  lessStyleNode.setAttribute('href', publicPath + 'modified.css');

  document.body.appendChild(lessStyleNode);
};

export function render(oldRender) {
  setColor();

  oldRender();
