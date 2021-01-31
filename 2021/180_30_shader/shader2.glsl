precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed
uniform vec2 u_mouse;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

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

/* Easing Back In equation */
/* Adapted from Robert Penner easing equations */
float easeBackIn(float t) {
		float s = 1.70158;
		return t * t * ((s + 1.0) * t - s);
}

#if defined(BUFFER_0)
	void main() {
		vec2 uv = -1. + 2.*gl_FragCoord.xy / u_resolution.xy;
		float ease = easeBackIn(cos(u_time));
		vec2 UV = 4.*rot(uv,1.5*sin(ease))*(1.0 + 0.05*sin(0.5*u_time));
    vec3 color = vec3(1);
		uv +=cos(u_time)*.05;
		// BUFFER
		vec3 buffer = texture2D(u_buffer0, sin(u_time)*uv*.5+0.5, 0.0).rgb;
    buffer *= 0.75;
		float s = abs(UV.x) + abs(UV.y); // "Square"
		s = ( step(1.0, s) - step(1.2, s));
		buffer = mix(buffer, color, s * 1.);
		gl_FragColor += vec4(buffer, 1.0);
	}
#else
	void main() {
		vec2 uv =  1.*gl_FragCoord.xy / u_resolution.xy;
		vec3 color = vec3(0.);
		color +=texture2D(u_buffer0, uv).rgb;
		gl_FragColor += vec4(color, 1.0);
	}
#endif
