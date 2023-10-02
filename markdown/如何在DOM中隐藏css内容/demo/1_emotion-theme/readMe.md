# what

该项目是自己在学习 webpack 时，自己搭建的一个基于 React + webpack 的学习环境

# 实现功能

1. 支持 React 路由的动态引入
2. 自定义 loader: clean-log-loader; 其作用是将 js 文件中的 console.log 清除
3. 自定义 plugin: inline-chunk-webpack-plugin; 其作用是将 runtime 文件嵌入 index.html 产物中
4. 开发环境支持接口代理转发
5. eslint 代码检查
6. js 产物代码分割
7. js, css 产物压缩

# 什么场景下使用该项目

如果存在以下的场景，可以使用该项目去搭建 demo:

1. 如果需要尝试不同的 webpack 配置时
2. 自定义 loader, plugin 时
3. 需要写一个基于 React 的 demo 时
