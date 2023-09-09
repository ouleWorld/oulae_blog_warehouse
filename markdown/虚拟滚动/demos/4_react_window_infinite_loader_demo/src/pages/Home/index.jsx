import { Fragment, PureComponent } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

const LOADING = 1;
const LOADED = 2;
let itemStatusMap = {};

// 判断当前下标的数据是否处于 loading 状态
const isItemLoaded = (index) => !!itemStatusMap[index];

// 加载更多数据的函数，可以把这个函数看作是请求
const loadMoreItems = (startIndex, stopIndex) => {
  console.log('====> loadMoreItems: ', startIndex, stopIndex);
  // 给数据添加上 loading 状态
  for (let index = startIndex; index <= stopIndex; index++) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      // 2.5s 之后，取消数据的 loading 状态
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }
      resolve();
    }, 2500),
  );
};

class Row extends PureComponent {
  render() {
    const { index, style } = this.props;
    let label;
    if (itemStatusMap[index] === LOADED) {
      label = `Row ${index}`;
    } else {
      label = 'Loading...';
    }
    return (
      <div className="ListItem" style={style}>
        {label}
      </div>
    );
  }
}

export default function App() {
  return (
    <Fragment>
      <p className="Note">
        该演示应用程序使用 2.5 秒计时器模拟加载远程数据。
        当行“正在加载”时，它们将显示“正在加载...”标签。
        “加载”数据后，将显示行号。 开始滚动列表以自动加载数据。
      </p>
      <InfiniteLoader
        /**
         * Q: isItemLoaded 这个参数的意义在哪里呢？
         * A: TODO:
         * isItemLoaded 允许开发者跟踪每个 item 的加载状态，这样我们就能更加细化地控制 item 的 loading 状态了
         */
        // 负责跟踪每个项目加载状态的函数。
        isItemLoaded={isItemLoaded}
        // 列表中的行数；如果实际行数未知，可以任意取大。
        itemCount={1000}
        // 当必须加载更多数据行时调用的回调。它应返回一个 Promise，在所有数据加载完成后解析该 Promise。
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            className="List"
            width={300}
            height={300}
            itemCount={1000}
            itemSize={30}
            // 当列表呈现的项目范围发生变化时调用。只有当项目索引发生变化时，才会调用该回调。如果项目因其他原因（如改变 isScrolling 或数据参数）而重新渲染，则不会调用该回调。
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    </Fragment>
  );
}
