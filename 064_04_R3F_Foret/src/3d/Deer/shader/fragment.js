export const fragmentShader = `
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))
      *43758.5453123);
}

float noise(in vec2 st){
  vec2 i=floor(st);
  vec2 f=fract(st);

  // Four corners in 2D of a tile
  float a=random(i);
  float b=random(i+vec2(1.,0.));
  float c=random(i+vec2(0.,1.));
  float d=random(i+vec2(1.,1.));

  // Smooth Interpolation

  // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u=f*f*(3.-2.*f);
  // u = smoothstep(0.,1.,f);

  // Mix 4 coorners percentages
  return mix(a,b,u.x)+
  (c-a)*u.y*(1.-u.x)+
  (d-b)*u.x*u.y;
}

mat2 rotate2d(float angle){
  return mat2(cos(angle),-sin(angle),
  sin(angle),cos(angle));
}

float lines(in vec2 pos,float b){
  float scale=10.;
  pos*=scale;
  return smoothstep(.4,
    .5+b*.5,
    abs((sin(pos.x*3.1415)+b*2.))*.5);
  }
  #define PI 3.14159265359
void main(){

  vec2 uv=vUv;

  // Use polar coordinates instead of cartesian
  vec2 toCenter = vec2(0.5)-uv;
  float angle = atan(toCenter.y, toCenter.x);
  float radius = length(toCenter)*2.0;

  float background = uv.y + 0.5;
  float curvePi = PI*(angle - sin(u_time + radius));
  float curves = cos(uv.y*curvePi) + sin(uv.x*curvePi);

  float r = sin(background*.27);
  float g = cos(curves);
  float b = 1.; // influences color of bg & curves

  vec3 color = vec3(r, g, b); // bg & curves
  vec3 softenColor = mix(
      color,
      vec3(0.15, .8, 0.5),
      0.5 // interpolation value - floating number
  );


  /*
  //  ZEBRE
  vec2 pos=vUv;
  float pattern=pos.x;
  // Add noise
  pos=rotate2d(noise(pos))*pos*10.;
  // Draw lines
  pattern=lines(pos,.5);
  gl_FragColor=vec4(vec3(pattern),.6);*/

  vec2 pos=vUv;
  float pattern=pos.x;
  // Add noise
  pos=rotate2d(noise(pos))*pos*10.;
  // Draw lines
  pattern=lines(pos,.5);
  vec3 zebre = mix(softenColor, vec3(pattern),0.5);

  gl_FragColor = vec4(zebre, 1.);


}
`
