
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

// Permutation polynomial: (34x^2 + x) mod 289
vec4 permute(vec4 x){
  return mod((34.*x+1.)*x,289.);
}
vec3 permute(vec3 x){
  return mod((34.*x+1.)*x,289.);
}

// Cellular noise, returning F1 and F2 in a vec2.
// Speeded up by using 2x2x2 search window instead of 3x3x3,
// at the expense of some pattern artifacts.
// F2 is often wrong and has sharp discontinuities.
// If you need a good F2, use the slower 3x3x3 version.
vec2 cellular2x2x2(vec3 P){
  #define K.142857142857// 1/7
  #define Ko.428571428571// 1/2-K/2
  #define K2.020408163265306// 1/(7*7)
  #define Kz.166666666667// 1/6
  #define Kzo.416666666667// 1/2-1/6*2
  #define jitter.8// smaller jitter gives less errors in F2
  vec3 Pi=mod(floor(P),289.);
  vec3 Pf=fract(P);
  vec4 Pfx=Pf.x+vec4(0.,-1.,0.,-1.);
  vec4 Pfy=Pf.y+vec4(0.,0.,-1.,-1.);
  vec4 p=permute(Pi.x+vec4(0.,1.,0.,1.));
  p=permute(p+Pi.y+vec4(0.,0.,1.,1.));
  vec4 p1=permute(p+Pi.z);// z+0
  vec4 p2=permute(p+Pi.z+vec4(1.));// z+1
  vec4 ox1=fract(p1*K)-Ko;
  vec4 oy1=mod(floor(p1*K),7.)*K-Ko;
  vec4 oz1=floor(p1*K2)*Kz-Kzo;// p1 < 289 guaranteed
  vec4 ox2=fract(p2*K)-Ko;
  vec4 oy2=mod(floor(p2*K),7.)*K-Ko;
  vec4 oz2=floor(p2*K2)*Kz-Kzo;
  vec4 dx1=Pfx+jitter*ox1;
  vec4 dy1=Pfy+jitter*oy1;
  vec4 dz1=Pf.z+jitter*oz1;
  vec4 dx2=Pfx+jitter*ox2;
  vec4 dy2=Pfy+jitter*oy2;
  vec4 dz2=Pf.z-1.+jitter*oz2;
  vec4 d1=dx1*dx1+dy1*dy1+dz1*dz1;// z+0
  vec4 d2=dx2*dx2+dy2*dy2+dz2*dz2;// z+1
  
  // Sort out the two smallest distances (F1, F2)
  #if 0
  // Cheat and sort out only F1
  d1=min(d1,d2);
  d1.xy=min(d1.xy,d1.wz);
  d1.x=min(d1.x,d1.y);
  return sqrt(d1.xx);
  #else
  // Do it right and sort out both F1 and F2
  vec4 d=min(d1,d2);// F1 is now in d
  d2=max(d1,d2);// Make sure we keep all candidates for F2
  d.xy=(d.x<d.y)?d.xy:d.yx;// Swap smallest to d.x
  d.xz=(d.x<d.z)?d.xz:d.zx;
  d.xw=(d.x<d.w)?d.xw:d.wx;// F1 is now in d.x
  d.yzw=min(d.yzw,d2.yzw);// F2 now not in d2.yzw
  d.y=min(d.y,d.z);// nor in d.z
  d.y=min(d.y,d.w);// nor in d.w
  d.y=min(d.y,d2.x);// F2 is now in d.y
  return sqrt(d.xy);// F1 and F2
  #endif
}

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
  
  // échelle (nombre de cellules)
  // p*=2.;
  // // variables utilisées pour paver le plan
  // vec2 i_st=floor(p.xy);
  // vec2 f_st=fract(p.xy);
  // vec2 point=random2(i_st);
  // vec2 diff=point-f_st;
  // float dist=length(diff);
  
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
  
  // float sphere5Dist=length(p-s5.xyz)-s5.w;
  
  float d=min(sphereDist*.1,planeDist*.1);
  d=min(sphereDist,sphere2Dist);
  d=min(sphere3Dist,d);
  d=min(d,sphere4Dist);
  // d=min(sphere5Dist,d);
  
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

mat2 rotate(float a)
{
  float ca=cos(a);float sa=sin(a);
  return mat2(ca,sa,-sa,ca);
}

float rand(vec2 co)
{
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

float rnd(vec2 p)
{
  return abs(rand(p))*.8+.1;
}

float value(float x,float randx,float c)
{
  float a=min(x/randx,1.);
  
  float d=clamp(1.-(randx+c),.1,.9);
  float b=min(1.,(1.-x)/d);
  return a+(b-1.);
}

float polynoise(vec2 p,float sharpness)
{
  vec2 seed=floor(p);
  vec2 rndv=vec2(rnd(seed.xy),rnd(seed.yx));
  vec2 pt=fract(p);
  float bx=value(pt.x,rndv.x,rndv.y*sharpness);
  float by=value(pt.y,rndv.y,rndv.x*sharpness);
  return min(bx,by)*(.3+abs(rand(seed.xy*.01))*.7);
}

float polyfbm(vec2 p)
{
  vec2 seed=floor(p);
  mat2 r1=rotate(.2);
  mat2 r2=rotate(-1.4);
  mat2 r3=rotate(1.);
  
  // 1st octave
  float m1=polynoise(p*r2,.2);
  
  m1+=polynoise(r1*(vec2(.5,.5)+p),.2);
  m1+=polynoise(r3*(vec2(.35,.415)+p),.2);
  m1*=.333*.75;
  
  // 2nd
  float m2=polynoise(r3*(p*2.),.3);
  m2+=polynoise(r2*(p+vec2(.2,.6))*2.,.2);
  m1+=m2*.5*.25;
  
  return m1;
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
    vec2 st=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 col=vec3(0.);
    
    // camera
    vec3 ro=vec3(0,2,-4);
    
    st.x+=cos(u_time)/10.;
    float m=polyfbm(st);
    
    vec2 F=cellular2x2x2(vec3(st,u_time));
    
    // Ray Direction
    vec3 rd=normalize(vec3(st.x,st.y*F.x*m*6.,1.));
    
    float d=RayMarch(ro,rd);
    vec3 p=ro+rd*d;
    
    float dif=GetLight(p);
    
    col+=vec3(dif);
    gl_FragColor=vec4(col,1.);
  }
  