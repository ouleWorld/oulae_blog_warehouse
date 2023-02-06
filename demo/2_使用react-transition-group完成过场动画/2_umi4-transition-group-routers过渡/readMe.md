umi4 中，实现不了路由级别的过渡动画，因为 qutlet?.props?.children 这个内容的渲染好像有点问题，活多出一个页面来(目测是 umi4 的问题，因为在 umi3 中其实是有方案做这件事情的)  

如果一定需要实现 CSR 页面路由级别的过度动画，请使用其他脚手架  

[umi 3 中实现路由级别的过渡动画](https://github.com/umijs/umi/issues/4827)