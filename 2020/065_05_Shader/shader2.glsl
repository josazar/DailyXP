
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_0;
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

void main(){
  vec2 pos=vec2((gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  vec4 texture=texture2D(u_texture_2,pos+1.)*1.;
  pos+=.5;
  float curves=cos(pos.y)*cos(pos.x)*.5;
  float r=sin(pos.y)*.5+.5;
  float g=curves;
  float b=cos(pos.y);
  texture.rg=rotate2D(vec2(texture),u_time);
  vec3 background=vec3(g*2.,texture.g,curves);
  pos.x+=sin(u_time)*.15;
  pos.y+=cos(u_time)*.15;
  pos*=sin(loopease(.5)*2.)*.5+.5;
  pos+=.5;
  pos=rotate2D(pos,u_time);
  float bx=box(pos,vec2(.25,.25));
  float bx2=box(pos,vec2(.24,.24));
  vec3 color=(bx<=0.)?background:vec3(1.,1.,1.);
  color=(bx2<=0.)?color:vec3(texture.rgb);
  gl_FragColor+=vec4(color,1.);
}
