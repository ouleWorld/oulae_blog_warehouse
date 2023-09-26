# 框架

1. 什么是动态主题，动态主题的场景是什么？
2. 动态主题的原理是什么
3. 动态主题的解决方案 - antd-theme-generator
4. 动态主题的解决方案 - antd 原生解决方案
5. 动态主题的解决方案 - antd V 的解决方案

# what

动态主题是指：当用户主动触发某种交互的时候，页面的颜色内容发生变化；
动态主题最常见的场景就是 **黑暗模式**

# 动态主题的原理

动态换肤的方式一般有两种：

1. less.modifyVars
2. var css TODO(现在需要写一个这个 demo 了)

# QA

## antd-theme-generator 是按需加载还是非按需加载，如果 less 文件发生了变更，antd-theme-generator 能够动态地检测到么?(例如新增了一个组件，可以保证 color.less 文件中存在相应的内容吗？)

# 参考链接

1. [如何在 umi 系项目中实现动态换肤](https://zhuanlan.zhihu.com/p/347725244)
2. [using-less-in-the-browser](https://lesscss.org/usage/#using-less-in-the-browser)
