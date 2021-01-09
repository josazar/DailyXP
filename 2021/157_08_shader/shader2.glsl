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
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
void main()
{
  vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
  vec3 col=vec3(0);
  uv*=19.;
  uv = rotate2d( sin(u_time)*PI*.1 ) * uv;
  vec2 gv=fract(uv)-.5;
  vec2 id=floor(uv);
  float n=Hash21(id);

  float d = abs((uv.y+ cos(u_time)) * (uv.x+ sin(u_time)) + abs(gv.x - gv.y) )-2.9 ;

  float mask = smoothstep(.01,-.01,d+n*.0001);
  mask -= smoothstep(.001,-.6,d);

  col +=mask ;
  if(gv.x>.48||gv.y>.48)col=vec3(0.1412, 0.1412, 0.1412);

  gl_FragColor=vec4(col,1.);
}
