import { FixedSizeGrid as Grid } from 'react-window';

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div style={style}>
    Item {rowIndex},{columnIndex}
  </div>
);

// columns: 列
// row: 行
const FixedSizeGridDemo = () => (
  <Grid
    columnCount={1000}
    columnWidth={100}
    height={150}
    rowCount={500}
    rowHeight={35}
    width={300}
  >
    {Cell}
  </Grid>
);

export default FixedSizeGridDemo;
