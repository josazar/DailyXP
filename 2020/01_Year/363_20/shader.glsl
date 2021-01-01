
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

//generic rotation formula
vec2 rot(vec2 uv,float a){
  return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
}

float sdEquilateralTriangle(in vec2 p)
{
  const float k=sqrt(3.);
  p.x=abs(p.x)-1.;
  p.y=p.y+1./k;
  if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
  p.x-=clamp(p.x,-2.,0.);
  return-length(p)*sign(p.y);
}

void main(){
  vec2 st=gl_FragCoord.xy/u_resolution.xy;
  
  vec4 color=vec4(st.x,st.y,0.,1.);
  
  vec2 m=u_mouse/u_resolution;
  // rotation et zoom
  // st*=mod(st,u_time/22.);
  
  st=fract(st*2.);
  
  float tri=sdEquilateralTriangle(st/.25-2.);
  // st*=smoothStep(tri,.5,.8);
  st*=sin(u_time)*.5+.5;
  // color=texture2D(u_texture_0,st);
  vec3 colorA=texture2D(u_texture_0,st).rgb;
  // u_texture_0.xy=rot(u_texture_0,u_time/5.);
  
  colorA*=smoothstep(tri,.2,.015);
  color=vec4(colorA,1.);
  
  gl_FragColor=color;
}
