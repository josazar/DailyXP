precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture_2;

varying vec2 vUv;
varying vec3 vPosition;






#define PI 3.14159265359
#define TAU PI*2.



// methods
// **********************************************
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



//  EASING
// **********************************
float easeQuintInOut(float t) {
		t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t * t;
		return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}
float easeBackOut(float t) {
		float s = 1.70158;
		return ((t = t - 1.0) * t * ((s + 1.0) * t + s) + 1.0);
}
float easeBackInOut(float t) {
		t *= 2.0; float s = 1.70158;
		if (t < 1.0) return 0.5 * (t * t * (((s *= (1.525)) + 1.0) * t - s));
		return 0.5 * ((t -= 2.0) * t * (((s *= (1.525)) + 1.0) * t + s) + 2.0);
}
float easeBackIn(float t) {
		float s = 1.70158;
		return t * t * ((s + 1.0) * t - s);
}
float easeCircularIn(float t) {
		return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}
float easeBounceOut(float t) {
		if (t < (1.0 / 2.75)) {
				return (7.5625 * t * t);
		} else if (t < (2.0 / 2.75)) {
				return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
		} else if (t < (2.5 / 2.75)) {
				return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
		} else {
				return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
		}
}
float easeBounceIn(float t) {
		return 1.0 - easeBounceOut(1.0 - t);
}
float easeBounceInOut(float t) {
		if (t < 0.5) return easeBounceIn(t * 2.0) * 0.5;
		else return easeBounceOut(t * 2.0 - 1.0) * 0.5 + 0.5;
}

// SDF SHAPES
// ********************************
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
//30
float raysSDF(vec2 st, int N) {
	st -= .5;
	return fract(atan(st.y,st.x)/PI*2.*float(N));
}

// 11
float crossSDF(vec2 st, float s) {
	vec2 size = vec2(.25, s);
	return min( rectSDF(st, size.xy),
							rectSDF(st,size.yx));
}
//14
float vesicaSDF(vec2 st, float w) {
	vec2 offset = vec2(w*.5,0.);
	return max(	circleSDF(st-offset),
							circleSDF(st+offset));
}
// 27
float hexSDF(vec2 st){
    st = abs(st*2.-1.);
    return max(abs(st.y), st.x * 0.866025 + st.y*0.5);
}
// 26
float polySDF(vec2 st, int V) {
	st = st*2.-1.;
	float a = atan(st.x, st.y)+PI;
	float r = length(st);
	float v = (PI*2.)/float(V);

	return cos(floor(.5+a/v)*v-a)*r;
}
// 34
float heartSDF(vec2 st) {
	st -= vec2(.5,.8);
	float r = length(st)*5.;
	st = normalize(st);
	return r -((st.y*pow(abs(st.x), 0.67))/
	(st.y+1.5)-(2.)*st.y+1.26);
}
// 47
float spiralSDF(vec2 st, float t) {
	st -= .5;
	float r = dot(st,st);
	float a = atan(st.y, st.x);
	return abs(sin(fract(log(r)*t+a*0.159)));

}

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}



/* Easing Expo In equation */
/* Adapted from Robert Penner easing equations */
float easeExpoIn(float t) {
		return (t == 0.0) ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}
/* Easing Expo Out equation */
/* Adapted from Robert Penner easing equations */
float easeExpoOut(float t) {
		return (t == 1.0) ? 1.0 : (-pow(2.0, -10.0 * t) + 1.0);
}


void main()
{
    vec2 st = gl_FragCoord.xy / u_resolution;
		float ease = easeExpoOut(cos(u_time)*.5+.75);
    float alpha = 1.;
    vec2 uv = vUv;

		float noise = pnoise(vPosition+ease, vec3(15.));
    vec3 color =  texture2D(u_texture_2,uv).xyz;
    // float c = circleSDF(fract(uv));
		float t = cos(u_time)*.5+.5;
    alpha -= clamp(noise +1.- t,0.,1.);
		alpha = mix(alpha, 1.01, t);
    // alpha -= fill(c, cos(u_time)*.5+.15);

		if(alpha < 1.) discard;
    gl_FragColor = vec4(color,1.);
}
