// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.01

float sdTorus(vec3 p,vec2 r){
  float x=length(p.xz)-r.x;
  return length(vec2(x,p.y))-r.y;
}

float GetDist(vec3 p){
  vec4 s=vec4(0,1,6,1);
  
  float sphereDist=length(p-s.xyz)-s.w;
  float planeDist=p.y;
  float td=sdTorus(p-vec3(0,.5,6),vec2(1.5,.4));
  
  float d=min(td,planeDist);
  d=min(d,td);
  return d;
}

float RayMarch(vec3 ro,vec3 rd){
  float dO=0.;
  
  for(int i=0;i<MAX_STEPS;i++){
    vec3 p=ro+rd*dO;
    float dS=GetDist(p);
    dO+=dS;
    if(dO>MAX_DIST||dS<SURF_DIST)break;
  }
  
  return dO;
}

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
    vec3 lightPos=vec3(1.*cos(u_time),2.,8.*cos(u_time));
    vec3 l=normalize(lightPos-p);
    vec3 n=GetNormal(p);
    float dif=clamp(dot(n,l),.1,1.);
    
    return dif;
  }
  
  void main(){
    
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    uv*=1.25;
    uv.y-=.4;
    uv.x-=.1;
    uv-=(.15-dot(uv,uv));
    vec3 col=vec3(0.);
    
    vec3 ro=vec3(0,cos(u_time)*.5+3.,-4.);
    vec3 rd=normalize(vec3(uv.x-.15,uv.y-.2,cos(u_time)*.25+1.5));
    
    float d=RayMarch(ro,rd);
    
    vec3 p=ro+rd*d;
    
    float dif=GetLight(p);
    col=vec3(dif);
    
    gl_FragColor=vec4(col,1.);
  }
  