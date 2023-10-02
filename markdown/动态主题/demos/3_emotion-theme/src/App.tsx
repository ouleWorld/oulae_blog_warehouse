// import 'core-js/es/promise';
import { useRoutes } from 'react-router-dom';
import { routes } from './layouts/routes';

// 路由组件
const App = () => {
  // 添加promise代码
  const promise = Promise.resolve();
  promise.then(() => {
    const set = new Set(['foo', 'bar', 'baz', 'foo']);
    console.log('====> ', Array.from(set));
  });

  const element = useRoutes(routes);
  return element;
};

export default App;
