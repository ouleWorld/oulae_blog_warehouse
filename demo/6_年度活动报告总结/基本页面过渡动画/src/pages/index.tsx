import React, { useEffect, useState } from 'react';
import './index.less';
import Slide1 from './transition/slide1';
import Slide2 from './transition/slide2';
import Slide3 from './transition/slide3';

export const SlideContext = React.createContext({});

export default function App() {
  const [curIndex, setcurIndex] = useState(0);
  const [canClick, setCanClick] = useState(true);

  useEffect(() => {
    // 图片内容的预加载
    const img1 = new Image();
    img1.src =
      'https://cn.bing.com/th?id=OHR.Godafoss_ZH-CN9460037606_1366x768.jpg';

    const img2 = new Image();
    img2.src =
      'https://cn.bing.com/th?id=OHR.SwedishAntenna_ZH-CN9163420082_1366x768.jpg';

    const img3 = new Image();
    img3.src =
      'https://cn.bing.com/th?id=OHR.NZTekapo_ZH-CN6919300257_1366x768.jpg';
  }, []);

  return (
    <div className="container">
      <SlideContext.Provider
        value={{
          canClickWithTrue: () => {
            setCanClick(true);
          },
          canClickWithFalse: () => {
            setCanClick(false);
          },
        }}
      >
        <Slide1 inValue={curIndex === 0}></Slide1>
        <Slide2 inValue={curIndex === 1}></Slide2>
        <Slide3 inValue={curIndex === 2}></Slide3>
      </SlideContext.Provider>

      <button
        onClick={() => {
          setcurIndex((curIndex) => {
            return curIndex + 1;
          });
          // 执行动画期间，不允许点击上一页下一页
          setCanClick(false);
        }}
        disabled={!canClick || curIndex === 2}
      >
        next
      </button>
      <button
        onClick={() => {
          setcurIndex((curIndex) => {
            return curIndex - 1;
          });
          // 执行动画期间，不允许点击上一页下一页
          setCanClick(false);
        }}
        disabled={!canClick || curIndex === 0}
      >
        back
      </button>
    </div>
  );
}
