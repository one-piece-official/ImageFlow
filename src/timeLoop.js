//@flow
import React, { PureComponent } from "react";
import raf from "raf";
import hoistNonReactStatics from "hoist-non-react-statics";

// NB this is only an utility for the examples
export default (C, { refreshRate = 60 } = {}
) => {
  class TL extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        time: 0,
        tick: 0,
      };
    }
    componentDidMount() {
      this.onPausedChange(this.props.paused);
    }
    componentWillReceiveProps({ paused }) {
      if (this.props.paused !== paused) {
        this.onPausedChange(paused);
      }
    }
    componentWillUnmount() {
      raf.cancel(this._r);
    }

    startLoop () {
      let startTime, lastTime;
      let interval = 1000 / refreshRate;
      lastTime = -interval;
      const loop = (t) => {
        this._r = raf(loop);
        if (!startTime) startTime = t;
        if (t - lastTime > interval) {
          lastTime = t;
          this.setState({
            time: t - startTime,
            tick: this.state.tick + 1,
          });
        }
      };
      this._r = raf(loop);
    };
    onPausedChange(paused) {
      if (paused) {
        raf.cancel(this._r);
      } else {
        this.startLoop();
      }
    };
    render() {
      return <C {...this.props} {...this.state} />;
    }
  }

  hoistNonReactStatics(TL, C);

  return TL;
};
