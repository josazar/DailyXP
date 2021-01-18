//  from https://www.youtube.com/watch?v=2R7h76GoIJM

precision highp float;
uniform vec2 u_resolution;// Width and height of the shader
uniform float u_time;// Time elapsed
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.01// Surface Distance

float Hash21(vec2 p){
  p=fract(p*vec2(234.34,435.345));
  p+=dot(p,p+34.23);
  return fract(p.x*p.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float square(vec2 p, vec2 bl, vec2 tr) {
    // bottom-left
    vec2 bl_ = smoothstep( bl*0.99, bl,p);
    float pct = bl_.x * bl_.y;
    // top-right
     vec2 tr_ = smoothstep(tr*0.99,tr,1.0-p);
     pct *= tr_.x * tr_.y;
     return pct;
}

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main()
{
    vec2 uv = -.875 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    // uv*=rotate2d(-u_time*.5);
    // uv.x*=cos(u_time)*.5;
    uv*=1.5;
    vec3 blue = vec3(0.3176, 0.3961, 0.8275);
    vec3 blueDark = vec3(0.102, 0.1529, 0.3725);
    vec3 blueDarker = vec3(0.051, 0.0863, 0.2314);

    float pct = smoothstep(-1.96*abs(cos(u_time)),1., uv.x) - smoothstep(-.65,0.2+abs(sin(u_time*2.)+1.),uv.x);
    float pct2 = .0;
    float d = plot(uv, pct) + plot(uv, pct*.9);
    vec3 col = vec3(d)*blue;
    d+=  plot(uv, pct*.8);
    d+=  plot(uv, pct*.7);
    d+=  plot(uv, pct*.6);
    d+=  plot(uv, pct*1.1);
    d+=  plot(uv, pct*1.5);
    d+=  plot(uv, pct*1.25);
    col += vec3(d)*blueDark;
    d+=  plot(uv, pct*.5);
    d+=  plot(uv, pct*.4);
    d+=  plot(uv, pct*.3);
    d+=  plot(uv, pct*.2);
    d+=  plot(uv, pct*.1);
    d+=  plot(uv, pct*.0);
    d+=  plot(uv, pct*-.1);
    d+=  plot(uv, pct*-.2);
    d+=  plot(uv, pct*-.3);
    d+=  plot(uv, pct*-.4);
    d+=  plot(uv, pct*-.5);
    d+=  plot(uv, pct*1.75);
    d+=  plot(uv, pct*2.);
    d+=  plot(uv, pct*2.25);
    col += vec3(d)*blueDarker;

    gl_FragColor = vec4(col,1.0);
}
