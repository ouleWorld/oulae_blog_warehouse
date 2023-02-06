import React from 'react';
import { useNavigate } from 'react-router-dom'
import './page.scss'

export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className={'title'}>Hello</h1>
      <button onClick={() => navigate('/world')}>Next</button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};
