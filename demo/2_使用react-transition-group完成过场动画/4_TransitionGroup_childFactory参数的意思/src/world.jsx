import React from 'react';
import { useNavigate } from 'react-router-dom'
import './page.scss'

export default () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className={'title'}>World</h1>
      <div> test something here</div>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};
