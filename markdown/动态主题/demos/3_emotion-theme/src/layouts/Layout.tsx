import * as React from 'react';
const { useState } = React;
import { Outlet, Link } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import styles from './Layout.module.less';
import { routesList } from './routes';

// 布局组件
const Layout = () => {
  const [theme, setTheme] = useState({
    colors: {
      primary: 'red',
    },
  });

  const btnFn = () => {
    setTheme({
      colors: {
        primary: 'blue',
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles['layout-container']}>
        <button onClick={btnFn}>change theme</button>
        <nav>
          {routesList.map((ele) => (
            <div
              className={styles['btn']}
              key={ele}
            >
              <Link to={ele}>{ele}</Link>
            </div>
          ))}
        </nav>

        <hr />

        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
