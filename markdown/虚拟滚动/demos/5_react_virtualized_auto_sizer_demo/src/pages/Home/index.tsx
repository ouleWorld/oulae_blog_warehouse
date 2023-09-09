import { PageContainer } from '@ant-design/pro-components';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './index.less';

const ComTest = (props: any) => {
  console.log('ComTest: ', props);
  const { width, height } = props;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'red',
      }}
    >
      hello world!
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <AutoSizer>
          {({ height, width }) => {
            // Use these actual sizes to calculate your percentage based sizes
            return <ComTest width={width} height={height}></ComTest>;
          }}
        </AutoSizer>
      </div>
    </PageContainer>
  );
};

export default HomePage;
