
//https://www.shadertoy.com/view/Wl2SWG

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define time(speed)fract(u_time*speed)
#define AnimInOutExpoLoop(speed)easeInOutExpo(abs(-1.+2.*time(speed)))
#define square(puv,s)(max(abs(puv.x),abs(puv.y))-s)
// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float hash(in float n)
{
  return fract(sin(n)*43758.5453);
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
float easeInOutExpo(float x)
{
  return x==0.
  ?0.
  :x==1.
  ?1.
  :x<.5?pow(2.,20.*x-10.)/2.
  :(2.-pow(2.,-20.*x+10.))/2.;
}
void main(){
  
  vec2 uv=(gl_FragCoord.xy*2.-u_resolution)/min(u_resolution.x,u_resolution.y);
  // uv.x+=sin(u_time)+cos(u_time*2.1);
  // uv.y+=cos(u_time)+sin(u_time*1.6);
  vec3 col=vec3(0.);
  float noise=noise(uv);
  uv.x/=cos(noise+u_time)*.5;
  uv.y/=sin(noise+u_time)*.5;
  vec2 translate=vec2(-.5,.5);
  float anim=AnimInOutExpoLoop(.2);
  col=vec3(square(uv,.6)*anim*2.);
  // uv+=translate;
  // const int count=30;
  // for(int i=0;i<count;i++){
    //     float radius=.6;
    //     float rad=radians(360./float(count))*float(i);
    //     col+=.003/length((uv+vec2(radius*cos(rad*cos(u_time)),radius*sin(rad+cos(u_time)))));
  // }
  // col+= 0.02/length(uv);
  col+=.1*(abs(sin(u_time))+.51)/length(uv)/2.;
  gl_FragColor=vec4(col,1.);
}
