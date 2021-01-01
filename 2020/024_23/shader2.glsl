// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(float n){return fract(sin(n)*43758.5453123);}
float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}
float noise(float p){
  float fl=floor(p);
  float fc=fract(p);
  return mix(rand(fl),rand(fl+1.),fc);
}

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
  vec4 K=vec4(1.,2./3.,1./3.,3.);
  vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
  return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

float manh_distance(vec2 a,vec2 b){
  vec2 c=abs(a-b);
  return c.x+c.y;
}

float pyramids(vec2 p)
{
  vec2 n=floor(p);
  vec2 f=fract(p);
  float mind=2.;
  for(int i=-1;i<2;i++)
  for(int j=-1;j<2;j++)
  {
    vec2 off=vec2(i,j);
    vec2 top=vec2(rand(n+off),rand(n+off+234.1));
    float dist=manh_distance(f,top+off);
    if(dist<mind){
      mind=dist;
    }
  }
  return(2.-mind)/2.;
}

#define SQ3 1.7320508076

mat2 rot2d(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}

vec2 p6mmmap(vec2 uv,float repeats){
  // clamp to a repeating box width 6x height 2x*sqrt(3)
  uv.x/=SQ3;
  uv=fract(uv*repeats-.5)-.5;
  uv.x*=SQ3;
  
  uv=abs(uv);
  
  vec2 st=uv;
  
  vec2 uv330=rot2d(radians(330.))*uv;
  if(uv330.x<0.){
    st.y=(st.y-.5)*-1.;
    st.x*=SQ3;
    return st*2.;
  }
  else if(uv330.x>.5){
    st.x=(st.x-.5*SQ3)*-1.*SQ3;
    return st*2.;
  }
  
  vec2 uv30=rot2d(radians(30.))*uv;
  if(uv30.y<0.&&uv30.x>=.5)st=vec2(1.,1.);
  else if(uv30.y>=0.&&uv30.x>=.5)st=vec2(-1.,1.);
  else if(uv30.y<0.&&uv30.x<.5)st=vec2(1.,-1.);
  else st=vec2(-1.,-1.);
  
  uv30.x=uv30.x-.5;
  uv=rot2d(radians(270.))*uv30;
  st=uv*st;
  st.x*=SQ3;
  return st*2.;
}

float uc(float a){return clamp(a,0.,1.);}
float ns(float a,float t){return noise(a+t);}

vec3 square_noise(vec2 uv,float t){
  // 3 octaves of manhattan distance worley noise
  float p1=ns(pyramids(uv)*15.,t);
  float p2=ns(pyramids(uv+135.)*31.,t);
  float p3=ns(pyramids(uv+25.)*63.,t);
  
  float v=uc((p1*p2*p3-.09)*41.);
  
  vec3 res=hsv2rgb(vec3(uc(uc(p3)-.2),uc(uc(p2)-.2),v));
  
  return res;
}

vec4 animate_noise(vec2 uv,float t){
  return vec4(square_noise((rot2d(radians(t*12.7))*(uv-.25)+.25)+t*.06,t*.2),1.);
}

void main(){
  // scale fragCoord to 0 centered, resolution independent square coords
  vec2 uv=gl_FragCoord.xy/u_resolution.xy-.5;
  uv.x*=u_resolution.x/u_resolution.y;
  uv*=u_resolution.x/2000.;
  
  vec2 m=u_mouse.xy/u_resolution.xy;
  m-=.5;
  uv-=m*(.25-dot(uv,uv));
  uv=p6mmmap(uv,2.)*.65;
  
  float t=floor(u_mouse.x/10.)*4.+4.*u_resolution.x/10.*floor(u_mouse.y/10.)-100000.;
  gl_FragColor=animate_noise(uv,t>-1000.?t:u_time);
  
}
