import { GLSL } from 'gl-react';

const shaderConfigs = {
  ColourDistance: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 2.;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      uniform float power; // = 5.0

      vec4 transition(vec2 p) {
        vec4 fTex = getFromColor(p);
        vec4 tTex = getToColor(p);
        float m = step(distance(fTex, tTex), progress);
        return mix(
          mix(fTex, tTex, m),
          tTex,
          pow(progress, power)
        );
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  CrossWrap: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 1.;
      float progress = abs(sin(Time)) / duration;
      // float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      vec4 transition(vec2 p) {
        float x = progress;
        x=smoothstep(.0,1.0,(x*2.0+p.x-1.0));
        return mix(getFromColor((p-.5)*(1.-x)+.5), getToColor((p-.5)*x+.5), x);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  CrossZoom: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = abs(sin(Time)) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      uniform float strength; // = 0.4

      const float PI = 3.141592653589793;

      float Linear_ease(in float begin, in float change, in float duration, in float time) {
        return change * time / duration + begin;
      }

      float Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {
        if (time == 0.0)
          return begin;
        else if (time == duration)
          return begin + change;
        time = time / (duration / 2.0);
        if (time < 1.0)
          return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
        return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
      }

      float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {
        return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
      }

      float rand (vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      vec3 crossFade(in vec2 uv, in float dissolve) {
        return mix(getFromColor(uv).rgb, getToColor(uv).rgb, dissolve);
      }

      vec4 transition(vec2 uv) {
        vec2 texCoord = uv.xy / vec2(1.0).xy;

        // Linear interpolate center across center half of the image
        vec2 center = vec2(Linear_ease(0.25, 0.5, 1.0, progress), 0.5);
        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);

        // Mirrored sinusoidal loop. 0->strength then strength->0
        float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);

        vec3 color = vec3(0.0);
        float total = 0.0;
        vec2 toCenter = center - texCoord;

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = rand(uv);

        for (float t = 0.0; t <= 40.0; t++) {
            float percent = (t + offset) / 40.0;
            float weight = 4.0 * (percent - percent * percent);
            color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;
            total += weight;
        }
        return vec4(color / total, 1.0);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Shake: {
    frag: GLSL`
      precision highp float;
      uniform sampler2D Texture;
      varying vec2 uv;
      uniform float Time;

      void main (void) {
        float duration = 0.7;
        float maxScale = 1.1;
        float offset = 0.02;

        float progress = mod(Time, duration) / duration;
        vec2 offsetCoords = vec2(offset, offset) * progress;
        float scale = 1.0 + (maxScale - 1.0) * progress;

        vec2 ScaleTextureCoords = vec2(0.5, 0.5) + (uv - vec2(0.5, 0.5)) / scale;

        vec4 maskR = texture2D(Texture, ScaleTextureCoords + offsetCoords);
        vec4 maskB = texture2D(Texture, ScaleTextureCoords - offsetCoords);
        vec4 mask = texture2D(Texture, ScaleTextureCoords);

        gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
      }
  ` },
  Dreamy: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 1.;
      float progress = abs(sin(Time)) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.), min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.), min(_fromR/_toR,1.)));
      }

      vec2 offset(float progress, float x, float theta) {
        float phase = progress*progress + progress + theta;
        float shifty = 0.03*progress*cos(10.0*(progress+x));
        return vec2(0, shifty);
      }
      vec4 transition(vec2 p) {
        return mix(getFromColor(p + offset(progress, p.x, 0.0)), getToColor(p + offset(1.0-progress, p.x, 3.14)), progress);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Flyeye: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      const float size = 0.04;
      const float zoom  = 50.0;
      const float colorSeparation = 0.3;

      vec4 transition(vec2 p) {
        float inv = 1. - progress;
        vec2 disp = size*vec2(cos(zoom*p.x), sin(zoom*p.y));
        vec4 texTo = getToColor(p + inv*disp);
        vec4 texFrom = vec4(
          getFromColor(p + progress*disp*(1.0 - colorSeparation)).r,
          getFromColor(p + progress*disp).g,
          getFromColor(p + progress*disp*(1.0 + colorSeparation)).b,
          1.0);
        return texTo*progress + texFrom*inv;
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  GlitchDisplace: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      highp float random(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
      }
      float voronoi( in vec2 x ) {
        vec2 p = floor( x );
        vec2 f = fract( x );
        float res = 8.0;
        for(float j=-1.; j<=1.; j++)
        for(float i=-1.; i<=1.; i++) {
          vec2  b = vec2( i, j );
          vec2  r = b - f + random( p + b );
          float d = dot( r, r );
          res = min( res, d );
        }
        return sqrt( res );
      }

      vec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {
        float b = voronoi(.003 * texCoord + 2.0);
        float g = voronoi(0.2 * texCoord);
        float r = voronoi(texCoord - 1.0);
        vec4 dt = tex * 1.0;
        vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;

        dis.x = dis.x - 1.0 + textureDepth*dotDepth;
        dis.y = dis.y - 1.0 + textureDepth*dotDepth;
        dis.x *= strength;
        dis.y *= strength;
        vec2 res_uv = texCoord ;
        res_uv.x = res_uv.x + dis.x - 0.0;
        res_uv.y = res_uv.y + dis.y;
        return res_uv;
      }

      float ease1(float t) {
        return t == 0.0 || t == 1.0
          ? t
          : t < 0.5
            ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
            : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
      }
      float ease2(float t) {
        return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
      }

      vec4 transition(vec2 uv) {
        vec2 p = uv.xy / vec2(1.0).xy;
        vec4 color1 = getFromColor(p);
        vec4 color2 = getToColor(p);
        vec2 disp = displace(color1, p, 0.33, 0.7, 1.0-ease1(progress));
        vec2 disp2 = displace(color2, p, 0.33, 0.5, ease2(progress));
        vec4 dColor1 = getToColor(disp);
        vec4 dColor2 = getFromColor(disp2);
        float val = ease1(progress);
        vec3 gray = vec3(dot(min(dColor2, dColor1).rgb, vec3(0.299, 0.587, 0.114)));
        dColor2 = vec4(gray, 1.0);
        dColor2 *= 2.0;
        color1 = mix(color1, dColor2, smoothstep(0.0, 0.5, progress));
        color2 = mix(color2, dColor1, smoothstep(1.0, 0.5, progress));
        return mix(color1, color2, val);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  GlitchMemories: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = abs(sin(Time)) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      vec4 transition(vec2 p) {
        vec2 block = floor(p.xy / vec2(16));
        vec2 uv_noise = block / vec2(64);
        uv_noise += floor(vec2(progress) * vec2(1200.0, 3500.0)) / vec2(64);
        vec2 dist = progress > 0.0 ? (fract(uv_noise) - 0.5) * 0.3 *(1.0 -progress) : vec2(0.0);
        vec2 red = p + dist * 0.2;
        vec2 green = p + dist * .3;
        vec2 blue = p + dist * .5;
      
        return vec4(mix(getFromColor(red), getToColor(red), progress).r,mix(getFromColor(green), getToColor(green), progress).g,mix(getFromColor(blue), getToColor(blue), progress).b,1.0);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Hexagonalize: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 1.;
      float progress = abs(sin(Time)) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      uniform int steps;
      uniform float horizontalHexagons;

      struct Hexagon {
        float q;
        float r;
        float s;
      };

      Hexagon createHexagon(float q, float r){
        Hexagon hex;
        hex.q = q;
        hex.r = r;
        hex.s = -q - r;
        return hex;
      }

      Hexagon roundHexagon(Hexagon hex){
        float q = floor(hex.q + 0.5);
        float r = floor(hex.r + 0.5);
        float s = floor(hex.s + 0.5);
        float deltaQ = abs(q - hex.q);
        float deltaR = abs(r - hex.r);
        float deltaS = abs(s - hex.s);
        if (deltaQ > deltaR && deltaQ > deltaS)
          q = -r - s;
        else if (deltaR > deltaS)
          r = -q - s;
        else
          s = -q - r;
        return createHexagon(q, r);
      }

      Hexagon hexagonFromPoint(vec2 point, float size) {
        point.y /= ratio;
        point = (point - 0.5) / size;
        float q = (sqrt(3.0) / 3.0) * point.x + (-1.0 / 3.0) * point.y;
        float r = 0.0 * point.x + 2.0 / 3.0 * point.y;
        Hexagon hex = createHexagon(q, r);
        return roundHexagon(hex);
      }

      vec2 pointFromHexagon(Hexagon hex, float size) {
        float x = (sqrt(3.0) * hex.q + (sqrt(3.0) / 2.0) * hex.r) * size + 0.5;
        float y = (0.0 * hex.q + (3.0 / 2.0) * hex.r) * size + 0.5;
        return vec2(x, y * ratio);
      }

      vec4 transition (vec2 uv) {
        float dist = 2.0 * min(progress, 1.0 - progress);
        dist = steps > 0 ? ceil(dist * float(steps)) / float(steps) : dist;
        float size = (sqrt(3.0) / 3.0) * dist / horizontalHexagons;
        vec2 point = dist > 0.0 ? pointFromHexagon(hexagonFromPoint(uv, size), size) : uv;
        return mix(getFromColor(point), getToColor(point), progress);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Soul: {
    frag: GLSL`
      precision highp float;
      uniform sampler2D Texture;
      varying vec2 uv;
      uniform float Time;
      
      void main (void) {
        float duration = 0.7;
        float maxAlpha = 0.8;
        float maxScale = 1.1;
        
        float progress = mod(Time, duration) / duration;
        float alpha = maxAlpha * (1.0 - progress);
        float scale = 1.0 + (maxScale - 1.0) * progress;

        float weakX = 0.5 + (uv.x - 0.5) / scale;
        float weakY = 0.5 + (uv.y - 0.5) / scale;

        vec2 weakTextureCoords = vec2(weakX, weakY);

        vec4 weakMask = texture2D(Texture, weakTextureCoords);
       
        vec4 mask = texture2D(Texture, uv);
        
        gl_FragColor = mask * (1.0 - alpha) + weakMask * alpha;
      }
  ` },
  Luminance: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = abs(sin(Time)) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      uniform bool direction; // = 1 
      uniform float l_threshold; // = 0.8 
      uniform bool above; // = false 

      float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec3 permute(vec3 x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0

        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        vec2 i1;

        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float luminance(vec4 color) {
        return color.r*0.299+color.g*0.587+color.b*0.114;
      }

      vec2 center = vec2(1.0, direction);

      vec4 transition(vec2 uv) {
        vec2 p = uv.xy / vec2(1.0).xy;
        if (progress == 0.0) {
          return getFromColor(p);
        } else if (progress == 1.0) {
          return getToColor(p);
        } else {
          float x = progress;
          float dist = distance(center, p)- progress*exp(snoise(vec2(p.x, 0.0)));
          float r = x - rand(vec2(p.x, 0.1));
          float m;
          if(above){
          m = dist <= r && luminance(getFromColor(p))>l_threshold ? 1.0 : (progress*progress*progress);
          }
          else{
          m = dist <= r && luminance(getFromColor(p))<l_threshold ? 1.0 : (progress*progress*progress);  
          }
          return mix(getFromColor(p), getToColor(p), m);    
        }
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Megrim: {
    frag: GLSL`
      precision highp float;
      uniform sampler2D Texture;
      varying vec2 uv;
      
      uniform float Time;
      
      const float PI = 3.1415926;
      const float duration = 2.0;
      
      vec4 getMask(float time, vec2 textureCoords, float padding) {
        vec2 translation = vec2(sin(time * (PI * 2.0 / duration)),cos(time * (PI * 2.0 / duration)));
        vec2 translationTextureCoords = textureCoords + padding * translation;
        vec4 mask = texture2D(Texture, translationTextureCoords);
        return mask;
      }

      float maskAlphaProgress(float currentTime, float hideTime, float startTime) {
        float time = mod(duration + currentTime - startTime, duration);
        return min(time, hideTime);
      }
      
      void main(){
        float time = mod(Time, duration);
        float scale = 1.2;
        float padding = 0.5 * (1.0 - 1.0 / scale);
        vec2 textureCoords = vec2(0.5, 0.5) + (uv - vec2(0.5, 0.5)) / scale;
    
        float hideTime = 0.9;
        float timeGap = 0.2;
    
        float maxAlphaR = 0.5;
        float maxAlphaG = 0.05;
        float maxAlphaB = 0.05;

        vec4 mask = getMask(time, textureCoords, padding);
        float alphaR = 1.0;
        float alphaG = 1.0;
        float alphaB = 1.0;
    
        vec4 resultMask = vec4(0, 0, 0, 0);
    
        for (float f = 0.0; f < 2.0; f += 0.2) {
          float tmpTime = f;
          vec4 tmpMask = getMask(tmpTime, textureCoords, padding);
  
          float tmpAlphaR = maxAlphaR - maxAlphaR * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;
          float tmpAlphaG = maxAlphaG - maxAlphaG * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;
          float tmpAlphaB = maxAlphaB - maxAlphaB * maskAlphaProgress(time, hideTime, tmpTime) / hideTime;
  
          resultMask += vec4(tmpMask.r * tmpAlphaR,tmpMask.g * tmpAlphaG,tmpMask.b * tmpAlphaB,1.0);

          alphaR -= tmpAlphaR;
          alphaG -= tmpAlphaG;
          alphaB -= tmpAlphaB;
        }
    
        resultMask += vec4(mask.r * alphaR, mask.g * alphaG, mask.b * alphaB, 1.0);
    
        gl_FragColor = resultMask;
      }
  ` },
  Morph: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 2.;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      uniform float strength; // = 0.1

      vec4 transition(vec2 p) {
        vec4 ca = getFromColor(p);
        vec4 cb = getToColor(p);
        
        vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
        vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
        vec2 oc = mix(oa,ob,0.5)*strength;
        
        float w0 = progress;
        float w1 = 1.0-w0;
        return mix(getFromColor(p+oc*w0), getToColor(p-oc*w1), progress);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Pixlize: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 0.7;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      const ivec2 squaresMin = ivec2(20);
      const int steps = 50;

      float d = min(progress, 1.0 - progress);
      float dist = steps>0 ? ceil(d * float(steps)) / float(steps) : d;
      vec2 squareSize = 2.0 * dist / vec2(squaresMin);

      vec4 transition(vec2 uv) {
        vec2 p = dist>0.0 ? (floor(uv / squareSize) + 0.5) * squareSize : uv;
        return mix(getFromColor(p), getToColor(p), progress);
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Flashing: {
    frag: GLSL`
      precision highp float;
      uniform sampler2D Texture;
      varying vec2 uv;
      uniform float Time;

      void main (void) {
        float duration = 0.6;
        float time = mod(Time, duration);
        vec4 whiteMask = vec4(1.0, 1.0, 1.0, 1.0);
        float amplitude = abs(sin(time * (3.1516 / duration)));
        vec4 mask = texture2D(Texture, uv);
        
        gl_FragColor = mask * (1.0 - amplitude) + whiteMask * amplitude;
      }
  ` },
  Swirl: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D from, to;
      uniform float ratio, _fromR, _toR;
      uniform float Time;
      float duration = 8.;
      float progress = mod(Time, duration) / duration;

      vec4 getFromColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.);
        return texture2D(from, .5+(uv-.5)*vec2(min(ratio/_fromR, 1.),min(_fromR/ratio,1.)));
      }
      vec4 getToColor(vec2 uv) {
        uv = vec2(1., -1.) * uv + vec2(0., 1.); 
        return texture2D(to, .5+(uv-.5) * vec2(min(ratio/_toR,1.),min(_fromR/_toR,1.)));
      }

      vec4 transition(vec2 UV) {
        float Radius = 1.0;
        float T = progress;
        UV -= vec2( 0.5, 0.5 );
        float Dist = length(UV);

        if ( Dist < Radius ) {
          float Percent = (Radius - Dist) / Radius;
          float A = ( T <= 0.5 ) ? mix( 0.0, 1.0, T/0.5 ) : mix( 1.0, 0.0, (T-0.5)/0.5 );
          float Theta = Percent * Percent * A * 8.0 * 3.14159;
          float S = sin( Theta );
          float C = cos( Theta );
          UV = vec2( dot(UV, vec2(C, -S)), dot(UV, vec2(S, C)) );
        }
        UV += vec2( 0.5, 0.5 );

        vec4 C0 = getFromColor(UV);
        vec4 C1 = getToColor(UV);

        return mix( C0, C1, T );
      }
      
      void main() {
        gl_FragColor = transition(uv);
      }
  ` },
  Rag: {
    frag: GLSL`
      precision highp float;
      uniform sampler2D Texture;
      varying vec2 uv;
      uniform float Time;

      float rand(float n) {
        return fract(sin(n) * 43758.5453123);
      }
      
      void main (void) {
        float maxJitter = 0.06;
        float duration = 0.3;
        float colorROffset = 0.01;
        float colorBOffset = -0.025;
        
        float time = mod(Time, duration * 2.0);
        float amplitude = max(sin(time * (3.1415 / duration)), 0.0);
        
        float jitter = rand(uv.y) * 2.0 - 1.0;
        
        bool needOffset = abs(jitter) < maxJitter * amplitude;
        
        float textureX = uv.x + (needOffset ? jitter : (jitter * amplitude * 0.006));
        
        vec2 textureCoords = vec2(textureX, uv.y);
        vec4 mask = texture2D(Texture, textureCoords);
        vec4 maskR = texture2D(Texture, textureCoords + vec2(colorROffset * amplitude, 0.0));
        vec4 maskB = texture2D(Texture, textureCoords + vec2(colorBOffset * amplitude, 0.0));
        
        gl_FragColor = vec4(maskR.r, mask.g, maskB.b, mask.a);
      }
  ` }
}

export default shaderConfigs;