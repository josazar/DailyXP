
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
#define time(speed)fract(u_time*speed)
#define loopease(speed)easeInOutCirc(abs(-1.+2.*time(speed)))

float easeInOutCirc(float x)
{
  return x<.5
  ?(1.-sqrt(1.-(2.*x)*(2.*x)))/2.
  :(sqrt(1.-(-2.*x+2.)*(-2.*x+2.))+1.)/2.;
}

vec2 rotate2D(vec2 _st,float _angle){
  _st-=.5;
  _st=mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle))*_st;
  _st+=.5;
  return _st;
}

float box(vec2 _st,vec2 _size){
  _size=vec2(.5)-_size*.5;
  vec2 uv=smoothstep(_size,_size+vec2(1e-4),_st);
  uv*=smoothstep(_size,_size+vec2(1e-4),vec2(1.)-_st);
  return uv.x*uv.y;
}

// signed distance to a 2D triangle
float sdTriangle(in vec2 p0,in vec2 p1,in vec2 p2,in vec2 p)
{
  vec2 e0=p1-p0;
  vec2 e1=p2-p1;
  vec2 e2=p0-p2;
  
  vec2 v0=p-p0;
  vec2 v1=p-p1;
  vec2 v2=p-p2;
  
  vec2 pq0=v0-e0*clamp(dot(v0,e0)/dot(e0,e0),0.,1.);
  vec2 pq1=v1-e1*clamp(dot(v1,e1)/dot(e1,e1),0.,1.);
  vec2 pq2=v2-e2*clamp(dot(v2,e2)/dot(e2,e2),0.,1.);
  
  float s=sign(e0.x*e2.y-e0.y*e2.x);
  vec2 d=min(min(vec2(dot(pq0,pq0),s*(v0.x*e0.y-v0.y*e0.x)),
  vec2(dot(pq1,pq1),s*(v1.x*e1.y-v1.y*e1.x))),
  vec2(dot(pq2,pq2),s*(v2.x*e2.y-v2.y*e2.x)));
  
  return-sqrt(d.x)*sign(d.y);
}

void main(){
  vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  
  float curves=cos(pos.y)*tan(pos.x)*.5;
  float r=sin(pos.x+u_time)*.5+.5;
  float g=curves;
  float b=cos(pos.y);
  vec3 background=vec3(r,g,b);
  
  
  pos.x+=sin(u_time)*.5;
  pos.y+=cos(u_time)*.5;
  pos*=sin(loopease(.5)*2.)*.5+.5;
  pos+=.5;
  pos=rotate2D(pos,u_time);
  float bx=box(pos,vec2(.45,.25));
  float bx2=box(pos,vec2(.43,.23));
  
  // color = mix(color, vec3(box1), .5);
  vec3 color=(bx<=0.)?background:vec3(1.,1.,1.);
  //color-= vec3(bx2);
  color=(bx2<=0.)?color:vec3(.1961,.1294,.2275);
  
  gl_FragColor+=vec4(color,1.);
}
