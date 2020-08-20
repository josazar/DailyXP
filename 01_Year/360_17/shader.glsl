
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926

uniform sampler2D u_texture_0;
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
// Based on Morgan
// https://www.shadertoy.com/view/4dS3Wd
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float noise(in vec2 st){
  vec2 i=floor(st);
  vec2 f=fract(st);
  
  // Four corners in 2D of a tile
  float a=random(i);
  float b=random(i+vec2(1.,0.));
  float c=random(i+vec2(0.,1.));
  float d=random(i+vec2(1.,1.));
  
  vec2 u=f*f*(3.-2.*f);
  
  return mix(a,b,u.x)+
  (c-a)*u.y*(1.-u.x)+
  (d-b)*u.x*u.y;
}

void main(){
  vec2 st=gl_FragCoord.xy/u_resolution.xy;
  vec4 color=vec4(st.x,st.y,0.,1.);
  
  vec2 m=u_mouse/u_resolution;
  
  float mi=1.;
  
  // fract
  st=fract(st*1.);
  float sdf=distance(st,vec2(.5)*m*2.);
  
  float offset=.2;
  
  float angle=noise(st+u_time*.1)*PI;
  float radius=offset;
  
  st+=radius*vec2(cos(angle),sin(angle));
  st*=smoothstep(sdf,0.02,0.0458);
  
  // float circMap=map(circ,0.,.6,.5,1.2);
  color=texture2D(u_texture_0,st);
  
  gl_FragColor=color;
}
