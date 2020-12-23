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
  vec4 s=vec4(0,1,6,1);
  float sphereDist=length(p-s.xyz)-s.w;
  float planeDist=p.y;

  float td=sdTorus(p-vec3(1,1.25,6),vec2(1.5,.4));
  float td2=sdTorus(p-vec3(1,0.475,6),vec2(.25,1.4));
  float td3=sdTorus(p-vec3(1,3.5+cos(u_time)*.5,6),vec2(.15,.5));
  float td4=sdTorus(p-vec3(1,2.5+cos(u_time)*.5,6),vec2(.05,.25));
  float td5=sdTorus(p-vec3(1,1.5+cos(u_time)*.5,6),vec2(.15,.5));

  float link1 = sdLink(p-vec3(1.*sin(u_time),1.,10.), 4.5+sin(u_time*.5),0.5,2.0);

  float d=min(td,planeDist);
  d=min(d,td2);
  d=min(d,td3);
  d=min(d,td4);
  d=min(d,td5);

  d=min(d,link1);


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
  vec2 e=vec2(.01,0);

  vec3 n=d-vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx));

    return normalize(n);
  }

  float GetLight(vec3 p){
    vec3 lightPos=vec3(10.,40.,-80.);
    vec3 l=normalize(lightPos-p);
    vec3 n=GetNormal(p);
    float dif=clamp(dot(n,l),.1,1.);

    return dif;
  }

  void main(){

    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    uv*=15.625;
    float c=distance(uv,vec2(.5));
    // uv.y+=.4;
    // uv.x+=.8;
    // uv.x=uv.x*(sin(u_time)*.5+.5)*(uv.y+dot(uv.x,uv.x));
    vec3 col=vec3(0.);
    vec3 ro=vec3(c,2.5,c);
    vec3 rd=normalize(vec3(uv.x,uv.y,3.35));

    float d=RayMarch(ro,rd);

    vec3 p=ro+rd*d;

    float dif=GetLight(p);
    col=vec3(dif);

    gl_FragColor=vec4(col,1.);
  }
