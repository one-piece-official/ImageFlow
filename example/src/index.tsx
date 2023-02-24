import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import Content from './content'

import Head from './head';
import Footer from './footer';

const App = () => {
  const list = ['ColourDistance', 'CrossWrap', 'CrossZoom', 'Shake', 'Dreamy', 'Flyeye', 'GlitchDisplace', 'GlitchMemories', 'Hexagonalize', 'Soul', 'Luminance', 'Rag', 'Megrim', 'Morph', 'Pixlize', 'Flashing', 'Swirl'];
  const whiteList = ['Shake', 'Soul', 'Megrim', 'Flashing', 'Rag'];
  const [visibleIndex, setvisibleIndex] = React.useState(-1);

  return (
    <div>
      <Head />
      <div className="title">
        <span className="primary">Effect</span>
        <span className="red">Features</span>
      </div>
      <div className="main">
        {
          list.map((type, idx) => {
            return (
              <div
                key={type}
                className="box"
                onClick={() => setvisibleIndex(idx)}
              >
                <Content
                  visible={idx === visibleIndex}
                  rotate={!whiteList.includes(type)}
                  type={type}
                  url="https://s1.ax1x.com/2023/02/23/pSxaBnJ.jpg"
                />
                <div className="describe">
                  <h1>{type}</h1>
                </div>
              </div>
            )
          })
        }
      </div>
      <Footer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
