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
  vec2 uvC = uv;
  uv*=15.;
  uv = rotate2d( sin(u_time)*-PI*.05 ) * uv;
  vec2 gv=fract(uv)-.5;
  // gv.x = mix(gv.x, cos(u_time)*tan(uv.y)*.2,0.2);

  vec2 id=floor(uv);
  float n=Hash21(id);

  float rayon = 0.5*n;
  // if(n<.5)gv.x*=-1.;
  float d = distance(uv,gv);
  float circle = smoothstep(rayon,rayon*0.8,length(gv-.012));
  float circle2 = smoothstep(rayon,rayon*0.1,length(gv+.21));
  float mask = circle;
  mask += mix(mask, circle2,.4);
  col += mask;

  uvC = rotate2d( sin(u_time)*PI*.1 ) * uvC;

  float r = length(uvC)*2.0;
  float a = atan(uvC.y,uvC.x);

  float f = cos(a*23.)*.8;

  col = mix(col, -abs(vec3(f)), .55);

  // if(gv.x>.48||gv.y>.48)col=vec3(0.7451, 0.2039, 0.2039);

  gl_FragColor=vec4(col,1.);
}
