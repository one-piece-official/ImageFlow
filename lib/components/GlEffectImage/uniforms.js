"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var uniformsConfigs = {
  ColourDistance: function ColourDistance(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 400,
      ratio: 2.0,
      _fromR: 2.0,
      _toR: 2.2,
      power: 5.0
    };
  },
  CrossWrap: function CrossWrap(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 700,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.
    };
  },
  CrossZoom: function CrossZoom(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 700,
      amplitude: 1.0,
      waves: 1.0,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      strength: 0.3
    };
  },
  Shake: function Shake(time, children) {
    return {
      Texture: children,
      Time: time / 700
    };
  },
  Dreamy: function Dreamy(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 700,
      amplitude: 1.0,
      waves: 1.0,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      strength: 0.3
    };
  },
  Flyeye: function Flyeye(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 1000,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      steps: 80,
      horizontalHexagons: 20.0
    };
  },
  GlitchDisplace: function GlitchDisplace(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 1000,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.
    };
  },
  GlitchMemories: function GlitchMemories(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 700,
      amplitude: 1.0,
      waves: 1.0,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      colorSeparation: 0.3
    };
  },
  Hexagonalize: function Hexagonalize(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 1000,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      steps: 80,
      horizontalHexagons: 20.0
    };
  },
  Soul: function Soul(time, children) {
    return {
      Texture: children,
      Time: time / 2000
    };
  },
  Luminance: function Luminance(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 100,
      amplitude: 1.0,
      waves: 1.0,
      ratio: 3.1,
      _fromR: 3.2,
      _toR: 3.4,
      colorSeparation: 0.3
    };
  },
  Rag: function Rag(time, children) {
    return {
      Texture: children,
      Time: time / 2000
    };
  },
  Megrim: function Megrim(time, children) {
    return {
      Texture: children,
      Time: time / 700
    };
  },
  Morph: function Morph(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 400,
      ratio: 2.0,
      _fromR: 2.0,
      _toR: 2.2,
      strength: 0.1
    };
  },
  Pixlize: function Pixlize(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 2000,
      ratio: 1.0,
      _fromR: 1.,
      _toR: 1.,
      steps: 80
    };
  },
  Flashing: function Flashing(time, children) {
    return {
      Texture: children,
      Time: time / 2000
    };
  },
  Swirl: function Swirl(time, children) {
    return {
      from: children,
      to: children,
      Time: time / 400,
      ratio: 2.0,
      _fromR: 2.0,
      _toR: 2.2
    };
  }
};

exports.default = uniformsConfigs;