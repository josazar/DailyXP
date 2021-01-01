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

vec4 Eye(vec2 uv){
  uv-=.5;
  float d=length(uv);
  vec4 irisCol=vec4(.3,.5,1.,1.);
  vec4 col=mix(vec4(1.),irisCol,S(.1,.7,d)*.5);
  
  col.rgb*=1.-S(.45,.5,d)*.5*clamp(-uv.y-uv.x,0.,1.);
  col.rgb=mix(col.rgb,vec3(0.),S(.3,.289,d));
  
  irisCol.rgb*=1.+S(.3,.05,d);
  col.rgb=mix(col.rgb,irisCol.rgb,S(.28,.24,d));
  
  col.rgb=mix(col.rgb,vec3(0.),S(.16,.14,d));
  
  float highlight=S(.1,.09,length(uv-vec2(-.15,.15)));
  highlight+=S(.07,.05,length(uv+vec2(-.08,.15)));
  col.rgb=mix(col.rgb,vec3(1.),highlight);
  
  col.a=S(.5,.489,d);
  
  return col;
}

vec4 Mouth(vec2 uv){
  uv-=.5;
  vec4 col=vec4(.5,.2,.05,1.);
  uv.y*=1.5;
  uv.y-=uv.x*uv.x*2.;
  float d=length(uv);
  col.a=S(.5,.48,d);
  
  float td=length(uv-vec2(0.,.6));
  
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

vec4 Smiley(vec2 uv){
  vec4 col=vec4(.0,0.,0.,1.);
  // mirro on x axis
  uv.x=abs(uv.x);
  
  vec4 head=Head(uv);
  vec4 eye=Eye(Within(uv,vec4(.03,-.1,.37,.25)));
  vec4 mouth=Mouth(Within(uv,vec4(-.3,-.4,.3,-.1)));
  
  col=mix(col,head,head.a);
  col=mix(col,eye,eye.a);
  col=mix(col,mouth,mouth.a);
  
  return col;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  
  vec3 col;
  
  gl_FragColor=Smiley(uv);
}
