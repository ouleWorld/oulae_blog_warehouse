import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: 'FixedSizeListDemo',
      path: '/FixedSizeListDemo',
      component: './ReactWindowDemo/FixedSizeListDemo',
    },
    {
      name: 'VariableSizeListDemo',
      path: '/VariableSizeListDemo',
      component: './ReactWindowDemo/VariableSizeListDemo',
    },
    {
      name: 'FixedSizeGridDemo',
      path: '/FixedSizeGridDemo',
      component: './ReactWindowDemo/FixedSizeGridDemo',
    },
    {
      name: 'IsScrollingDemo',
      path: '/IsScrollingDemo',
      component: './ReactWindowDemo/IsScrollingDemo',
    },
    {
      name: 'ScrollAimIndexDemo',
      path: '/ScrollAimIndexDemo',
      component: './ReactWindowDemo/ScrollAimIndexDemo',
    },
    {
      name: 'CommonTable',
      path: '/CommonTable',
      component: './ReactWindowDemo/CommonTable',
    },
    {
      name: 'FixedSizeListScrollDemo',
      path: '/FixedSizeListScrollDemo',
      component: './ReactWindowDemo/FixedSizeListScrollDemo',
    },
    {
      name: 'GridWithStickyCells',
      path: '/GridWithStickyCells',
      component: './ReactWindowDemo/GridWithStickyCells/index',
    },
  ],
  npmClient: 'npm',
});
