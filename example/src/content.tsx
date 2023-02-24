import * as React from 'react';
import ImageFlow from './../../src/index'
import './index.less'

const Dynamic = (props) => {
  return (
    <div className='effectBox'>
      {
        props.visible ? (
          <ImageFlow
            width={props.width}
            height={props.width * 1.5}
            type={props.type}
            url={props.url}
          />
        ) : (
          <div style={{ width: `${props.width}px`, height: `${props.width * 1.5}px` }}></div>
        )
      }
      <img
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: props.visible ? 0 : 1,
          transform: `rotateX(${props.rotate ? 180 : 0}deg)`
        }}
        width={props.width}
        height={props.width * 1.5}
        src="https://s1.ax1x.com/2023/02/23/pSxaBnJ.jpg"
        alt=""
      />
    </div>
  );
};

export default Dynamic
