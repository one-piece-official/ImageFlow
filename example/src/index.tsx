import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Content from './content'

import Head from './head';
import Footer from './footer';


const list = ['Morph', 'Soul', 'ColourDistance', 'CrossWrap', 'CrossZoom', 'Shake', 'Dreamy', 'Flyeye', 'GlitchDisplace', 'GlitchMemories', 'Hexagonalize', 'Luminance', 'Rag', 'Megrim', 'Pixlize', 'Flashing', 'Swirl'];
const whiteList = ['Shake', 'Soul', 'Megrim', 'Flashing', 'Rag'];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleIndex: -1,
      width: document.body.offsetWidth > 450 ? 450 : document.body.offsetWidth,
    }
  }

  render () {
    return (
      <div>
        <Head />
        <div className="title">
          <span className="primary">Effect</span>
          <span className="red">Features</span>
          <p style={{ fontSize: '17px', fontWeight: 700, }}>(Click the picture preview on the left)</p>
        </div>
        <div className="main">
          {
            list.map((type, idx) => {
              return (
                <div
                  key={type}
                  className="box"
                  onClick={() => this.setState({ visibleIndex: idx })}
                >
                  <Content
                    visible={idx === this.state.visibleIndex}
                    rotate={!whiteList.includes(type)}
                    type={type}
                    width={this.state.width}
                    url="https://csj5588.github.io/ImageFlow/bg.jpg"
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
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
