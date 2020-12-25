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
float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float GetDist(vec3 p){
  vec4 s=vec4(0,1,1,1);
  float sphereDist=length(p-s.xyz)-s.w;

  float planeDist=p.y;

  float td=sdTorus(p-vec3(1.0,0.25,5.+cos(u_time)),vec2(2.85,.4));

  float td3=sdTorus(p-vec3(1,0.8-cos(u_time)*.5,6),vec2(1.15,.5));
  float td4=sdTorus(p-vec3(1.,1. + cos(u_time)*.5,6),vec2(.05,.45));


  const float k = 10.0; // or some other amount
  float c = cos(k*p.y);
  float rs = sin(k*p.y);
  mat2  m = mat2(c,-rs,rs,c);
  vec3  q = vec3(m*p.xz,p.y);

  float d=min(td,planeDist);
  d=min(d,td3+q.x*0.025);
  d=min(d,td4);
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
  vec2 e=vec2(.1,0);

  vec3 n=d-vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx));

    return normalize(n);
  }

  float GetLight(vec3 p){
    vec3 lightPos=vec3(200.*cos(u_time*2.),40.,-200.);
    vec3 l=normalize(lightPos-p);
    vec3 n=GetNormal(p);
    float dif=clamp(dot(n,l),.1,1.);
    return dif;
  }

  void main(){
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    // uv*=1.5;
    float c=distance(uv,vec2(.5));
    uv.y-=.2;
    // uv.x+=.58;
    vec3 col=vec3(0.);
    vec3 ro=vec3(c,2.5,c);
    vec3 rd=normalize(vec3(uv.x,uv.y,.835));
    float d=RayMarch(ro,rd);
    vec3 p=ro+rd*d;

    float dif=GetLight(p);
    col=vec3(dif,dif,.35);

    gl_FragColor=vec4(col,1.);
  }
