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



void main() {
	vec3 color = vec3(0.);
  vec2 st = gl_FragCoord.xy / u_resolution;
	float ease = easeQuintInOut(cos(u_time)*.5+.8);

	st.x = flip(st.x, step(.5,st.y));
	vec2 offset = vec2(.15,.0);
	float left = circleSDF(st+offset*(ease));
	float right = circleSDF(st-offset*(ease));
	color += stroke(left, .4, .075*ease);
	color = bridge(color, right, .4, .075*ease);


	// color += step(0.5*ease,(st.x+st.y)*.5)*.02;

	// color -= stroke(circleSDF(st), .5,.05);
	// color -= step(0.5*ease,(st.x-st.y)*.5)*.02;



	color += fill(circleSDF(st), .03*ease);


  gl_FragColor = vec4(color,1.0);
}
