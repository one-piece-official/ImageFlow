import * as React from 'react';
import './index.less'

const Head = () => {
  return (
    <div className="head-root">
      <h1 className='title'>Welcome to Image Flow</h1>
      <p className='describe'>image-flow is a solution to solve the dynamic effect of pictures by <span className="text-red">OpenGL ES</span></p>
    </div>
  );
};

export default Head;
