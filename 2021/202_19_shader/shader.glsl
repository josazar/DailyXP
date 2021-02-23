// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_buffer0;

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
/* Easing Circular In equation */
/* Adapted from Robert Penner easing equations */
float easeCircularIn(float t) {
		return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}
// SDF SHAPES
float circleSDF(vec2 st) {
	return length(st-.5)*2.;
}
float triSDF(vec2 st) {
	st = (st*2.-1.)*2.;
	return max(abs(st.x) * 0.866025 + st.y * .5, -st.y * .5);
}
float rectSDF(vec2 st, vec2 s) {
	st = st*2.-1.;
	return max( abs(st.x/s.x), abs(st.y/s.y));
}
float rhombSDF(vec2 st) {
    return max(triSDF(st), triSDF(vec2(st.x, 1.-st.y)));
}
// methods
float stroke(float x, float s, float w) {
	float d = step(s,x+w*.5) - step(s,x-w*.5);
	return clamp(d, 0.,1.);
}
float flip(float v, float pct) {
	return mix(v, 1.-v,pct);
}
vec3 bridge(vec3 c, float d, float s, float w) {
	c *= 1.-stroke(d,s,w*2.);
	return  c + stroke(d,s,w);
}
float fill(float x, float size) {
	return 1.-step(size,x);
}
vec2 rotate(vec2 st, float a) {
	st = mat2(cos(a),-sin(a), sin(a),cos(a))*(st-.5);
	return st+.5;
}




#if defined(BUFFER_0)
	void main() {
		vec2 uv = -1. + 2.*gl_FragCoord.xy / u_resolution.xy;
		uv +=.525;
		float ease = easeCircularIn(sin(u_time));
		vec3 buffer = texture2D(u_buffer0, uv * .5+(0.235+ease*.01), .0).rgb;
    buffer *= 0.85;
		float s = fill(rectSDF(uv-.025, vec2(2.)),.4);
		buffer = mix(buffer, vec3(1), s );
		gl_FragColor = vec4(buffer, 0.);
	}
#else
	void main() {
		vec3 color = vec3(0.);
		vec2 st = gl_FragCoord.xy / u_resolution;
		// keep ratio
		st.x *= u_resolution.x/u_resolution.y;
		float ease = easeCircularIn(cos(u_time));
		st = rotate(vec2(st.x, 1.-st.y), radians(45.));
		vec2 stCopy = st;
		stCopy -=0.0251;
		vec2 s = vec2(1.);
		color += fill(rectSDF(st-.025, s),.4);
		color += texture2D(u_buffer0, stCopy).rgb;
		st += cos(ease+20.)*.052;
		color += fill(rectSDF(st+.025, s),.4);
		color *= step(.38, rectSDF(st+.025, s));
		gl_FragColor = vec4(color,1.0);
	}
#endif
