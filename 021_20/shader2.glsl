// Code from Flopine Shadertoy
// too tired tonight, just a tweak from a Flopine Code !
//https://www.shadertoy.com/view/llKyRz

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture_2;

const int maxSteps=64;
const float hitThreshold=.01;
const float minStep=.02;
const float PI=3.14159;

#define time u_time

vec2 moda(vec2 p,float per)
{
  float a=atan(p.y,p.x);
  float l=length(p);
  a=mod(a-per/2.,per)-per/2.;
  return vec2(cos(a),sin(a))*l;
}

mat2 rot(float a)
{
  return mat2(cos(a),sin(a),-sin(a),cos(a));
}

float beat(float value,float intensity,float frequency)
{
  float v=atan(cos(value*3.14*frequency)*intensity);
  return(v+3.14/2.)/3.14;
}

float sphere(vec3 p,float r)
{return length(p)-r;}

float box(vec3 p,vec3 b)
{
  vec3 d=abs(p)-b;
  return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.));
}

float odile(vec3 p,float d)
{return dot(p,normalize(sign(p)))-d;}

float cyl(vec3 p,float r,float h)
{return max(length(p.xz)-r,abs(p.y)-h);}

float prim1(vec3 p)
{
  vec3 pp=p;
  p.xz*=rot(time*.6);
  p.xz=moda(p.xz,2.*PI/5.);
  p.xz*=rot(p.y*.5);
  p.x-=.5;
  p.x-=.15;
  float c=cyl(p,.35,.8);
  
  p=pp;
  float od=odile(p,1.-beat(time,.13,.5));
  return min(c,od);
}

float scene(vec3 p)
{
  float d;
  d=sphere(p,.9);
  d=max(box(p,vec3(1.05)),-d);
  d+=min(d,prim1(p));
  
  vec3 np=p+vec3(0.,time*.2,time*.1);
  d+=texture2D(u_texture_2,-np.xz).r*.2;
  d+=texture2D(u_texture_2,np.yz).r*.2;
  return d;
}

//simesgreen raymarched inside function
vec3 traceInside(vec3 ro,vec3 rd,out bool hit,out float insideDist)
{
  
  hit=false;
  insideDist=0.;
  vec3 pos=ro;
  vec3 hitPos=pos;
  for(int i=0;i<maxSteps;i++)
  {
    float d=scene(pos);
    d=max(abs(d),minStep)*sign(d);// enforce minimum step size
    
    if(d<hitThreshold&&!hit){
      // save first hit
      hitPos=pos;
      hit=true;
    }
    
    if(d<.01){
      // sum up distance inside
      insideDist+=d;
    }
    pos+=abs(d)*rd*.35;
  }
  return hitPos;
}

void main(){
  
  vec2 uv=vec2(gl_FragCoord.x/u_resolution.x,gl_FragCoord.y/u_resolution.y);
  uv-=.5;
  uv/=vec2(u_resolution.y/u_resolution.x,1);
  
  vec3 translucentColor=vec3(length(uv),.2,.1);
  vec3 rd=normalize(vec3(uv,1));
  vec3 ro=vec3(0.,0.,-2.8);
  // trace ray
  bool hit;
  float dist;
  vec3 hitPos=traceInside(ro,rd,hit,dist);
  
  vec3 rgb=vec3(0.);
  if(hit)
  {
    // exponential fall-off:
    rgb=exp(-dist*dist*translucentColor);
  }
  else
  {
    rgb=vec3(1.);
  }
  
  gl_FragColor=vec4(pow(rgb,vec3(2.2)),1.);
}
