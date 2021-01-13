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
    vec3 blue = vec3(0.3098, 0.3804, 0.7725);
    float pct = smoothstep(-1.,1., uv.x) - smoothstep(-.5,0.2+abs(cos(u_time*2.)+1.),uv.x);

    uv*=rotate2d(-u_time*.5);
    float sq = square(uv+.95*pct, vec2(.20,.01),vec2(.5,.6));
    uv*=rotate2d(-u_time*.5);

    float sq1 = square(uv+.75*pct, vec2(.20,.01),vec2(.5,.6));
    uv*=rotate2d(-u_time*.5);

    float sq2 = square(uv+.45*pct, vec2(.20,.01),vec2(.5,.6));
    uv*=rotate2d(-u_time*.5);
    float sq3 = square(uv+.25*pct, vec2(.20,.01),vec2(.5,.6));
    uv*=rotate2d(-u_time*.5);
    float sq4 = square(uv+.05*pct, vec2(.20,.01),vec2(.5,.6));
    uv*=rotate2d(-u_time*.5);


    float d = plot(uv, pct);
    vec3 col = vec3(1.)*blue;
    // col +=abs(pct)+0.01;
    col += sq*0.75 + sq1*.5+sq2*.5+sq3*.35+sq4*0.15;

    gl_FragColor = vec4(col,1.0);
}
