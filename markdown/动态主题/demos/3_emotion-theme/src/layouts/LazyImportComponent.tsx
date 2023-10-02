import React, { LazyExoticComponent } from 'react';

export const LazyImportComponent = (props: {
  lazyChildren: LazyExoticComponent<() => React.FC>;
}) => {
  return (
    <React.Suspense fallback={<div>loading</div>}>
      {/* 居然还有这种写法，真的神奇 */}
      <props.lazyChildren />
    </React.Suspense>
  );
};
