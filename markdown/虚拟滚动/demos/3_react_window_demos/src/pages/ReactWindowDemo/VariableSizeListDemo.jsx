import { VariableSizeList as List } from 'react-window';

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

const getItemSize = (index) => rowHeights[index];

const Row = ({ index, style }) => <div style={style}>Row {index}</div>;

const VariableSizeListDemo = () => (
  <List
    height={150}
    itemCount={1000}
    // 相较于 FixedSizeList，VariableSizeList 需要提供一个函数来获取宽高
    itemSize={getItemSize}
    width={300}
  >
    {Row}
  </List>
);

export default VariableSizeListDemo;
