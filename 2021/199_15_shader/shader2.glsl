precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed
uniform vec2 u_mouse;



#define THETA 2.399963229728653
#define PI 3.14159265359


/* Easing Quint InOut equation */
/* Adapted from Robert Penner easing equations */
float easeQuintInOut(float t) {
		t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t * t;
		return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}
float stroke(float x, float s, float w) {
	float d = step(s,x+w*.5) -
						step(s,x-w*.5);
	return clamp(d, 0.,1.);
}
float circleSDF(vec2 st) {
	return length(st-.5)*2.;
}
float fill(float x, float size) {
	return 1.-step(size,x);
}
float flip(float v, float pct) {
	return mix(v, 1.-v,pct);
}
vec3 bridge(vec3 c, float d, float s, float w) {
	c *= 1.-stroke(d,s,w*2.);
	return  c + stroke(d,s,w);
}
float triSDF(vec2 st) {
	st = (st*2.-1.)*2.;
	return max(abs(st.x) * 0.866025 + st.y * .5, -st.y * .5);
}






void main() {
	vec3 color = vec3(0.);
  vec2 st = gl_FragCoord.xy / u_resolution;
	float ease = easeQuintInOut(cos(u_time*2.)*.5+.98);

	float circle = circleSDF(st-vec2(.0,.1));
	float triangle = triSDF(st+vec2(.0,.1));

	color += stroke(circle,.45,.1*ease);
	color *= step(.55,triangle);
	color += fill(triangle, .45);


  gl_FragColor = vec4(color,1.0);
}
