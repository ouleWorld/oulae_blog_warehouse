import React from 'react';

interface IStickyContainerProps {
  height?: number;
  [key: string]: any;
}

/**
 * 获取 cell 的位置信息 (column, row)
 * @param {*} child
 * @returns
 */
export function getCellIndicies(child: any) {
  return {
    row: child.props.rowIndex,
    column: child.props.columnIndex,
  };
}

/**
 * 获取虚拟滚动中渲染 data 中数据的下标
 * @param {*} children
 * @returns
 */
export function getShownIndicies(children: any) {
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minColumn = Infinity;
  let maxColumn = -Infinity;

  React.Children.forEach(children, (child) => {
    const { row, column } = getCellIndicies(child);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minColumn = Math.min(minColumn, column);
    maxColumn = Math.max(maxColumn, column);
  });

  return {
    from: {
      row: minRow,
      column: minColumn,
    },
    to: {
      row: maxRow,
      column: maxColumn,
    },
  };
}

/**
 * fixed container - 左上
 * @param {*} props
 * @returns
 */
export function StickyContainerTopLeft(props: IStickyContainerProps) {
  return <div className="containerTopLeft">{props.children}</div>;
}

/**
 * fixed container - 右上
 * @param {*} props
 * @returns
 */
export function StickyContainerTopRight(props: IStickyContainerProps) {
  return <div className="containerTopRight">{props.children}</div>;
}

/**
 * fixed container - 上
 * @param {*} props
 * @returns
 */
export function StickyContainerTop(props: IStickyContainerProps) {
  const { height } = props;
  return (
    <div className="containerTop" style={{ height }}>
      {props.children}
    </div>
  );
}

/**
 *  fixed container - 左
 * @param {*} props
 * @returns
 */
export function StickyContainerLeft(props: IStickyContainerProps) {
  const { height } = props;
  return (
    <div className="containerLeft" style={{ height }}>
      {props.children}
    </div>
  );
}

/**
 *  fixed container - 右
 * @param {*} props
 * @returns
 */
export function StickyContainerRight(props: IStickyContainerProps) {
  const { height } = props;
  return (
    <div className="containerRight" style={{ height }}>
      {props.children}
    </div>
  );
}

/**
 *  fixed container - 下
 * @param {*} props
 * @returns
 */
export function StickyContainerBottom(props: IStickyContainerProps) {
  const { height } = props;
  return (
    <div className="containerBottom" style={{ height }}>
      {props.children}
    </div>
  );
}

/**
 * fixed container - 左下
 * @param {*} props
 * @returns
 */
export function StickyContainerBottomLeft(props: IStickyContainerProps) {
  return <div className="containerBottomLeft">{props.children}</div>;
}

/**
 * fixed container - 右下
 * @param {*} props
 * @returns
 */
export function StickyContainerBottomRight(props: IStickyContainerProps) {
  return <div className="containerBottomRight">{props.children}</div>;
}
