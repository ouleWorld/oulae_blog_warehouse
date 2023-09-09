import { FixedSizeList as List } from 'react-window';

// 还向必须附加到行元素的行渲染方法传递了一个 style 参数。列表项通过内联分配的高度和宽度值来定位到绝对位置，style 参数负责此操作
const Row = ({ index, style }) => <div style={style}>Row {index}</div>;

const FixedSizeListDemo = () => (
  <List height={400} itemCount={1000} itemSize={35} width={600}>
    {Row}
  </List>
);

export default FixedSizeListDemo;
