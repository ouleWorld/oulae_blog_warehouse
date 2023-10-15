# 背景

项目中有组件使用到了拖拽的逻辑，所以学习了一下和拖拽有关的两个库

# 相关库

这部分库是已经看过官方文档以及官方提供的 demo

## react-dnd

react-dnd 是一个拖拽的库，它通过两个核心的 hook: useDrag, useDrop 来解决组件的拖拽问题

如果场景主要关心的是拖拽交互逻辑，可以使用这个库

关键词: **拖拽交互**

**虽然这个库比较抽象，但是官方的 demo 写的挺好的，如果看完官方所有的 demo, 感觉使用上应该不会存在太大的问题**

## react-grid-layout

react-grid-layout 是一个拖拽的网格布局系统

如果场景主要关心的是网格布局以及拖拽容器需自定义大小，可以使用这个库

关键词: **网格布局系统、拖拽容器需自定义大小**

# 其他相关库

这部分库暂时没有看文档，不过后续如果需要做拖拽的场景的需求的话，可以关心一些这些库

## react-beautiful-dnd

这是一个用于 React 的漂亮的拖拽库，专门用于创建美观的拖拽列表。它提供了可访问性支持和流畅的动画效果，适用于创建交互性强的列表和网格

## react-draggable-tags

一个轻量级的拖拽排序组件，主要用于解决标签问题
**感觉这个场景 react-dnd 也是能够胜任的**

# 学习思考

如果要学习关于拖拽的库，最好的方案应该是先把官方给的所有 demos 都看完，看完之后基本的使用场景就已经学会了

如果后续需要继续深入学习，在选择去看文档/源码

# 参考链接

1. [ant design 社区精选组件](https://ant.design/docs/react/recommendation-cn)
2. [react-dnd github](https://github.com/react-dnd/react-dnd)
3. [react-grid-layout github](https://github.com/react-grid-layout/react-grid-layout)
4. [react-beautiful-dnd github](https://github.com/atlassian/react-beautiful-dnd/)
5. [react-draggable-tags github](https://github.com/YGYOOO/react-draggable-tags)
