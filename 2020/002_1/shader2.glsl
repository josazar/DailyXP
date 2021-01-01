
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_2;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AA 2
#define PI 3.1415926

// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float hash(in float n)
{
  return fract(sin(n)*43758.5453);
}

mat2 rotate2d(float angle){
  return mat2(cos(angle),-sin(angle),
  sin(angle),cos(angle));
}

float noise(in vec2 p)
{
  vec2 i=floor(p);
  vec2 f=fract(p);
  f=f*f*(3.-2.*f);
  float n=i.x+i.y*27.;
  return mix(mix(hash(n+0.),hash(n+1.),f.x),
  mix(hash(n+27.),hash(n+28.),f.x),f.y);
}
float lines(in vec2 pos,float b){
  float scale=10.;
  pos*=scale;
  return smoothstep(0.,
    .5+b*.5,
    abs((sin(pos.x*3.1415)+b*2.))*.5);
  }
  
  void main(){
    vec2 st=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
    vec2 pos=st.yx*vec2(5.,18.2);
    
    vec2 m=u_mouse-.5;
    float pattern=st.y;
    // texture
    vec2 texture=texture2D(u_texture_2,pos).xy;
    st*=texture/50.;
    // Add noise
    float n=noise(st*16.);
    pos=rotate2d(n*m.x/100.)*pos;
    
    // Draw lines
    pattern=lines(pos,.5);
    // couleur
    vec3 col=vec3(pattern);
    col*=vec3(.6,.3,.6);
    gl_FragColor=vec4(col,1.);
  }
  