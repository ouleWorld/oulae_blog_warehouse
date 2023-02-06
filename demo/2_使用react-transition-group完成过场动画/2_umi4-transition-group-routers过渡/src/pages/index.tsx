import React from 'react';
import styles from './index.less';
import { history } from 'umi';
export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <input type="text" />
      <button onClick={() => history.push('/hello')}>Next</button>
    </div>
  );
};
