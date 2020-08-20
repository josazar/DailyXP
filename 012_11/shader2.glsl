//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926

void main(){
  vec2 st=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  st=fract(st*5.);
  vec2 r=abs(st.xy);
  float s=max(r.x,r.y);
  vec3 col=vec3(st.x,st.y,1.);
  col*=vec3(step(.2,s)*step(s,.5));
  gl_FragColor=vec4(col,1.);
}
