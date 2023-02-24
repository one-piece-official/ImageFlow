const uniformsConfigs = {
  ColourDistance: (time, children) => ({
    from: children,
    to: children,
    Time: time / 400,
    ratio: 2.0,
    _fromR: 2.0,
    _toR: 2.2,
    power: 5.0
  }),
  CrossWrap: (time, children) => ({
    from: children,
    to: children,
    Time: time / 700,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
  }),
  CrossZoom: (time, children) => ({
    from: children,
    to: children,
    Time: time / 700,
    amplitude: 1.0,
    waves: 1.0,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    strength: 0.3
  }),
  Shake: (time, children) => ({
    Texture: children,
    Time: time / 700
  }),
  Dreamy: (time, children) => ({
    from: children,
    to: children,
    Time: time / 700,
    amplitude: 1.0,
    waves: 1.0,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    strength: 0.3
  }),
  Flyeye: (time, children) => ({
    from: children,
    to: children,
    Time: time / 1000,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    steps: 80,
    horizontalHexagons: 20.0
  }),
  GlitchDisplace: (time, children) => ({
    from: children,
    to: children,
    Time: time / 1000,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
  }),
  GlitchMemories: (time, children) => ({
    from: children,
    to: children,
    Time: time / 700,
    amplitude: 1.0,
    waves: 1.0,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    colorSeparation: 0.3
  }),
  Hexagonalize: (time, children) => ({
    from: children,
    to: children,
    Time: time / 1000,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    steps: 80,
    horizontalHexagons: 20.0
  }),
  Soul: (time, children) => ({
    Texture: children,
    Time: time / 2000
  }),
  Luminance: (time, children) => ({
    from: children,
    to: children,
    Time: time / 100,
    amplitude: 1.0,
    waves: 1.0,
    ratio: 3.1,
    _fromR: 3.2,
    _toR: 3.4,
    colorSeparation: 0.3
  }),
  Rag: (time, children) => ({
    Texture: children,
    Time: time / 2000
  }),
  Megrim: (time, children) => ({
    Texture: children,
    Time: time / 700
  }),
  Morph: (time, children) => ({
    from: children,
    to: children,
    Time: time / 400,
    ratio: 2.0,
    _fromR: 2.0,
    _toR: 2.2,
    strength: 0.1
  }),
  Pixlize: (time, children) => ({
    from: children,
    to: children,
    Time: time / 2000,
    ratio: 1.0,
    _fromR: 1.,
    _toR: 1.,
    steps: 80,
  }),
  Flashing: (time, children) => ({
    Texture: children,
    Time: time / 2000
  }),
  Swirl: (time, children) => ({
    from: children,
    to: children,
    Time: time / 400,
    ratio: 2.0,
    _fromR: 2.0,
    _toR: 2.2,
  }),
}

export default uniformsConfigs;
