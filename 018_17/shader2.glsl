//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926
#define S smoothstep

// me permet de calculer la distance d'un point en 3D
float DistLine(vec3 ro,vec3 rd,vec3 p){
  return length(cross(p-ro,rd))/length(rd);
}

float DrawPoint(vec3 ro,vec3 rd,vec3 p){
  float d=DistLine(ro,rd,p);
  d=S(.04,.035,d);
  return d;
}
void main(){
  float t=u_time;
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  // camera position Ray Origin x,y,z
  vec3 ro=vec3(3.*sin(t),2.,-4.*cos(t));
  
  // camera va voir ce point
  vec3 lookAt=vec3(.5);
  // vecteurs dont nous avons besoin pour la rotation
  float zoom=1.;
  vec3 f=normalize(lookAt-ro);
  vec3 r=normalize(cross(vec3(0.,1.,0.),f));
  vec3 u=cross(f,r);
  // center of the screen
  vec3 c=ro+f*zoom;
  // intersection
  vec3 i=c+uv.x*r+uv.y*u;
  // Ray direction
  vec3 rd=i-ro;
  float d=0.;
  
  d+=DrawPoint(ro,rd,vec3(0.,0.,.5));
  d+=DrawPoint(ro,rd,vec3(0.,1.,.5));
  d+=DrawPoint(ro,rd,vec3(1.,1.,.5));
  d+=DrawPoint(ro,rd,vec3(1.,0.,.5));
  d+=DrawPoint(ro,rd,vec3(.5,0.,1.));
  d+=DrawPoint(ro,rd,vec3(.5,1.,1.));
  d+=DrawPoint(ro,rd,vec3(.5,1.,0.));
  d+=DrawPoint(ro,rd,vec3(.5,0.,0.));
  d+=DrawPoint(ro,rd,vec3(0.,.5,1.));
  d+=DrawPoint(ro,rd,vec3(1.,.5,1.));
  d+=DrawPoint(ro,rd,vec3(1.,.5,0.));
  d+=DrawPoint(ro,rd,vec3(0.,.5,0.));
  d+=DrawPoint(ro,rd,vec3(0.,0.,0.));
  d+=DrawPoint(ro,rd,vec3(0.,0.,1.));
  d+=DrawPoint(ro,rd,vec3(0.,1.,0.));
  d+=DrawPoint(ro,rd,vec3(0.,1.,1.));
  d+=DrawPoint(ro,rd,vec3(0.,0.,1.));
  d+=DrawPoint(ro,rd,vec3(1.,0.,0.));
  d+=DrawPoint(ro,rd,vec3(1.,0.,1.));
  d+=DrawPoint(ro,rd,vec3(1.,1.,0.));
  d+=DrawPoint(ro,rd,vec3(1.,1.,1.));
  
  gl_FragColor=vec4(d);
}
