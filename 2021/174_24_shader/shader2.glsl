precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed
uniform vec2 u_mouse;

#define THETA 2.399963229728653
#define PI 3.14159265359

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.085, pct, st.y) -
          smoothstep( pct, pct+0.085, st.y);
}
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}
void main()
{
  vec2 p =1. - 2.*gl_FragCoord.xy / u_resolution.xy;
  float isUnderWater = 0.;
  p*=6.5;
  p.y -=.5;
  vec2 p2 = p;
  p = rotate(p, -(u_mouse.x -  u_resolution.x/2.)*.00025);
  float ratio =  u_resolution.x/2. - u_mouse.x;
  p2 = rotate(p, (u_mouse.x*cos(u_time*4.) -  u_resolution.x/2.)*.00015);
  vec3 col = vec3(0.06, 0.06, 0.06);
  float y = sin(u_time+p2.x) * cos(.2*p2.x) * cos(2.5*p2.x)* sin(u_time*2.-2.*p2.x);
  y *=.25;
  if (p2.y > y-0.05) {
    isUnderWater = 1.;
  }
  float line = plot(p,y);
  if ((p.x >5.) || (p.x < -5.))  {
    // col = vec3(1.0, 1.0, 1.0);
  } else {
    if (isUnderWater == 1.) {
      // Water
      col = vec3(1.0, 1.0, 1.0);
    }
  }
  gl_FragColor = vec4(col,1.0);
}
