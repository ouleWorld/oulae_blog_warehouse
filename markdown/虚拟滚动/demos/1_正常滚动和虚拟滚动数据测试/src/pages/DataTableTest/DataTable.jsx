import { Modal, Table } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { flushSync } from 'react-dom';
import { getDataFn } from './getData';

function DataTable(props, ref) {
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
    if (data.length) {
      const temp = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
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

  useEffect(() => {
    console.log('渲染消耗的时间为：', Date.now() - window.curTime);
  });

  return (
    <Modal
      destroyOnClose
      title="新建"
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <Table
        loading={loading}
        scroll={{ x: 'auto', y: 400 }}
        dataSource={data}
        columns={columns}
      />
    </Modal>
  );
}

export default forwardRef(DataTable);
