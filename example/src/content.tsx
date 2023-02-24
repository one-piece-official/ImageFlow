import * as React from 'react';
import ImageFlow from './../../src/index'

const Dynamic = (props) => {
  return (
    <div style={{ position: 'relative' }}>
      {
        props.visible ? (
          <ImageFlow
            width={400}
            height={690}
            type={props.type}
            url={props.url}
          />
        ) : (
          <div style={{ width: '400px', height: '690px' }}></div>
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
        width={400}
        height={690}
        src="https://s1.ax1x.com/2023/02/23/pSxaBnJ.jpg"
        alt=""
      />
    </div>
  );
};

export default Dynamic
