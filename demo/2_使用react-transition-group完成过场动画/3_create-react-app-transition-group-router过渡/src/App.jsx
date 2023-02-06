import React from 'react';
import { createRef } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigationType,
  useLocation,
  useOutlet,
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './home';
import Hello from './hello';
import World from './world';

// 页面的路由信息
const routes = [
  { path: '/', name: 'Home', element: <Home />, nodeRef: createRef() },
  { path: '/hello', name: 'hello', element: <Hello />, nodeRef: createRef() },
  {
    path: '/world',
    name: 'word',
    element: <World />,
    nodeRef: createRef(),
  },
]

function RouteComponent() {
  // 当前路由的 location 信息
  const location = useLocation()
  // 当前的路由的需要渲染的子组件内容
  const currentOutlet = useOutlet()
  // 用户通过什么方式到达当前页面的
  const navgationType = useNavigationType()
  const { nodeRef } =
    routes.find((route) => route.path === location.pathname) ?? {}

  return (
    <>
      <TransitionGroup childFactory={(child) => {
        return React.cloneElement(child, {
          classNames: navgationType === 'PUSH' ? 'forward' : 'back',
        })
      }}>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={1000}
          // classNames={navgationType === 'PUSH' ? 'forward' : 'back'}
          unmountOnExit
        >
          {(state) => (
            <div
              ref={nodeRef}
            // className={navgationType === 'PUSH' ? 'forward' : 'back'}
            >
              {currentOutlet}
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RouteComponent />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App;
