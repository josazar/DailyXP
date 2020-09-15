uniform float u_time;
uniform float u_lerp;
uniform float u_progress;
uniform vec4 u_resolution;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionA;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vColorA;
varying float vIndex;
varying float vPhytoncide;
varying float vSpeed;
varying float vModulo;

float PI=3.141592653589793238;

// Simplex 2D noise
//
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}

float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,
  -.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1;
  i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))
  +i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),
  dot(x12.zw,x12.zw)),0.);
  m=m*m;
  m=m*m;
  vec3 x=2.*fract(p*C.www)-1.;
  vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

void main(){
  float t=mix(1.,1.-vModulo,vPhytoncide);
  float noise=snoise(vNormal.xz*25.+vec2(u_time/55.+vIndex));
  float dist=length(gl_PointCoord-vec2(.5));
  float disc=smoothstep(.5,.49,dist);
  // addititve blending if Phytoncide
  
  // morph
  vec3 col=mix(vColor,vColorA,u_lerp);
  col=mix(col,vec3(1,.6,1)*vPhytoncide,.45);
  col*=1.5;
  gl_FragColor=vec4(col,disc*.7*t);
  if(disc<.001)discard;
}

