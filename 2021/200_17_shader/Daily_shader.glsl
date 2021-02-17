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
/* Easing Back Out equation */
/* Adapted from Robert Penner easing equations */
float easeBackOut(float t) {
		float s = 1.70158;
		return ((t = t - 1.0) * t * ((s + 1.0) * t + s) + 1.0);
}
//
float stroke(float x, float s, float w) {
	float d = step(s,x+w*.5) -
						step(s,x-w*.5);
	return clamp(d, 0.,1.);
}
float flip(float v, float pct) {
	return mix(v, 1.-v,pct);
}
vec3 bridge(vec3 c, float d, float s, float w) {
	c *= 1.-stroke(d,s,w*2.);
	return  c + stroke(d,s,w);
}
float circleSDF(vec2 st) {
	return length(st-.5)*2.;
}
float triSDF(vec2 st) {
	st = (st*2.-1.)*2.;
	return max(abs(st.x) * 0.866025 + st.y * .5, -st.y * .5);
}
float rectSDF(vec2 st, vec2 s) {
	st = st*2.-1.;
	return max( abs(st.x/s.x),
							abs(st.y/s.y));
}
float fill(float x, float size) {
	return 1.-step(size,x);
}
vec2 rotate(vec2 st, float a) {
	st = mat2(cos(a),-sin(a),
						sin(a),cos(a))*(st-.5);
	return st+.5;
}
void main() {
	vec3 color = vec3(0.);
  vec2 st = gl_FragCoord.xy / u_resolution;
	float ease = easeQuintInOut(cos(u_time*2.)*.5+.98);
	float easeBackOut = easeBackOut(cos(u_time*2.)*.5+.98);
	st = rotate(st, radians(45.*easeBackOut));
	float r1 = rectSDF(st, vec2(1.));
	float r2 = rectSDF(st+.15, vec2(1.));
	color += stroke(r1,.5,.05);
	color *= step(.325, r2);
	color += stroke(r2, .325,.05) * fill(r1,.525);
	color += stroke(r2,.2*min(ease,1.),.05);
  gl_FragColor = vec4(color,1.0);
}
