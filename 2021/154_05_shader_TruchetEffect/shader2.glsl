//  from https://www.youtube.com/watch?v=2R7h76GoIJM

precision highp float;
uniform vec2 u_resolution;// Width and height of the shader
uniform float u_time;// Time elapsed

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

void main()
{
  vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
  vec3 col=vec3(0);
  uv*=15.;
  vec2 gv=fract(uv)-.5;
  vec2 id=floor(uv);
  
  float n=Hash21(id);// random number between 0 and 1
  float width=.15;
  
  // if(n<.5)gv.x*=-1.;
  float d=abs(abs(gv.x+gv.y)-.5);
  d=length(abs(gv)-vec2(.0))+id.x*.05*cos(u_time);
  float mask=smoothstep(.01,-.01,d-width);
  mask+=smoothstep(.01,-.01,abs(gv.x+gv.y-.99)-width);
  mask+=smoothstep(.01,-.01,abs(gv.x+gv.y+.99)-width);
  
  col+=mask;
  // col+= n;
  // if(gv.x>.48||gv.y>.48)col=vec3(1,0,0);
  gl_FragColor=vec4(col,1.);
}
