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

float DrawPoint(vec3 ro,vec3 rd,vec3 p,float size){
  float d=DistLine(ro,rd,p);
  d=S(size,size*.9,d);
  return d;
}
void main(){
  float t=u_time;
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  // camera position Ray Origin x,y,z
  vec3 ro=vec3(3.*sin(t),2.*cos(t),-10.*cos(t/2.));
  
  // camera cible ce point
  vec3 lookAt=vec3(.5);
  // vecteurs dont nous avons besoin pour la rotation
  float zoom=.75;
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
  vec3 col=vec3(0.);
  const float amount=10.;
  float offset=.25;
  for(float x=0.;x<amount;x++){
    for(float y=0.;y<amount;y++){
      for(float z=0.;z<amount;z++){
        float noiseVal=((sin(y/5.+t*3.)+1.)/40.)*.8;
        d+=DrawPoint(ro,rd,vec3(offset*x,offset*y,offset*z),noiseVal);
      }
    }
  }
  // d*=vec4(0.2,0.2,0.2,1.);
  col=vec3(d)*vec3(.7137,.2588,.651);
  gl_FragColor=vec4(col,1.);
}
