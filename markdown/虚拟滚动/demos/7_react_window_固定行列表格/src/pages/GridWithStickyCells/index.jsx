import { GridWithStickyCells } from './GridWithStickyCells';

import './index.css';

// 随机生成 width 数据
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
// 随机生成 height 数据
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div
    // 这里的意义是将背景颜色错开
    className={
      columnIndex % 2
        ? rowIndex % 2 === 0
          ? 'GridItemOdd'
          : 'GridItemEven'
        : rowIndex % 2
        ? 'GridItemOdd'
        : 'GridItemEven'
    }
    style={style}
  >
    r{rowIndex}, c{columnIndex}
  </div>
);

console.log('====> columnWidths: ', columnWidths);
console.log('====> rowHeights: ', rowHeights);
const StickyContainer = () => (
  <GridWithStickyCells
    className="Grid"
    columnCount={1000}
    columnWidth={(index) => columnWidths[index]}
    height={600}
    rowCount={1000}
    rowHeight={(index) => rowHeights[index]}
    width={600}
  >
    {Cell}
  </GridWithStickyCells>
);

export default StickyContainer;
