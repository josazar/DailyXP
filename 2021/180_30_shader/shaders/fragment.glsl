precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed
uniform vec2 u_mouse;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

uniform sampler2D u_buffer0;

#define THETA 2.399963229728653
#define PI 3.14159265359

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.005, pct, st.y) -
          smoothstep( pct, pct+0.005, st.y);
}
vec2 rot(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
  vec2 uv = -1. + 2.*gl_FragCoord.xy / u_resolution.xy;
	// vec2 uv = gl_FragCoord.xy - 0.5*u_resolution.xy;

	// vec2 UV = 2.*rot(uv, u_time);
   vec2 UV = 2.*rot(uv,0.5*sin(u_time))*(1.0 + 0.05*sin(0.5*u_time));
  vec3 col = vec3(1.);
	vec3 texture =  texture2D(u_texture_1,uv*.5+.5).xyz;
 	float s = abs(UV.x) + abs(UV.y); // "Square"
  gl_FragColor = 0.95*vec4(texture.y);

  gl_FragColor += vec4(1.0)*( step(1.0, s) - step(1.02, s));
}


