"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _raf = require("raf");

var _raf2 = _interopRequireDefault(_raf);

var _hoistNonReactStatics = require("hoist-non-react-statics");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NB this is only an utility for the examples
exports.default = function (C) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$refreshRate = _ref.refreshRate,
      refreshRate = _ref$refreshRate === undefined ? 60 : _ref$refreshRate;

  var TL = function (_PureComponent) {
    _inherits(TL, _PureComponent);

    function TL(props) {
      _classCallCheck(this, TL);

      var _this = _possibleConstructorReturn(this, (TL.__proto__ || Object.getPrototypeOf(TL)).call(this, props));

      _this.state = {
        time: 0,
        tick: 0
      };
      return _this;
    }

    _createClass(TL, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.onPausedChange(this.props.paused);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(_ref2) {
        var paused = _ref2.paused;

        if (this.props.paused !== paused) {
          this.onPausedChange(paused);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _raf2.default.cancel(this._r);
      }
    }, {
      key: "startLoop",
      value: function startLoop() {
        var _this2 = this;

        var startTime = void 0,
            lastTime = void 0;
        var interval = 1000 / refreshRate;
        lastTime = -interval;
        var loop = function loop(t) {
          _this2._r = (0, _raf2.default)(loop);
          if (!startTime) startTime = t;
          if (t - lastTime > interval) {
            lastTime = t;
            _this2.setState({
              time: t - startTime,
              tick: _this2.state.tick + 1
            });
          }
        };
        this._r = (0, _raf2.default)(loop);
      }
    }, {
      key: "onPausedChange",
      value: function onPausedChange(paused) {
        if (paused) {
          _raf2.default.cancel(this._r);
        } else {
          this.startLoop();
        }
      }
    }, {
      key: "render",
      value: function render() {
        return _react2.default.createElement(C, _extends({}, this.props, this.state));
      }
    }]);

    return TL;
  }(_react.PureComponent);

  (0, _hoistNonReactStatics2.default)(TL, C);

  return TL;
};