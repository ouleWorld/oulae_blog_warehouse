import React from 'react';
import { useNavigate } from 'react-router-dom'
import './page.scss'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className={'title'}>Page index</h1>
      <input type="text" />
      <button onClick={() => navigate('/hello')}>Next</button>
    </div>
  );
};
