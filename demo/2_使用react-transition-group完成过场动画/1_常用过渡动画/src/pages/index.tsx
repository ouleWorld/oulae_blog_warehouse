import React from 'react';
import { useState, useEffect, useRef, createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.less'

export default function App() {
  const [curIndex, setcurIndex] = useState(0);
  const [curOperator, setcurOperator] = useState('next');
  const [animate, setanimate] = useState('forward/back');
  const [items, setitems] = useState(() => [
    {
      text: 'test1',
      nodeRef: createRef(null),
    },
    {
      text: 'test2',
      nodeRef: createRef(null),
    },
    {
      text: 'test3',
      nodeRef: createRef(null),
    }
  ]);

  useEffect(() => {
    const img1 = new Image()
    img1.src = 'https://cn.bing.com/th?id=OHR.Godafoss_ZH-CN9460037606_1366x768.jpg'

    const img2 = new Image()
    img2.src = 'https://cn.bing.com/th?id=OHR.SwedishAntenna_ZH-CN9163420082_1366x768.jpg'

    const img3 = new Image()
    img3.src = 'https://cn.bing.com/th?id=OHR.NZTekapo_ZH-CN6919300257_1366x768.jpg'

  }, [])

  console.log('items: ', items);
  return (
    <div className='container' key={animate}>
      <TransitionGroup
        childFactory={(child) => {
          if (animate === 'forward/back') {
            return React.cloneElement(child, {
              classNames: curOperator === 'next' ? 'transition-group-forward' : 'transition-group-back',
            })
          } else {
            return React.cloneElement(child, {
              classNames: 'transition-group-opacity',
            })
          }

        }}>
        <CSSTransition
          key={items[curIndex].text}
          nodeRef={items[curIndex].nodeRef}
          timeout={4000}
        // classNames={'item'}
        >
          <div className='content' ref={items[curIndex].nodeRef} data-index={curIndex} >{items[curIndex].text}</div>
        </CSSTransition>
      </TransitionGroup>

      <button onClick={() => {
        setcurIndex((curIndex) => {
          return curIndex + 1
        })
        setcurOperator('next')
      }} disabled={curIndex === 2}>next</button>
      <button onClick={() => {
        setcurIndex((curIndex) => {
          return curIndex - 1
        })
        setcurOperator('back')
      }} disabled={curIndex === 0}>back</button>

      <div>
        当前动画效果：
        <select onChange={(e) => {
          console.log(e.target.value);
          setanimate(e.target.value)
        }}>
          <option value="forward/back">forward/back</option>
          <option value="opcity">opcity</option>
        </select>
      </div>
    </div>
  );
}