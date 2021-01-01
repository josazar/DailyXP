//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926
#define S smoothstep

float remap(float a,float b,float t){
  float x=(t-a)/(b-a);
  return clamp(x,0.,1.);
}

// me permet de calculer la distance d'un point en 3D
float DistLine(vec3 ro,vec3 rd,vec3 p)
{
  return length(cross(p-ro,rd))/length(rd);
}

float DrawPoint(vec3 ro,vec3 rd,vec3 p,float size)
{
  float d=DistLine(ro,rd,p);
  d=S(size,size*.99,d);
  return d;
}

void main(){
  float t=u_time;
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  // camera position Ray Origin x,y,z
  vec3 ro=vec3(2.*sin(t),2.*sin(t),-4.);
  // camera va voir ce point
  vec3 lookAt=vec3(.0,.0,0.);
  // vecteurs dont nous avons besoin pour la rotation
  float zoom=1.;
  vec3 f=normalize(lookAt-ro);
  vec3 r=normalize(cross(vec3(0.,1.,0.),f));
  vec3 u=cross(f,r);
  // center of the screen
  vec3 c=ro+f*zoom;
  vec2 uv2=uv;
  // deformation
  vec2 offs=vec2(sin(t+uv.y*25.),sin(t+uv.y*5.));
  offs*=.01;
  uv+=offs;
  // intersection
  vec3 i=c+uv.x*r+uv.y*u;
  // intersection sans la deformation
  // Ray direction
  vec3 rd=i-ro;
  //Draw
  float d=0.;
  float size=cos(t)*.5+.5;
  d+=DrawPoint(ro,rd,vec3(0.,0.,.0),size*.12+.25);
  const float count=64.;
  float golden_angle=PI*2./((1.+sqrt(5.))/2.);
  float angle,x,y,radius;
  
  // ce genre de boucle ralentit grave le shader, pas le bon angle à mon avis pour du shader
  for(float i=0.;i<count;i++){
    angle=i*golden_angle;
    radius=sqrt(i/count)*min(3.,3.)/2.5;
    x=cos(angle)*radius;
    y=sin(angle)*radius;
    
    float noiseVal=((sin(i/5.+t*3.)+1.)/40.)*.8;
    d+=DrawPoint(ro,rd,vec3(x,y,0.),noiseVal);
  }
  
  float pct=distance(uv,vec2(-.25));
  d+=pct*.4;
  // uv.y=pow(uv.x,5.);
  pct=distance(uv,vec2(.25));
  d+=pct*.4;
  
  gl_FragColor=vec4(d,.3,.45,1.);
}
