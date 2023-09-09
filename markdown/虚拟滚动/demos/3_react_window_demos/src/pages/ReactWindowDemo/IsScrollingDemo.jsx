import { FixedSizeList as List } from 'react-window';

const Row = ({ index, isScrolling, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    {isScrolling ? 'Scrolling' : `Row ${index}`}
  </div>
);

const IsScrollingDemo = () => (
  <List
    className="List"
    height={150}
    itemCount={1000}
    itemSize={35}
    useIsScrolling
    width={300}
  >
    {Row}
  </List>
);

export default IsScrollingDemo;
