# 框架

1. 什么是动态主题，动态主题的场景是什么？
2. 动态主题的原理是什么
3. 动态主题的解决方案 - antd-theme-generator
4. 动态主题的解决方案 - antd 原生解决方案
5. 动态主题的解决方案 - antd V 的解决方案
6. scss 怎么做动态主题

# what

动态主题是指：当用户主动触发某种交互的时候，页面的颜色内容发生变化；
动态主题最常见的场景就是 **黑暗模式**
TODO: 找一例子

# 动态主题的原理

动态换肤的方式一般有两种：

1. less.modifyVars
2. var css

## less.modifyVars

这种方式是在页面引入 less.js 以及 less 文件，然后通过修改 less 变量的方式来达到动态换肤的效果
[demo](./demos/1_modifyVars/index.html)
TODO: 图片效果

## var css

这种方式是通过在不同的 css 选择器下面定义 css 变量值来达到动态换肤的小贵
[demo](./demos/2_var_css.html)
TODO: 图片那效果

# antd 动态主题解决方案

## antd-theme-generator

antd-theme-generator 是一个将 antd 中所有的 less 变量提取成一个单独文件的插件，可以参见下面的资料：
[如何在 umi 系项目中实现动态换肤](https://zhuanlan.zhihu.com/p/347725244)
[Ant Design Runtime Theme Update #10007](https://github.com/ant-design/ant-design/issues/10007)

解决方案的 demo：[demo](./demos/3_antd-theme-generator/)

实现效果：
![](./_images/antd-theme-generator.gif)

TODO: 感觉这个内容还是要看一下原理才行

## antd ConfigProvider

## ant V 解决方案

# QA

## antd-theme-generator 是按需加载还是非按需加载，如果 less 文件发生了变更，antd-theme-generator 能够动态地检测到么?(例如新增了一个组件，可以保证 color.less 文件中存在相应的内容吗？)

## 如果 UI 框架是 scss 的话，如果做动态主题

## antd 中定义的 less 变量有哪些，如果判断这些变量的影响范围？

[参考链接 - 定制主题](https://4x-ant-design.antgroup.com/docs/react/customize-theme-cn)

根据文档中的描述，antd 中定义的 less 变量有：

```
@primary-color: #1890ff; // 全局主色
@link-color: #1890ff; // 链接色
@success-color: #52c41a; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 2px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
  0 9px 28px 8px rgba(0, 0, 0, 0.05); // 浮层阴影
```

如果需要判断这些变量的影响范围，我们根据[themes/default.less](https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less)判断

# 参考链接

1. [如何在 umi 系项目中实现动态换肤](https://zhuanlan.zhihu.com/p/347725244)
2. [using-less-in-the-browser](https://lesscss.org/usage/#using-less-in-the-browser)
3. [](https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less)
