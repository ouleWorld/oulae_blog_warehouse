import { Modal, Table, theme } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { VariableSizeGrid as Grid } from 'react-window';
import './DataTable.less';
import './DataTableVitualScroll.less';
import { getDataFn } from './getData';

const VirtualTable = (props) => {
  const { columns, scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);
  const { token } = theme.useToken();

  const widthColumnCount = columns.filter(({ width }) => !width).length;

  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column;
    }
    return {
      ...column,
      // TODO: 这样设置的意义是啥？
      width: 80,
    };
  });

  const gridRef = useRef();

  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  // rawData: table dataSource
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    // console.log('rawData: ', rawData);
    // console.log('mergedColumns: ', mergedColumns);
    // TODO: 没有搞明白这个语句有啥用
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll?.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
        fixedColumnWidth={80}
      >
        {({ columnIndex, rowIndex, style }) => {
          // console.log(
          //   'mergedColumns[columnIndex]: ',
          //   mergedColumns[columnIndex],
          // );
          // console.log('rawData[rowIndex]: ', rawData[rowIndex]);
          return (
            <div
              className={`virtual-table-cell ${
                columnIndex === mergedColumns.length - 1
                  ? 'virtual-table-cell-last'
                  : ''
              }`}
              style={{
                ...style,
                boxSizing: 'border-box',
                padding: token.padding,
                borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                background: token.colorBgContainer,
              }}
            >
              {mergedColumns[columnIndex].render(
                rawData[rowIndex][mergedColumns[columnIndex].dataIndex],
                rawData[rowIndex],
              )}
            </div>
          );
        }}
      </Grid>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

const DataTableVitualScroll = (props, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      show: () => {
        flushSync(() => {
          setOpen(true);
          setLoading(true);
        });
        flushSync(() => {
          getDataFn().then((res) => {
            setData(res);
            setLoading(false);
          });
        });
      },
      hide: () => {
        setOpen(false);
      },
    };
  });

  useEffect(() => {
    console.log('渲染消耗的时间为：', Date.now() - window.curTime);
  });

  useEffect(() => {
    if (data.length) {
      const temp = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          render: (text, record) => {
            return <div>{text}</div>;
          },
        },
      ];

      Object.keys(data[0]).forEach((ele) => {
        if (ele.includes('key-')) {
          temp.push({
            title: ele,
            dataIndex: ele,
            key: ele,
            render: (text, record) => {
              return (
                <div className="status" data-status={record[ele]}>
                  {/* {text ? 'true' : 'false'} */}
                </div>
              );
            },
          });
        }
      });

      setColumns(temp);
    }
  }, [data]);

  return (
    <Modal
      destroyOnClose
      title="新建"
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <VirtualTable
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{
          y: 300,
          x: '100vw',
        }}
      />
    </Modal>
  );
};
export default forwardRef(DataTableVitualScroll);
