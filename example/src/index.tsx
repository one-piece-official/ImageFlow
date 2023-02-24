import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Content from './content'

import Head from './head';
import Footer from './footer';


const list = ['ColourDistance', 'CrossWrap', 'CrossZoom', 'Shake', 'Dreamy', 'Flyeye', 'GlitchDisplace', 'GlitchMemories', 'Hexagonalize', 'Soul', 'Luminance', 'Rag', 'Megrim', 'Morph', 'Pixlize', 'Flashing', 'Swirl'];
const whiteList = ['Shake', 'Soul', 'Megrim', 'Flashing', 'Rag'];
class App extends React.Component {
  state = {
    visibleIndex: -1,
  }

  render () {
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
                  onClick={() => this.setState({ visibleIndex: idx })}
                >
                  <Content
                    visible={idx === this.state.visibleIndex}
                    rotate={!whiteList.includes(type)}
                    type={type}
                    url="https://one-piece-official.github.io/ImageFlow/bg.jpg"
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