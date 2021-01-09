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
  // uv+=u_time*.05;
  uv*=2.5+sin(u_time)*0.21;
  vec2 gv=fract(uv)-.5;
  vec2 id=floor(uv);
  float n=Hash21(id);
  float width=.1;
  if(n<.15)gv.x*=-1.;
  float d= abs(abs(gv.x+gv.y));
  float dir=1.;
  if((gv.x+gv.y)<0.)dir=-1.;

  vec2 cUv=gv-.2*dir+cos(u_time)*0.01;

  d=length(cUv);

  float angle=cos(atan(cUv.x,cUv.y));
  float checker=cos(mod(id.x+id.y,6.)*2.-1.);
  float mask = smoothstep(.01,-.01,abs(d-.15)-width);

  float flow = sin(u_time+checker*angle*10.);

  // float x=fract(angle/1.57);
  // float y=(d-(.5-width))/(2.*width);
  // y=abs(y-.5)*2.;
  // vec2 tUv=vec2(x,y);

  col +=mask*flow;
  // col +=mask;
  // col.rg+=mask*tUv;
  gl_FragColor=vec4(col,1.);
}
