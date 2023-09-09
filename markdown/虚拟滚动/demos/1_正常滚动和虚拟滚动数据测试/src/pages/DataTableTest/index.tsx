import { Button } from 'antd';
import React, { useRef } from 'react';
import DataTable from './DataTable';
import DataTableVitualScroll from './DataTableVitualScroll';
import DataTableVitualScrollV2 from './DataTableVitualScrollV2';

const CreateForm: React.FC = (props) => {
  const $dataTable = useRef(null);
  const $dataTableVitualScroll = useRef(null);
  const $dataTableVitualScrollV2 = useRef(null);

  return (
    <>
      <p>如果需要数据修改，请修改 getData.js 中的数据</p>
      <Button
        onClick={() => {
          window.curTime = Date.now();
          $dataTable?.current?.show();
        }}
      >
        打开普通弹窗
      </Button>
      <Button
        onClick={() => {
          window.curTime = Date.now();
          $dataTableVitualScrollV2?.current?.show();
        }}
      >
        打开虚拟滚动弹窗
      </Button>

      <DataTable ref={$dataTable}></DataTable>
      <DataTableVitualScroll
        ref={$dataTableVitualScroll}
      ></DataTableVitualScroll>
      <DataTableVitualScrollV2
        ref={$dataTableVitualScrollV2}
      ></DataTableVitualScrollV2>
    </>
  );
};

export default CreateForm;
