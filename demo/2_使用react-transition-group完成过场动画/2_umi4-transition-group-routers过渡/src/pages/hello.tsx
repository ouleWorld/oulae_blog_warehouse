import React from 'react';
import styles from './index.less';
import { history } from 'umi';

export default () => {
  return (
    <div>
      <h1 className={styles.title}>Hello</h1>
      <button onClick={() => history.push('/world')}>Next</button>
      <button onClick={() => history.back()}>Back</button>
    </div>
  );
};
