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

vec2 kaleido(vec2 uv)
{
	float th = atan(uv.y, uv.x);
	float r = pow(length(uv), .9);
	float f = 3.14159 / 3.5;

	th = abs(mod(th + f/4.0, f) - f/2.0) / (1.0 + r);
	// th = sin(th * 6.283 / f);

	return vec2(cos(th), sin(th)) * r * .1;
}

void main()
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    vec2 uv;
    p*=4.;
    p*=rotate2d(u_time*.1);
    float a = atan(p.y,p.x);
    float r = sqrt(dot(p,p));

    float i = 7.;

    uv.x =          i*a/PI;
    uv.y = sin(i*r+u_time) + .7*cos(u_time+i*a);


    uv = kaleido(uv);
    vec3 col =  texture2D(u_texture_1,uv*.5).xyz;

    gl_FragColor = vec4(col,1.0);


}
