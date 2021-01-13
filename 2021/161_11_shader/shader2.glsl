//  from https://www.youtube.com/watch?v=2R7h76GoIJM

precision highp float;
uniform vec2 u_resolution;// Width and height of the shader
uniform float u_time;// Time elapsed
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.01// Surface Distance

float Hash21(vec2 p){
  p=fract(p*vec2(234.34,435.345));
  p+=dot(p,p+34.23);
  return fract(p.x*p.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float square(vec2 p, vec2 bl, vec2 tr) {
    // bottom-left
    vec2 bl_ = smoothstep( bl*0.99, bl,p);
    float pct = bl_.x * bl_.y;
    // top-right
     vec2 tr_ = smoothstep(tr*0.99,tr,1.0-p);
     pct *= tr_.x * tr_.y;
     return pct;
}
vec2 kaleido(vec2 uv)
{
	float th = atan(uv.y, uv.x);
	float r = pow(length(uv), .9);
	float f = 3.14159 / 3.5;

	th = abs(mod(th + f/4.0, f) - f/2.0) / (1.0 + r);

	return vec2(cos(th), sin(th)) * r * .1;
}


vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(vec3 p) {

    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));

    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e*(1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);

    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;

    vec4 w, d;

    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);

    w = max(0.6 - w, 0.0);

    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);

    w *= w;
    w *= w;
    d *= w;

    return dot(d, vec4(52.0));
}


void main()
{
    vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    uv*=rotate2d(u_time*.52);
    uv*=20.;
    uv = kaleido(uv)*3.+cos(u_time)*0.2;
    float sq = square(fract(uv*2.), vec2(0.1), vec2(0.5));
    vec3 col =  vec3(sq);
    uv *= snoise(vec3(uv, 0.2));
    uv.x*=0.5;
    sq = square(fract(uv*5.), vec2(0.63), vec2(0.15));
    col +=  vec3(sq*sin(u_time)+.2, sq*atan(u_time)+.2, sq*cos(u_time)+.5);
    uv.y*=0.5;
    sq = square(fract(uv*20.), vec2(0.51), vec2(0.15));
    col *=  vec3(sq+0.82,sq+.2,sq+0.2);

    gl_FragColor = vec4(col,1.0);
}
