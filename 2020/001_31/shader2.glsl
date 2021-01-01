
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_2;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AA 2
#define PI 3.1415926

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

vec2 map(in vec2 p,in float time)
{
  for(int i=0;i<4;i++)
  {
    float a=noise(p*1.5)*3.*PI+time*3.;
    p+=.1*vec2(cos(a),sin(a));
  }
  return p;
}

float height(in vec2 p,in vec2 q)
{
  float h=dot(p-q,p-q);
  h+=.01*texture2D(u_texture_2,p).y;
  return h;
}

void main(){
  float time=.35*u_time;
  
  vec3 tot=vec3(0.);
  #if AA>1
  for(int m=0;m<AA;m++)
  
  for(int n=0;n<AA;n++)
  {
    vec2 o=vec2(float(m),float(n))/float(AA)-.5;
    vec2 p=(3.*(gl_FragCoord.xy+o)-u_resolution.xy)/u_resolution.x;
    #else
    vec2 p=(3.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
    #endif
    
    // deformation
    vec2 q=map(p,time);
    // color
    float w=.5*q.y;
    
    float u=ceil(w);
    float f=fract(w);
    vec3 col=vec3(.5,.6039,.95)+.03*cos(3.*u+vec3(.05,.8,2.));
    
    // filtered drop-shadow
    float sha=smoothstep(0.,.35,f);
    
    // normal
    vec2 eps=vec2(2./u_resolution.x,0.);
    float l2c=height(q*1.004,p);
    float l2x=height(map(p,time),p)-l2c;
    float l2y=height(map(p+eps.yx,time),p)-l2c;
    vec3 nor=normalize(vec3(l2x,eps.x,l2y));
    
    // lighting
    col*=.43+.7*sha;
    col*=.8+.2*vec3(1.,.9,.3)*dot(nor,vec3(.8314,.051,.8588));
    col+=.3*pow(nor.y,8.)*sha;
    col*=7.5*l2c;
    
    tot+=col;
    #if AA>1
  }
  tot/=float(AA*AA);
  #endif
  
  gl_FragColor=vec4(tot,1.);
}
