/**
 * @name GL_Image_Effect
 * @description 图片特效组件
 */
import React from 'react';
import { Shaders, Node } from 'gl-react';
import { Surface } from 'gl-react-dom';
import shaderConfigs from './transtions';
import uniformsConfigs from './uniforms';
import timeLoop from "./timeLoop";

const ALT_URL = 'https://animagus.oss-cn-shanghai.aliyuncs.com/exampledir/aigc/32.jpg';

const shaders = Shaders.create(shaderConfigs);

export const Saturate = timeLoop(({
  time,
  children,
  type = 'Soul'
}) => {
  const _shader = shaders[type];
  const _uniforms = uniformsConfigs[type](time, children);

  return (
    <Node
      shader={_shader}
      uniforms={_uniforms}
    />
  )
});

function GlEffectImage(props) {
  const {
    width = 450,
    height = 720,
    url = ALT_URL
  } = props;
  return (
    <Surface width={width} height={height}>
      <Saturate {...props}>
        {url}
      </Saturate>
    </Surface>
  )
}
export default GlEffectImage
