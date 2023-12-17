import { BodyMask } from 'oulae_dumi_component_mobile';
import * as React from 'react';
import styles from './dialog.module.less';
const { useState } = React;

const dialog: React.FC = () => {
  const [visible, setvisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h4>
          ReactDOM.createPortal 也能解决滚动透传的问题，不过前提是 body
          元素是不能够滚动的
        </h4>
        <button
          type="button"
          onClick={() => {
            setvisible(true);
          }}
        >
          clike me
        </button>
      </div>
      <BodyMask
        visible={visible}
        style={{ color: 'blue' }}
        clickMaskCallback={() => {
          setvisible(false);
        }}
      >
        <div
          className={styles.container}
          onClick={() => {
            setvisible(false);
          }}
        >
          <div className={styles.maskContent}>Hello world!</div>
        </div>
      </BodyMask>
    </div>
  );
};

export default dialog;
