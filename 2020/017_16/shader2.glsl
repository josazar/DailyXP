//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926
#define S smoothstep
#define sat(x)clamp(x,0.,1.)

float Circle(vec2 uv,vec2 p,float r,float blur){
  float d=length(uv-p);
  float c=smoothstep(r,r-blur,d);
  return c;
}
float remap01(float a,float b,float t){
  float x=(t-a)/(b-a);
  return clamp(x,0.,1.);
}

float remap(float a,float b,float c,float d,float t){
  float x=((t-a)/(b-a))*(d-c)+c;
  return clamp(x,0.,1.);
}

vec2 Within(vec2 uv,vec4 rect){
  return(uv-rect.xy)/(rect.zw-rect.xy);
}

vec4 Eye(vec2 uv,float side,vec2 m,float smile){
  uv-=.5;
  uv.x*=side;
  float d=length(uv);
  vec4 irisCol=vec4(.3,.5,1.,1.);
  vec4 col=mix(vec4(1.),irisCol,S(.1,.7,d)*.5);
  col.a=S(.5,.48,d);
  
  col.rgb*=1.-S(.45,.5,d)*.5*clamp(-uv.y-uv.x*side,0.,1.);
  
  d=length(uv-m*.5);
  col.rgb=mix(col.rgb,vec3(0.),S(.3,.289,d));
  
  // iris
  irisCol.rgb*=1.+S(.3,.05,d);
  float irisMask=S(.28,.24,d);
  col.rgb=mix(col.rgb,irisCol.rgb,irisMask);
  // pupille
  d=length(uv-m*.6);
  float pupilSize=mix(.4,.16,smile);
  float pupilMask=S(pupilSize,pupilSize*.9,d);
  pupilMask*=irisMask;
  col.rgb=mix(col.rgb,vec3(0.),pupilMask);
  
  float t=u_time*4.;
  vec2 offs=vec2(sin(t+uv.y*25.),sin(t+uv.y*25.));
  offs*=.01*(1.-smile);
  uv+=offs;
  
  float highlight=S(.1,.091,length(uv-vec2(-.15,.15)));
  highlight+=S(.07,.06,length(uv+vec2(-.08,.15)));
  col.rgb=mix(col.rgb,vec3(1.),highlight);
  
  return col;
}

vec4 Brow(vec2 uv){
  float y=uv.y;
  uv.y+=uv.x*.8-.3;
  // uv.x-=.1;
  uv-=.5;
  
  vec4 col=vec4(0.);
  
  float blur=.1;
  
  float d1=length(uv);
  float s1=S(.45,.45-blur,d1);
  float d2=length(uv-vec2(.1,-.2)*.7);
  float s2=S(.5,.5-blur,d2);
  
  float browMask=clamp(s1-s2,0.,1.);
  float colMask=remap01(.7,.8,y)*.75;
  colMask*=S(.6,.9,browMask);
  vec4 browCol=vec4(.4,.2,.2,1.);
  uv.y+=.15*.5;
  // blur += mix(.0, .1, smile);
  d1=length(uv);
  s1=S(.45,.45-blur,d1);
  d2=length(uv-vec2(.1,-.2)*.7);
  s2=S(.5,.5-blur,d2);
  float shadowMask=sat(s1-s2);
  
  col=mix(col,vec4(0.,0.,0.,1.),S(.0,1.,shadowMask)*.5);
  
  col=mix(col,browCol,S(.2,.4,browMask));
  
  return col;
}

vec4 Mouth(vec2 uv,float smile){
  uv-=.5;
  vec4 col=vec4(.5,.2,.05,1.);
  uv.y*=1.5;
  uv.y-=uv.x*uv.x*2.*smile;
  
  uv.x*=mix(2.5,1.,smile);
  float d=length(uv);
  col.a=S(.5,.48,d);
  
  vec2 tUv=uv;
  tUv.y+=(abs(uv.x)*.5+.1)*(1.-smile);
  float td=length(tUv-vec2(0.,.6));
  
  vec3 toothCol=vec3(1.)*S(.6,.35,d);
  
  col.rgb=mix(col.rgb,toothCol,S(.4,.37,td));
  
  td=length(uv+vec2(0.,.5));
  col.rgb=mix(col.rgb,vec3(1.,.5,.5),S(.5,.2,td));
  return col;
}

vec4 Head(vec2 uv){
  vec4 col=vec4(.9,.65,.1,1.);
  
  float d=length(uv);
  col.a=S(.5,.498,d);
  
  float edgeShade=remap01(.35,.5,d);
  edgeShade*=edgeShade;
  col.rgb*=1.-edgeShade*.5;
  
  col.rgb=mix(col.rgb,vec3(.6,.3,.1),S(.479,.48,d));
  
  float highlight=S(.41,.405,d)*.75;
  highlight*=remap(.41,-.1,.75,0.,uv.y);
  highlight*=S(.18,.19,length(uv-vec2(.21,.08)));
  col.rgb=mix(col.rgb,vec3(1.,.9804,.9686),highlight);
  
  d=length(uv-vec2(.25,-.2));
  float cheek=S(.2,.01,d)*.4;
  cheek*=S(.17,.16,d);
  col.rgb=mix(col.rgb,vec3(1.,.1,.1),cheek);
  
  return col;
}

vec4 Smiley(vec2 uv,vec2 m,float smile){
  vec4 col=vec4(.0,0.,0.,1.);
  // mirro on x axis
  float side=sign(uv.x);
  uv.x=abs(uv.x);
  
  vec4 head=Head(uv);
  vec4 eye=Eye(Within(uv,vec4(.03,-.1,.37,.25)),side,m,smile);
  vec4 mouth=Mouth(Within(uv,vec4(-.3,-.4,.3,-.1)),smile);
  vec4 brow=Brow(Within(uv,vec4(.03,.2,.4,.45)));
  
  col=mix(col,head,head.a);
  col=mix(col,eye,eye.a);
  col=mix(col,mouth,mouth.a);
  col=mix(col,brow,brow.a);
  
  return col;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  vec2 m=u_mouse.xy/u_resolution.xy;
  m-=.5;
  vec3 col;
  
  // effet de déformation
  uv-=m*(.25-dot(uv,uv));
  
  float smile=cos(u_time)*.5+.5;
  gl_FragColor=Smiley(uv,m,smile);
}
