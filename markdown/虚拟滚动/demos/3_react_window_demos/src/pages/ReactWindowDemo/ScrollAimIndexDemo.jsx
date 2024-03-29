/* eslint-disable react/button-has-type */
import { Button } from 'antd';
import React, { Component, Fragment } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div
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

class ScrollAimIndexDemo extends Component {
  gridRef = React.createRef();

  render() {
    return (
      <Fragment>
        <div>
          <Button
            className="ExampleButton"
            onClick={this.scrollToRow100Column50Auto}
            style={{ display: 'block' }}
          >
            Scroll to row 100, column 50 (align: auto)
          </Button>
          <Button
            className="ExampleButton"
            onClick={this.scrollToRow300Column150Start}
            style={{ display: 'block' }}
          >
            Scroll to row 300, column 150 (align: start)
          </Button>
          <Button
            className="ExampleButton"
            onClick={this.scrollToRow350Column200End}
            style={{ display: 'block' }}
          >
            Scroll to row 350, column 200 (align: end)
          </Button>
          <Button
            className="ExampleButton"
            onClick={this.scrollToRow200Column100Center}
            style={{ display: 'block' }}
          >
            Scroll to row 200, column 100 (align: center)
          </Button>
          <Button
            className="ExampleButton"
            onClick={this.scrollToRow250Column150Smart}
            style={{ display: 'block' }}
          >
            Scroll to row 250, column 150 (align: smart)
          </Button>
        </div>
        <Grid
          className="Grid"
          columnCount={1000}
          columnWidth={100}
          height={150}
          ref={this.gridRef}
          rowCount={1000}
          rowHeight={35}
          width={300}
        >
          {Cell}
        </Grid>
      </Fragment>
    );
  }

  scrollToRow100Column50Auto = () => {
    this.gridRef.current.scrollToItem({
      columnIndex: 50,
      rowIndex: 100,
    });
  };

  scrollToRow300Column150Start = () => {
    this.gridRef.current.scrollToItem({
      align: 'start',
      columnIndex: 150,
      rowIndex: 300,
    });
  };

  scrollToRow350Column200End = () => {
    this.gridRef.current.scrollToItem({
      align: 'end',
      columnIndex: 200,
      rowIndex: 350,
    });
  };

  scrollToRow200Column100Center = () => {
    this.gridRef.current.scrollToItem({
      align: 'center',
      columnIndex: 100,
      rowIndex: 200,
    });
  };

  scrollToRow250Column150Smart = () => {
    this.gridRef.current.scrollToItem({
      align: 'smart',
      columnIndex: 150,
      rowIndex: 250,
    });
  };
}

export default ScrollAimIndexDemo;
