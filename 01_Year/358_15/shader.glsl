
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926

uniform vec2 u_resolution;
uniform float u_time;

float map(float n,float start1,float stop1,float start2,float stop2){
  return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
}

void main(){
  vec2 p=gl_FragCoord.xy/u_resolution.xy;
  vec3 color=vec3(0.);
  
  
  float mi=.05*cos(u_time)+.058;
  p = fract(p*5.);
  float sdf=distance(p,vec2(.5));
  
  color+=smoothstep(sdf,mi,mi/2.+.15);
  // color+=step(.85, cos(p.x+p.y));
  
  gl_FragColor=vec4(color,1.);
}
