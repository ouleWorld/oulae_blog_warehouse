import { Button, ConfigProvider } from 'antd';
import styles from './index.less';
// import 'antd/dist/antd.min.css';
import 'antd/dist/antd.variable.min.css';

export default function IndexPage() {
  const btnCallback = () => {
    ConfigProvider.config({
      theme: {
        primaryColor: '#25b864',
      },
    });
  };

  return (
    <div>
      <ConfigProvider>
        <h1 className={styles.title}>Page index</h1>
        <Button type="primary" onClick={btnCallback}>
          修改主题
        </Button>
      </ConfigProvider>
    </div>
  );
}
