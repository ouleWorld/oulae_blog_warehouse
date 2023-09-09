import React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

// 获取 cell 的位置信息 (column, row)
function getCellIndicies(child) {
  return { row: child.props.rowIndex, column: child.props.columnIndex };
}

// 获取虚拟滚动中渲染 data 中数据的下标
function getShownIndicies(children) {
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minColumn = Infinity;
  let maxColumn = -Infinity;

  React.Children.forEach(children, (child) => {
    const { row, column } = getCellIndicies(child);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minColumn = Math.min(minColumn, column);
    maxColumn = Math.max(maxColumn, column);
  });

  return {
    from: {
      row: minRow,
      column: minColumn,
    },
    to: {
      row: maxRow,
      column: maxColumn,
    },
  };
}

function useInnerElementType(Cell, columnWidth, rowHeight) {
  // console.log('====> useInnerElementType: ', Cell, columnWidth, rowHeight);
  return React.useMemo(
    () =>
      React.forwardRef((props, ref) => {
        // console.log('====> props: ', props);
        // 计算 rows 高度的累加和，我们使用这个函数计算第一个 sticky row 的 marginTop
        function sumRowsHeights(index) {
          let sum = 0;

          while (index > 1) {
            sum += rowHeight(index - 1);
            index -= 1;
          }

          return sum;
        }

        // 计算 columns 宽度的累加和，我们使用这个函数计算第一个 sticky columns 的 marginLeft
        function sumColumnWidths(index) {
          let sum = 0;

          while (index > 1) {
            sum += columnWidth(index - 1);
            index -= 1;
          }

          return sum;
        }

        const shownIndecies = getShownIndicies(props.children);
        // console.log('====> shownIndecies: ', shownIndecies);

        /**
         * Q: React.Children 这个 API 的作用是啥？
         * A:
         * 参考链接：https://react.dev/reference/react/Children#children-map
         * 这个 API 可以让我们遍历 props.child 属性
         */
        // 简而言之，这里对 children 的操作其实就是：干掉(0, 0)位置的 Cell, 然后我们新建一个 (0, 0) 位置的 Cell，它具有 sticky 布局的性质
        const children = React.Children.map(props.children, (child) => {
          const { column, row } = getCellIndicies(child);

          // do not show non-sticky cell
          /**
           * Q: 为什么这里要过滤掉首行，首列的数据呢？
           * A:
           * 这些位置是需要使用 sticky 布局的，所以我们这里直接过滤掉，这样就不需要渲染多余的数据了
           */
          if (column === 0 || row === 0) {
            return null;
          }

          return child;
        });

        children.push(
          /**
           * 特别注意点: cell 其实就是指向我们父组件的 Cell 组件；这里真的第一次知道还可以这么使用
           */
          React.createElement(Cell, {
            key: '0:0',
            rowIndex: 0,
            columnIndex: 0,
            style: {
              display: 'inline-flex',
              width: columnWidth(0),
              height: rowHeight(0),
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 4,
            },
          }),
        );

        // 处理固定首行的逻辑
        const shownColumnsCount =
          shownIndecies.to.column - shownIndecies.from.column;

        for (let i = 1; i <= shownColumnsCount; i += 1) {
          const columnIndex = i + shownIndecies.from.column;
          const rowIndex = 0;
          const width = columnWidth(columnIndex);
          const height = rowHeight(rowIndex);

          /**
           * Q: 下面这个逻辑的意义是啥？
           * A:
           * 首先先固定两个概念：
           * 绝对视角的(0, 0)
           * 当前视角的视角(cur0, cur0)
           * 当发生 y 轴滚动时，(0, 0) 需要覆盖 (cur0, cur0)
           * 因此，我们需要保证(cur0, cur0) 一定处于(0, 0) 的位置
           * 在这里我们使用的是 marginLeft
           * 后续的没有设置 marginLeft 的内容，会沿着第一个 sticky 按照顺序排列
           */
          const marginLeft = i === 1 ? sumColumnWidths(columnIndex) : undefined;

          children.push(
            React.createElement(Cell, {
              key: `${rowIndex}:${columnIndex}`,
              rowIndex,
              columnIndex,
              style: {
                marginLeft,
                display: 'inline-flex',
                width,
                height,
                position: 'sticky',
                top: 0,
                zIndex: 3,
              },
            }),
          );
        }

        // 处理固定首列的逻辑
        const shownRowsCount = shownIndecies.to.row - shownIndecies.from.row;

        for (let i = 1; i <= shownRowsCount; i += 1) {
          const columnIndex = 0;
          const rowIndex = i + shownIndecies.from.row;
          const width = columnWidth(columnIndex);
          const height = rowHeight(rowIndex);

          const marginTop = i === 1 ? sumRowsHeights(rowIndex) : undefined;

          children.push(
            React.createElement(Cell, {
              key: `${rowIndex}:${columnIndex}`,
              rowIndex,
              columnIndex,
              style: {
                marginTop,
                width,
                height,
                position: 'sticky',
                left: 0,
                zIndex: 2,
              },
            }),
          );
        }

        console.log('useInnerElementType 组件只会被渲染一次');
        return (
          // 注意这里一定要使用 ref 进行绑定， Grid 应该是会默认传入一个 ref 的(scrollToItem API)
          <div ref={ref} {...props} className="oulaeTest">
            {children}
          </div>
        );
      }),
    [Cell, columnWidth, rowHeight],
  );
}

export function GridWithStickyCells(props) {
  return (
    <Grid
      {...props}
      /**
       * Q: innerElementType 属性是什么意思？
       * A:
       * 传递给 document.createElement 的标签名称，用于创建内部容器元素。这是一个高级属性；在大多数情况下，应使用默认值（"div"）。
       * 它表示的是整个虚拟DOM container，该组件只会被渲染一次
       */
      innerElementType={useInnerElementType(
        props.children,
        props.columnWidth,
        props.rowHeight,
      )}
    />
  );
}
