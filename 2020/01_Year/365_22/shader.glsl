
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float map(float n,float start1,float stop1,float start2,float stop2){
  return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
}

float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}

float random(float p){
  return fract(sin(p)*10000.);
}

float noise(vec2 p){
  return random(p.x+p.y*10000.);
}
float stepNoise(vec2 p){
  return noise(floor(p));
}

void main(){
  vec2 st=gl_FragCoord.xy/u_resolution.xy-.5;
  st.x*=u_resolution.x/u_resolution.y;
  vec2 m=u_mouse/u_resolution;
  m-=.5;
  
  float r=length(st);
  float a=atan(st.y,st.x);
  // kaleidoscope
  float sides=64.;
  float tau=2.*3.1416;
  a=mod(a,tau/sides);
  a=abs(a-tau/sides/2.);
  
  st=r*vec2(cos(a),sin(a));
  
  vec2 stAnim=(st+.25)*(m/.5)+.5;
  vec4 colorA=texture2D(u_texture_0,stAnim);
  gl_FragColor=colorA;
}
