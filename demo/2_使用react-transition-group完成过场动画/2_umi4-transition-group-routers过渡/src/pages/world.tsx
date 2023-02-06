import React from 'react';
import styles from './index.less';
import { history } from 'umi';

export default () => {
  return (
    <div>
      <h1 className={styles.title}>World</h1>
      <div> test something here</div>
      <button onClick={() => history.back()}>Go Back</button>
    </div>
  );
};
