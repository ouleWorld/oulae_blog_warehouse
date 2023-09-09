import React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import './GridWithStickyCells.less';
import {
  StickyContainerBottom,
  StickyContainerBottomLeft,
  StickyContainerBottomRight,
  StickyContainerLeft,
  StickyContainerRight,
  StickyContainerTop,
  StickyContainerTopLeft,
  StickyContainerTopRight,
  getShownIndicies,
} from './utils';

/**
 * 渲染虚拟 DOM 的组件
 * @param {*} Cell
 * @param {*} columnWidth
 * @param {*} rowHeight
 * @param {*} columnCount
 * @param {*} rowCount
 * @param {*} fixedStyle
 * @returns
 */
function useInnerElementType(
  Cell,
  columnWidth,
  rowHeight,
  columnCount,
  rowCount,
  fixedStyle,
) {
  // 使用 React.useMemo 做缓存优化
  return React.useMemo(
    () =>
      React.forwardRef((props, ref) => {
        /**
         * 计算 rows 高度的累加和，我们使用这个函数计算第一个 sticky row 的 marginTop
         * @param {*} startIndex 开始的index
         * @param {*} endIndex 结束的index
         * @returns
         */
        function sumRowsHeights(startIndex, endIndex = 0) {
          let index = startIndex;
          let sum = 0;

          while (index > endIndex) {
            sum += rowHeight(index - 1);
            index -= 1;
          }

          return sum;
        }

        /**
         * 计算 columns 宽度的累加和，我们使用这个函数计算第一个 sticky columns 的 marginLeft
         * @param {*} startIndex 开始的index
         * @param {*} endIndex 结束的index
         * @returns
         */
        function sumColumnWidths(startIndex, endIndex = 0) {
          let index = startIndex;
          let sum = 0;

          while (index > endIndex) {
            sum += columnWidth(index - 1);
            index -= 1;
          }

          return sum;
        }

        // 获取虚拟滚动中渲染 data 中数据的下标
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
          // TODO: 这里存在一个优化的手段，我们可以将 fixed 的元素全部都过滤掉
          // const { column, row } = getCellIndicies(child);
          // if (row + (fixedStyle?.bottom || 0) >= rowCount) {
          //   return null;
          // }

          return child;
        });

        // column 的展示数量
        const shownColumnsCount =
          shownIndecies.to.column - shownIndecies.from.column;
        // row 的展示数量
        const shownRowsCount = shownIndecies.to.row - shownIndecies.from.row;

        // 为页面中的各个容器计算出相应的元素

        const topLeftContainer = [];
        if (fixedStyle?.top && fixedStyle?.left) {
          for (let k = 0; k < fixedStyle?.top; k++) {
            topLeftContainer[k] = [];
            for (let i = 0; i < fixedStyle?.left; i++) {
              const columnIndex = i;
              const rowIndex = k;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              topLeftContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    display: 'inline-flex',
                    width,
                    height,
                  },
                }),
              );
            }
          }
        }

        const topRightContainer = [];
        if (fixedStyle?.top && fixedStyle?.right) {
          for (let k = 0; k < fixedStyle?.top; k++) {
            topRightContainer[k] = [];
            for (let i = 0; i < fixedStyle?.right; i++) {
              const columnIndex = columnCount - i - 1;
              const rowIndex = k;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              topRightContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    display: 'inline-flex',
                    width,
                    height,
                  },
                }),
              );
            }
          }
        }

        const topContainer = [];
        if (fixedStyle?.top) {
          for (let k = 0; k < fixedStyle?.top; k++) {
            topContainer[k] = [];
            for (
              let i = fixedStyle?.left || 0;
              i <= shownColumnsCount;
              i += 1
            ) {
              const columnIndex = shownIndecies.from.column + i;
              const rowIndex = k;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              let marginLeft = undefined;
              if (i === (fixedStyle?.left || 0)) {
                if (fixedStyle?.left) {
                  // 存在固定行时，固定列的 marginLeft 方法
                  marginLeft = sumColumnWidths(columnIndex, fixedStyle?.left);
                } else {
                  marginLeft = sumColumnWidths(columnIndex);
                }

                // marginLeft = sumColumnWidths(columnIndex);
              }

              topContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    marginLeft,
                    display: 'inline-flex',
                    width,
                    height,
                    zIndex: 3,
                  },
                }),
              );
            }
          }
        }

        // 处理 固定-left 的逻辑
        const leftContainer = [];
        if (fixedStyle?.left) {
          // k 表示 固定列-left 的序号，方向是从左到右
          for (let k = 0; k < fixedStyle?.left; k++) {
            leftContainer[k] = [];
            let temp = shownRowsCount;
            // 如果 bottom 方向存在固定行的话，那么固定的内容则不进行加载了
            if (fixedStyle?.bottom) {
              temp -= fixedStyle?.bottom;
            }
            for (let i = fixedStyle?.top || 0; i <= temp; i += 1) {
              const columnIndex = k;
              const rowIndex = i + shownIndecies.from.row;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              let marginTop = undefined;
              if (i === (fixedStyle?.top || 0)) {
                if (fixedStyle?.top) {
                  // 存在固定行时，固定列的 marginTop 方法
                  /**
                   * Q: 存在固定行时，为什么固定列的 marginTop 是这样计算呢？
                   * A:
                   * 关于 marginTop 的意义我们可以看下面的注释
                   */
                  marginTop = sumRowsHeights(rowIndex, fixedStyle?.top);
                } else {
                  /**
                   * Q: 不存在固定行时，为什么 marginTop 的计算方法是这样的呢？
                   * A:
                   * 首先说一下 marginTop 的意义：marginTop 表示将 left div 放置在合适的位置，以此来让我们在 y 轴滚动时 left div 显示正确地元素 DOM
                   * 如果在不使用虚拟滚动的情况下，一般的我们会向所有的原始内容渲染在页面上，这样由于滚动的同步我们就能看到相应的内容了
                   * 但是在虚拟滚动的场景中，我们并不会渲染所有的元素，因此我们使用 marginTop 来校验首个元素的位置(后面的元素堆叠排放，这样位置就正确了)
                   * 因此 marginTop 的实际意义是：因此的固定列元素 height 之和
                   * 因此在这个场景下，我们直接使用 sumRowHeights 计算即可
                   */
                  marginTop = sumRowsHeights(rowIndex);
                }
              }

              leftContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    marginTop,
                    display: 'inline-flex',
                    width,
                    height,
                    zIndex: 3,
                  },
                }),
              );
            }
          }
        }

        const rightContainer = [];
        if (fixedStyle?.right) {
          // k 表示 固定列-left 的序号，方向是从左到右
          for (let k = 0; k < fixedStyle?.right; k++) {
            rightContainer[k] = [];
            let temp = shownRowsCount;
            if (fixedStyle?.bottom) {
              temp -= fixedStyle?.bottom;
            }
            for (let i = fixedStyle?.top || 0; i <= temp; i += 1) {
              const columnIndex = columnCount - k - 1;
              const rowIndex = i + shownIndecies.from.row;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              let marginTop = undefined;
              if (i === (fixedStyle?.top || 0)) {
                if (fixedStyle?.top) {
                  // 存在固定行时，固定列的 marginTop 方法
                  /**
                   * Q: 存在固定行时，为什么固定列的 marginTop 是这样计算呢？
                   * A:
                   * 关于 marginTop 的意义我们可以看下面的注释
                   */
                  marginTop = sumRowsHeights(rowIndex, fixedStyle?.top);
                } else {
                  /**
                   * Q: 不存在固定行时，为什么 marginTop 的计算方法是这样的呢？
                   * A:
                   * 首先说一下 marginTop 的意义：marginTop 表示将 left div 放置在合适的位置，以此来让我们在 y 轴滚动时 left div 显示正确地元素 DOM
                   * 如果在不使用虚拟滚动的情况下，一般的我们会向所有的原始内容渲染在页面上，这样由于滚动的同步我们就能看到相应的内容了
                   * 但是在虚拟滚动的场景中，我们并不会渲染所有的元素，因此我们使用 marginTop 来校验首个元素的位置(后面的元素堆叠排放，这样位置就正确了)
                   * 因此 marginTop 的实际意义是：因此的固定列元素 height 之和
                   * 因此在这个场景下，我们直接使用 sumRowHeights 计算即可
                   */
                  marginTop = sumRowsHeights(rowIndex);
                }
              }

              rightContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    marginTop,
                    display: 'inline-flex',
                    width,
                    height,
                    zIndex: 3,
                  },
                }),
              );
            }
          }
        }

        const bottomContainer = [];
        if (fixedStyle?.bottom) {
          for (let k = 0; k < fixedStyle?.bottom; k++) {
            bottomContainer[k] = [];
            for (
              let i = fixedStyle?.left || 0;
              i <= shownColumnsCount;
              i += 1
            ) {
              const columnIndex = shownIndecies.from.column + i;
              const rowIndex = rowCount - k - 1;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              let marginLeft = undefined;
              if (i === (fixedStyle?.left || 0)) {
                if (fixedStyle?.left) {
                  // 存在固定行时，固定列的 marginLeft 方法
                  marginLeft = sumColumnWidths(columnIndex, fixedStyle?.left);
                } else {
                  marginLeft = sumColumnWidths(columnIndex);
                }
              }

              bottomContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    marginLeft,
                    display: 'inline-flex',
                    width,
                    height,
                    zIndex: 3,
                  },
                }),
              );
            }
          }
        }

        const bottomLeftContainer = [];
        // 只有存在 top-行，left-列 需要固定时，才需要展示 topLeftContainer 容器
        if (fixedStyle?.bottom && fixedStyle?.left) {
          for (let k = 0; k < fixedStyle?.bottom; k++) {
            bottomLeftContainer[k] = [];
            for (let i = 0; i < fixedStyle?.left; i++) {
              const columnIndex = i;
              const rowIndex = rowCount - k - 1;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              bottomLeftContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    display: 'inline-flex',
                    width,
                    height,
                  },
                }),
              );
            }
          }
        }

        const bottomRightContainer = [];
        // 只有存在 top-行，left-列 需要固定时，才需要展示 topLeftContainer 容器
        if (fixedStyle?.bottom && fixedStyle?.left) {
          for (let k = 0; k < fixedStyle?.bottom; k++) {
            bottomRightContainer[k] = [];
            for (let i = 0; i < fixedStyle?.left; i++) {
              const columnIndex = columnCount - i - 1;
              const rowIndex = rowCount - k - 1;
              const width = columnWidth(columnIndex);
              const height = rowHeight(rowIndex);

              bottomRightContainer[k].push(
                React.createElement(Cell, {
                  key: `${rowIndex}:${columnIndex}`,
                  rowIndex,
                  columnIndex,
                  style: {
                    display: 'inline-flex',
                    width,
                    height,
                  },
                }),
              );
            }
          }
        }

        // 为了组件能够正常的展示，我们的 children_container 需要一个正常的高度
        const test = sumRowsHeights(
          rowCount - (fixedStyle.bottom || 0),
          fixedStyle.top || 0,
        );
        return (
          // 注意这里一定要使用 ref 进行绑定， Grid 应该是会默认传入一个 ref 的(scrollToItem API)
          <div ref={ref} {...props} className="oulaeTest">
            {topLeftContainer.length ? (
              <StickyContainerTopLeft>
                {topLeftContainer.map((ele, key) => {
                  return (
                    <div key={key} style={{ width: 'fit-content' }}>
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerTopLeft>
            ) : null}
            {topRightContainer.length ? (
              <StickyContainerTopRight>
                {topRightContainer.map((ele, key) => {
                  return (
                    <div key={key} style={{ width: 'fit-content' }}>
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerTopRight>
            ) : null}
            {topContainer.length ? (
              <StickyContainerTop height={sumRowsHeights(fixedStyle?.top)}>
                {topContainer.map((ele, key) => {
                  return <div key={key}>{ele}</div>;
                })}
              </StickyContainerTop>
            ) : null}
            {leftContainer.length ? (
              <StickyContainerLeft>
                {leftContainer.map((ele, key) => {
                  return (
                    <div
                      className="leftContainer"
                      key={key}
                      style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerLeft>
            ) : null}
            {rightContainer.length ? (
              <StickyContainerRight>
                {rightContainer.map((ele, key) => {
                  return (
                    <div
                      className="rightContainer"
                      key={key}
                      style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerRight>
            ) : null}
            <div className="children_container" style={{ height: `${test}px` }}>
              {children}
            </div>
            {bottomLeftContainer.length ? (
              <StickyContainerBottomLeft>
                {bottomLeftContainer.reverse().map((ele, key) => {
                  return (
                    <div key={key} style={{ width: 'fit-content' }}>
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerBottomLeft>
            ) : null}
            {bottomRightContainer.length ? (
              <StickyContainerBottomRight>
                {bottomRightContainer.reverse().map((ele, key) => {
                  return (
                    <div key={key} style={{ width: 'fit-content' }}>
                      {ele}
                    </div>
                  );
                })}
              </StickyContainerBottomRight>
            ) : null}
            {bottomContainer.length ? (
              <StickyContainerBottom
                height={sumRowsHeights(rowCount, rowCount - fixedStyle?.bottom)}
              >
                {bottomContainer.reverse().map((ele, key) => {
                  return <div key={key}>{ele}</div>;
                })}
              </StickyContainerBottom>
            ) : null}
          </div>
        );
      }),
    [Cell, columnWidth, rowHeight, columnCount, rowCount, fixedStyle],
  );
}

/**
 * 虚拟滚动table - 附带固定行列功能
 * @param {*} props
 * @returns
 */
export function GridWithStickyCells(props) {
  const { fixedStyle, ...propsParams } = props;
  return (
    <Grid
      {...propsParams}
      /**
       * Q: innerElementType 属性是什么意思？
       * A:
       * 传递给 document.createElement 的标签名称，用于创建内部容器元素。这是一个高级属性；在大多数情况下，应使用默认值（"div"）。
       * 它表示的是整个虚拟DOM container，该组件只会被渲染一次
       */
      innerElementType={useInnerElementType(
        propsParams.children,
        propsParams.columnWidth,
        propsParams.rowHeight,
        propsParams.columnCount,
        propsParams.rowCount,
        fixedStyle,
      )}
    />
  );
}
