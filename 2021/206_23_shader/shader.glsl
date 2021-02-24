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
// 11
float crossSDF(vec2 st, float s) {
	vec2 size = vec2(.25, s);
	return min( rectSDF(st, size.xy),
							rectSDF(st,size.yx));
}

// 27
float hexSDF(vec2 st){
    st = abs(st*2.-1.);
    return max(abs(st.y), st.x * 0.866025 + st.y*0.5);
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

// Noises
float noise(vec3 p)
{
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

vec2 hash12(float t) {
	float x = fract(sin(t*674.3)*453.2);
 	float y = fract(sin((t+x)*714.3)*263.2);
 return vec2(x,y);

}
vec2 hash12_polar(float t) {
	float x = fract(sin(t*674.3)*453.2);
 	float y = fract(sin((t+x)*714.3)*263.2);
 return vec2(x,y);

}


mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}

float map(vec3 p){
    p.xz*= m(u_time*1.84);p.xy*= m(u_time*0.13);
    vec3 q = p*2.+u_time;
    return length(p+vec3(sin(u_time*0.27)))*log(length(p)+.5) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
}

void main() {
	vec3 color = vec3(0.);
	vec2 st = gl_FragCoord.xy / u_resolution;
	// keep ratio
	st.x *= u_resolution.x/u_resolution.y;

	// noise
	float n = map(vec3(cos(u_time)*.1, st.x, st.y));
	n*=.1;
	float offset=.05;
	st.x += n;
	float c = circleSDF(st);
	color += step(c, .25+offset);
	color -= step(.31/c, .5+n)*2.;
	color += step(.5,fract(c*(4. * (1.-n*8.)))-.1);

	// for(float i= 0.; i< 50.; i++) {
	// 	vec2 dir = hash12(i+1.)-.5;
	// 	float t = fract(u_time);
	// 	float l = length(st-dir*t-.35);
	// 	color += .001/l;
	// }

	// float cr = crossSDF(st,.002);
	// color -= fill(cr,10.1);

	gl_FragColor = vec4(color,1.0);
}



