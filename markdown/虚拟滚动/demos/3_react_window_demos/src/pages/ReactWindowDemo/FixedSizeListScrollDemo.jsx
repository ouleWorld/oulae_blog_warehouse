import { Button } from 'antd';
import memoize from 'memoize-one';
import { PureComponent, memo } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';

// mock 数据的生成
const generateItems = (numItems) =>
  Array(numItems)
    .fill(true)
    .map((_) => ({
      isActive: false,
      label: Math.random().toString(36).substr(2),
    }));

// table Row 的生成组件
/**
 * Q: 为什么使用 memo 去修饰，同时为什么使用 areEqual 这个比较函数
 * A:
 * 使用 memo 修饰组件是 React 性能优化的套路，它能够减少无效的渲染
 * 这里的 areEqual 是 react-window 这个库提供的，直接使用就好
 */
const Row = memo(({ data, index, style }) => {
  console.log('Row 组件发生了更新');
  const { items, toggleItemActive } = data;
  const item = items[index];

  return (
    <div onClick={() => toggleItemActive(index)} style={style}>
      {item.label} is {item.isActive ? 'active' : 'inactive'}
    </div>
  );
}, areEqual);

/**
 * Q: 这里为什么需要使用 memoize 去修饰我们的 itemData 呢？
 * A:
 * 在 React 这个框架下，有这样一个特征：父组件的更新会直接触发子组件的更新，如果我们使用了 React.memo, pureComponent 类似的套路去优化组件时，子组件会默认对传入的 props 参数进行浅比较
 * 但是浅比较对于对象会有一个问题：只有两个对象指向同一个内存地址时，浅比较才会返回 true（即 Object.is 的性质）所以如果我们的 props 传入的时一个对象时，上面所述的优化套路其实意义是不太大的
 * 所以这里我们使用了 memoize-one 这个库，它保证了：如果我们传入的参数是同样的(内部的比较方式暂时没有去探究，但是估计使用了遍历比较)，他就会返回一个缓存对象，这样我们就能在对象的场景下使用 React.memo 的能力了
 */
const createItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive,
}));

function Example({ height, items, toggleItemActive, width }) {
  // 使用 memoize-one 优化的情况
  // const itemData = createItemData(items, toggleItemActive);
  // 不使用 memoize-one 优化的情况
  const itemData = {
    items,
    toggleItemActive,
  };

  return (
    <List
      height={height}
      itemCount={items.length}
      itemData={itemData}
      itemSize={35}
      width={width}
    >
      {Row}
    </List>
  );
}

class FixedSizeListScrollDemo extends PureComponent {
  state = {
    items: generateItems(1000),
    number: 0,
  };

  toggleItemActive = (index) =>
    this.setState((prevState) => {
      const item = prevState.items[index];
      const items = prevState.items.concat();
      items[index] = {
        ...item,
        isActive: !item.isActive,
      };
      return { items };
    });

  render() {
    const { number } = this.state;
    return (
      <>
        <Example
          height={150}
          items={this.state.items}
          toggleItemActive={this.toggleItemActive}
          width={300}
        />
        <Button
          onClick={() => {
            const temp = number + 1;
            this.setState({
              number: temp,
            });
          }}
        >
          click me!
        </Button>
      </>
    );
  }
}

export default FixedSizeListScrollDemo;
