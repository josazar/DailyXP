
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_2;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AA 2
#define PI 3.1415926

// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float hash(in float n)
{
  return fract(sin(n)*43758.5453);
}

mat2 rotate2d(float angle){
  return mat2(cos(angle),-sin(angle),
  sin(angle),cos(angle));
}
float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}
float lines(in vec2 pos,float b){
  float scale=10.;
  pos*=scale;
  return smoothstep(0.,.5+b*.5,abs((sin(pos.x*3.1415)+b*2.))*.5);
}
float spiral(vec2 m){
  float r=length(m*.5);
  float a=atan(m.y,m.x);
  float v=sin(100.*(sqrt(r)-.3*a-.03*u_time));
  return clamp(v,0.,1.);
}
vec2 skew(vec2 st){
  vec2 r=vec2(0.);
  r.x=1.1547*st.x;
  r.y=st.y+.5*r.x;
  return r;
}
float noise(in vec2 p)
{
  vec2 i=floor(p);
  vec2 f=fract(p);
  f=f*f*(3.-2.*f);
  float n=i.x+i.y*27.;
  return mix(mix(hash(n+0.),hash(n+1.),f.x),
  mix(hash(n+27.),hash(n+28.),f.x),f.y);
}

void main(){
  vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  float lines=lines(pos*2.,.0025);
  vec2 sk=skew(pos)*2.;
  float n=noise(sk);
  pos*=n;
  float s=spiral(pos*.9)*lines;
  vec3 col=vec3(1.);
  vec2 v=cos(sk/.05+(u_time)*s);
  col=vec3(pos.x+v.x,v.y-.25,v.y+n)*s;
  gl_FragColor=vec4(col,1.);
}
