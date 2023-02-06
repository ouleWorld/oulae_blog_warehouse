import React from 'react';
import { Outlet, history, useLocation, useOutlet, withRouter } from 'umi';
import { TransitionGroup, CSSTransition, SwitchTransition } from 'react-transition-group';

function BasicLayout(props: any) {
  const qutlet = useOutlet();
  const location = useLocation();
  const currentOutlet = useOutlet()

  console.log('props: ', props);
  console.log('qutlet: ', qutlet);
  console.log('location: ', location);
  console.log('currentOutlet', currentOutlet)


  // Example using React-Transition-Group
  return (
    <TransitionGroup
      childFactory={(child: any) => {
        return React.cloneElement(child, {
          classNames: history.action === 'PUSH' ? 'forward' : 'back',
          location,
        })
      }}
    >
      <CSSTransition key={location.pathname} timeout={2000} unmountOnExit={true}>
        {/* { qutlet } */}
        {qutlet?.props?.children}
        {/* <Outlet /> */}
        {/* {currentOutlet} */}
      </CSSTransition>
    </TransitionGroup>
  );
}

export default withRouter(BasicLayout)
