
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
  float n=noise(pos*25.);
  // pos.y+=sin(u_time*1.5+pos.x*12.)*.05;
  //noise
  pos=rotate2d(n+cos(u_time*1.5))*pos;
  // couleur
  float speed=.145;
  float d=length(pos);
  // pos*=.8;// scale
  float r=(pos.x*pos.x+pos.y*pos.y)*25.;
  // r+=sin(d*4.0);	//*0.5;
  float v=1.+.5*cos((r+u_time*speed)/.09);
  v=(v*d)*5.;
  v*=1.-d;
  v=clamp(v,0.,2.);
  v*=v+d;
  vec3 col=vec3(pos.y-.3,.15,.3)*v;
  gl_FragColor=vec4(col,1.);
}
