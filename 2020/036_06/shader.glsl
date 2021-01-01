
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
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.01

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

mat2 Rot(float a){
  float s=sin(a);
  float c=cos(a);
  return mat2(c,-s,s,c);
}

float sdBox(vec3 p,vec3 s){
  p=abs(p)-s;
  return length(max(p,0.))+min(max(p.x,max(p.y,p.z)),0.);
}

float GetDist(vec3 p){
  float planeDist=dot(p,normalize(vec3(.5*cos(u_time),1.5,0)));
  // float box=sdBox(p-vec3(0,2,3),vec3(1));
  // box=abs(box)-.1;
  // sphere
  vec4 s=vec4(0,1.8,5,1);
  vec4 s2=vec4(sin(u_time),cos(u_time),4.,.2);
  vec4 s3=vec4(sin(u_time)*1.,-1.*cos(u_time),-2.*sin(u_time),.1);
  vec4 s4=vec4(cos(u_time)*2.,-.5*sin(u_time),-7.*sin(u_time),.23);
  vec4 s5=vec4(sin(u_time)*3.,2.5*cos(u_time),-4.*cos(u_time),.53);
  // sphere distance
  float sphereDist=length(p-s.xyz)-s.w;
  // p.x +=;
  p.y-=1.8;
  float sphere2Dist=length(p-s2.xyz)-s2.w;
  float sphere3Dist=length(p-s3.xyz)-s3.w;
  float sphere4Dist=length(p-s4.xyz)-s4.w;
  p.z-=1.8;
  p.y-=1.8;
  
  float sphere5Dist=length(p-s5.xyz)-s5.w;
  
  float d=min(sphereDist*.1,planeDist*.1);
  d=min(sphereDist,sphere2Dist);
  d=min(sphere3Dist,d);
  d=min(d,sphere4Dist);
  d=min(sphere5Dist,d);
  
  return d;
}

// Function principale de Ray MArching,
// voir le schema de The Art of Code avec les sphere et les points les plus proche
float RayMarch(vec3 ro,vec3 rd){
  float dO=0.;
  // rd : ray Direction
  // ro : Ray origin
  for(int i=0;i<MAX_STEPS;i++){
    vec3 p=ro+rd*dO;
    float dS=GetDist(p);
    dO+=dS;
    if(dO>MAX_DIST||abs(dS)<SURF_DIST)break;
  }
  
  return dO;
}

// Normal Vector
vec3 GetNormal(vec3 p){
  float d=GetDist(p);
  vec2 e=vec2(.001,0);
  
  vec3 n=d-vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx));
    
    return normalize(n);
  }
  
  float GetLight(vec3 p){
    vec3 lightPos=vec3(1.,10.,-2.);
    lightPos.xz+=vec2(sin(u_time),cos(u_time))*2.;
    vec3 l=normalize(lightPos-p);
    vec3 n=GetNormal(p);
    
    float dif=clamp(dot(n,l),.0,1.);
    
    // Ombre
    float d=RayMarch(p+n*SURF_DIST*2.,l);
    if(d<length(lightPos-p))dif*=.5;
    
    return dif;
  }
  
  void main(){
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 col=vec3(0.);
    // camera
    vec3 ro=vec3(0,2,-4);
    // Ray Direction
    vec3 rd=normalize(vec3(uv.x,uv.y,1));
    float d=RayMarch(ro,rd);
    vec3 p=ro+rd*d;
    float dif=GetLight(p);
    col=vec3(dif);
    gl_FragColor=vec4(col,1.);
  }
  