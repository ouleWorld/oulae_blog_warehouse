import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import Button from '../pages/Button';
import Layout from './Layout';

// 解析 RouteObject 对象，获取需要显示的路由信息
const parserRoutes = (routes: RouteObject[]) => {
  const result = [];

  // 使用深度优先遍历去遍历路由
  const routerObjectParserDFS = (routerObj, parentPath = '') => {
    const r = [];
    if (!routerObj.children || !routerObj.children.length) {
      // 这里需要兼容 index=true 的情况，不过我们可以使用 routerObj.path || parentPath 直接添加
      r.push(routerObj.path || parentPath);
    } else {
      // 如果存在 children 属性的话，则需要走递归逻辑
      routerObj.children.forEach((ele) => {
        r.push(...routerObjectParserDFS(ele, routerObj.path));
      });
    }

    return r;
  };

  routes.forEach((ele) => {
    result.push(...routerObjectParserDFS(ele));
  });

  return result;
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Button></Button>,
      },
    ],
  },
];

const routesList = parserRoutes(routes);

export { routes, routesList };
