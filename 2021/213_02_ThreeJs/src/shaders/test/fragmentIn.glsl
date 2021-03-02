precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

varying vec2 vUv;

#define PI 3.1415925359


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
	return vec2(cos(th), sin(th)) * r * .1;
}






void main()
{
    vec2 st = gl_FragCoord.xy / u_resolution;

    // vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = vUv;
    uv*=4.;
    uv*=rotate2d(u_time*.1);
    float a = atan(st.y,st.x);
    float r = sqrt(dot(uv,uv));

    float i = 24.;

    uv.x *= i*a/PI;
    uv.y += sin(i*r+u_time) + .7*cos((u_time+i)*a+.7);


    uv = kaleido(uv);


		vec3 color =  texture2D(u_texture,uv*.5).xyz;
    gl_FragColor = vec4(color,1.);
}
