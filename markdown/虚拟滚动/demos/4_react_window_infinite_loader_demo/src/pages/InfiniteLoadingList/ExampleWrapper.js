import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export default function ExampleWrapper({
  // 是否还有下一页
  hasNextPage,

  // 我们当前是出于正在加载的状态吗
  isNextPageLoading,

  // 数据源 items
  items,

  // 加载下一页的请求函数
  loadNextPage,
}) {
  // 如果要加载更多项目，添加额外的行来容纳加载指示器。
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // 加载更多数据的函数
  /**
   * Q: 为什么这里需要使用 isNextPageLoading 来做一次请求函数的判空呢？
   * A: 防止在请求期间重复触发请求
   */
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // 判断 InfiniteLoader 的第 index 个 item 是否加载完成了
  /**
   * Q: InfiniteLoader 是怎么判断列表会否已经加载完成了？
   * A:
   * isItemLoaded 配置会针对每一项 item 进行计算(到单前滚动位置为止)
   * 如果所有的 item 返回结果都为 true, 则表示已经加载完成了
   * 否则就是没有加载完成
   *
   * 我们的接口会告诉我们是否已经加载完成了， 如果没有加载完成，我们会给 itemCount 执行 +1 操作，最后一个元素就表示 loading 元素
   * 此时这个 loading 元素的 isItemLoaded的计算结果肯定是 false
   * 即 loading 元素进入到判断逻辑时，InfiniteLoader 就知道需要执行 loadmore 操作了
   */
  const isItemLoaded = (index) => {
    console.log(
      '====> isItemLoaded: ',
      index,
      !hasNextPage || index < items.length,
    );
    return !hasNextPage || index < items.length;
  };

  // Render an item or a loading indicator.
  const Item = ({ index, style }) => {
    let content;
    /**
     * 特别注意点：这里加载 loading 状态的方法真的很巧妙，自己之前真的没有想过居然可以使用这种方式呈现 loading 状态
     * 加载 loading  的方法：
     * 1. 在确认需要加载下一页数据的情况下，将 itemCount 累加 1
     * 2. 然后再 Item 渲染函数中判断，如果是最后一个元素则渲染 loading
     */
    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = items[index].name;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={300}
          itemCount={itemCount}
          itemSize={30}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
