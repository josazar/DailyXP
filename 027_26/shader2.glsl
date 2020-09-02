
//https://www.shadertoy.com/view/Wl2SWG

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST.01

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
  
  float box=sdBox(p-vec3(0,0,6),vec3(1));
  box=abs(box)-.1;// shell
  // sphere
  vec4 s=vec4(0,1.8*cos(u_time)+.5,5,1)+cos(p.y*2.)*cos(u_time);
  // sphere disctance
  float sphereDist=length(p-s.xyz)-s.w;
  
  float d=min(sphereDist*.1,planeDist*.1);
  // d=min(sphereDist,box);
  // d=min(planeDist,box);
  
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
    vec3 ro=vec3(0,2,-3);
    // Ray Direction
    vec3 rd=normalize(vec3(uv.x,uv.y,1));
    
    float d=RayMarch(ro,rd);
    
    vec3 p=ro+rd*d;
    float dif=GetLight(p);
    
    // anaglyph technique from leon/ponk
    float red=RayMarch(ro-vec3(.1,0.,0.),rd);
    float cyan=RayMarch(ro+vec3(.1,0.,0.),rd);
    
    col=vec3(dif);
    // col*=vec3(red,vec2(cyan))*.2;
    gl_FragColor=vec4(col,1.);
    // Color grey
    gl_FragColor.rgb*=vec3(.7,.8,.9);
    
  }
  