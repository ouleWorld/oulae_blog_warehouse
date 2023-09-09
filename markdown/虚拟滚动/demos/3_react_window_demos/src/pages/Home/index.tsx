import GridWithStickyCells from '@/components/GridWithStickyCells';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <GridWithStickyCells></GridWithStickyCells>
    </PageContainer>
  );
};

export default HomePage;
