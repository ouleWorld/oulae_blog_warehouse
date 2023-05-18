import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { SlideContext } from '../index';
import style from './slide2.module.less';
const { useContext } = React;

const Slide1 = (props: { inValue: boolean }) => {
  const { canClickWithTrue } = useContext(SlideContext) as any;
  const { inValue } = props;

  return (
    <CSSTransition
      in={inValue}
      appear={true}
      unmountOnExit={true}
      timeout={4000}
      classNames={`transition-group-opacity`}
      onEntered={() => {
        canClickWithTrue();
      }}
      onExited={() => {
        canClickWithTrue();
      }}
    >
      <div className={style.content}>silide</div>
    </CSSTransition>
  );
};

export default Slide1;
