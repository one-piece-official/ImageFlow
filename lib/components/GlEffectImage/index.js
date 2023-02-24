'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Saturate = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _glReact = require('gl-react');

var _glReactDom = require('gl-react-dom');

var _transtions = require('./transtions');

var _transtions2 = _interopRequireDefault(_transtions);

var _uniforms2 = require('./uniforms');

var _uniforms3 = _interopRequireDefault(_uniforms2);

var _timeLoop = require('./timeLoop');

var _timeLoop2 = _interopRequireDefault(_timeLoop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name GL_Image_Effect
 * @description 图片特效组件
 */
var ALT_URL = '';

var shaders = _glReact.Shaders.create(_transtions2.default);

var Saturate = exports.Saturate = (0, _timeLoop2.default)(function (_ref) {
  var time = _ref.time,
      children = _ref.children,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'Soul' : _ref$type;

  var _shader = shaders[type];
  var _uniforms = _uniforms3.default[type](time, children);

  return _react2.default.createElement(_glReact.Node, {
    shader: _shader,
    uniforms: _uniforms
  });
});

function GlEffectImage(props) {
  var _props$width = props.width,
      width = _props$width === undefined ? 450 : _props$width,
      _props$height = props.height,
      height = _props$height === undefined ? 720 : _props$height,
      _props$url = props.url,
      url = _props$url === undefined ? ALT_URL : _props$url;

  return _react2.default.createElement(
    _glReactDom.Surface,
    { width: width, height: height },
    _react2.default.createElement(
      Saturate,
      props,
      url
    )
  );
}
exports.default = GlEffectImage;