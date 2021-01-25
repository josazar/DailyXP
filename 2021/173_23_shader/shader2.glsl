precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed

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
  p*=6.5;
  p.y -=1.5;
  p = rotate(p, cos(u_time)*.12);
  vec3 col = vec3(0.06, 0.06, 0.06);
  float y = sin(u_time+p.x) * cos(.2*p.x) * cos(2.5*p.x)* sin(u_time*2.-2.*p.x);
  y *=.5;
  float ystraight = cos(p.y*5.);
  float isUnderWater = 0.;
  if (p.y > y-0.05) {
    isUnderWater = 1.;
  }
  float line = plot(p,y);
  if ((p.x >5.) || (p.x < -5.))  {
    line = plot(abs(p), ystraight);
    col = vec3(1.0, 1.0, 1.0);

  } else {
    if (isUnderWater == 1.) {
      col = vec3(1.0, 1.0, 1.0);
    }
  }
  col = col+line*vec3(0.8, 0.8, 0.8);
  gl_FragColor = vec4(col,1.0);
}
