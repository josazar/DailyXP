/* Main function, uniforms & utils */
#ifdef GL_ES
		precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

/* Coordinate and unit utils */
vec2 coord(in vec2 p) {
	p = p / u_resolution.xy;
		// correct aspect ratio
		if (u_resolution.x > u_resolution.y) {
				p.x *= u_resolution.x / u_resolution.y;
				p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
		} else {
				p.y *= u_resolution.y / u_resolution.x;
			p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
		}
		// centering
		p -= 0.5;
		p *= vec2(-1.0, 1.0);
	return p;
}
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

/* Signed distance drawing methods */
float fill(in float d) { return 1.0 - smoothstep(0.0, rx * 2.0, d); }
float stroke(in float d, in float t) { return 1.0 - smoothstep(t - rx * 1.5, t + rx * 1.5, abs(d)); }
vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }
/* Field Adapted from https://www.shadertoy.com/view/XsyGRW */
vec3 field(float d) {
		const vec3 c1 = mix(WHITE, YELLOW, 0.4);
		const vec3 c2 = mix(WHITE, AZUR, 0.7);
		const vec3 c3 = mix(WHITE, ORANGE, 0.9);
		const vec3 c4 = BLACK;
		float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
		float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
		float d2 = abs(stroke(d, 0.004));
		float f = clamp(d * 0.85, 0.0, 1.0);
		vec3 gradient = mix(c1, c2, f);
		gradient = mix(gradient, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
		gradient = mix(gradient, c3, fill(d));
		gradient = mix(gradient, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
		return gradient;
}

/* Shape 2D pie */
float sPie(in vec2 p, in float w, in float s, in float e) {
		s = mod(s, TWO_PI);
		e = mod(s + e, TWO_PI);
		float a = mod(atan(p.y, p.x), TWO_PI);
		a = abs(step(s, a) - step(e, a));
		a = s < e ? a : 1.0 - a;
		float d = length(p);
		return 1.0 - (a - d * 2.0) - w;
}
float pie(in vec2 p, in float w, in float s, in float e) {
		float d = sPie(p, w, s, e);
		return fill(d);
}
float pie(in vec2 p, in float w, in float s, in float e, in float t) {
		float d = sPie(p, w, s, e);
		return stroke(d, t);
}


/* Easing Quart Out equation */
/* Adapted from Robert Penner easing equations */
float easeQuartOut(float t) {
		return -1.0 * ((t = t - 1.0) * t * t * t - 1.0);
}
/* Easing Quint In equation */
/* Adapted from Robert Penner easing equations */
float easeQuintIn(float t) {
		return t * t * t * t * t;
}
/* Easing Elastic Out equation */
/* Adapted from Robert Penner easing equations */
float easeElasticOut(float t) {
		if (t == 0.0) { return 0.0; }
		if (t == 1.0) { return 1.0; }
		float p = 0.3;
		float a = 1.0;
		float s = p / 4.0;
		return (a * pow(2.0, -10.0 * t) * sin((t - s) * TWO_PI / p) + 1.0);
}

/* Shape 2D circle */
float sCircle(in vec2 p, in float w) {
		return length(p) * 2.0 - w;
}
float circle(in vec2 p, in float w) {
		float d = sCircle(p, w);
		return fill(d);
}
float circle(in vec2 p, in float w, float t) {
		float d = sCircle(p, w);
		return stroke(d, t);
}

/* Staggered animation */
struct Animation { float time; float pow; };
Animation animation = Animation(0.0, 0.0);
void totalTime(in float t, in float offset) { animation.time = mod(u_time + offset, t); }
void totalTime(in float t) { totalTime(t, 0.0); }
bool between(in float duration, in float offset) {
		float p = (animation.time - offset) / duration;
		animation.pow = p;
		animation.time -= (duration + offset);
		return (p >= 0.0 && p <= 1.0);
}
bool between(in float duration) { return between(duration, 0.0); }

/* Object struct */
struct Object { float distance; vec3 color; };
Object object = Object(0.0, vec3(0.0));

void main() {
		vec3 color = BLACK;
		totalTime(4.);
		float v = 0.;

		if (between(2.)) {
			v = easeQuintIn(animation.pow);
    	object.distance = circle(st + vec2(0.3 * cos(PI_TWO + v * 2.0 * PI), 0.3 * sin(PI_TWO + v * 2.0 * PI)), 0.2+(cos(u_time)*.5+.5)*.2, 0.02);
		}
		if (between(3.,-.15)) {
			v = easeElasticOut(animation.pow);
    	object.distance = circle(st + vec2(0.25 * cos(PI_TWO + v * 2.0 * PI), 0.3 * sin(PI_TWO + v * 2.0 * PI)), 0.2, 0.02);
		}





    object.color = WHITE;
    color = mix(color, object.color, object.distance);

		gl_FragColor = vec4(color, 1.0);
}
