precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed

#define THETA 2.399963229728653
#define PI 3.14159265359


// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {
    return smoothstep(0.005, 0.0, abs(st.y - st.x));
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main()
{
  vec2 p =  -1. + 2.*gl_FragCoord.xy / u_resolution.xy;
  vec3 col = vec3(0.06, 0.06, 0.06);

  float line = plot(p);

  col = col+line*vec3(0.8, 0.8, 0.8);

  const int n = 90;
  float angle = PI/float(n);

  for(int i= 0; i < n - 1; i++) {
    p = rotate(p, angle);
    line = plot(p);
    col = col+line*vec3(0.8, 0.8, 0.8);
  }

  // cercles
  float size = 0.8;
  float circle = smoothstep(0.13*size,.10*size,distance(p,vec2(-.0, 0.)));
  col = col-circle*80.;

 p = rotate(p, u_time*.05);
  p+=vec2(.4,-.1);
  circle = smoothstep(0.13*size,.10*size,distance(p,vec2(-.0, 0.)));
  col = col-circle*80.;


  gl_FragColor = vec4(col,1.0);
}
