
uniform float u_time;
uniform float u_lerp;
uniform float u_swirlStep;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionA;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vColorA;
varying float vIndex;
varying float vSpeed;
varying float vPhytoncide;
varying float vModulo;

attribute vec3 color;
attribute vec3 colorA;
attribute float size;
attribute vec3 positionA;
attribute float pindex;
attribute float speed;
attribute float phytoncide;// 0 ou  1

float PI=3.141592653589793238;
float effectRadius=.5;
float effectAngle=2.*PI;

vec3 swirl(vec3 p,float i,float dist){
  vec3 pSwirl=vec3(p.x+cos(u_time+i)/dist,p.y,p.z+sin(u_time+i)/dist);
  return pSwirl;
}

void main()
{
  vUv=uv;
  vColor=color;
  vColorA=colorA;
  vNormal=normal;
  vPosition=position;
  vPositionA=positionA;
  vIndex=pindex;
  vPhytoncide=phytoncide;
  vSpeed=clamp(speed,.5,.8);
  
  // first model position
  vPosition.y+=cos(u_time+vIndex)*size/60.*(1.-phytoncide)+.1;
  // Second model position
  vPositionA.y+=cos(u_time+vIndex)*size/60.*(1.-phytoncide)+.13;
  vPositionA.x-=.5;
  
  // phytoncide
  // --------------------------------
  vModulo=mod(u_time/(55.*(1.05-speed)),1.);
  float t=mix(1.,vModulo,vPhytoncide);
  // 1er morph target
  float offsetY=vPosition.y+t;
  // swirl
  vec3 pSwirl=mix(vPosition,swirl(vPosition,pindex,2.),u_swirlStep+.05);
  vPosition=mix(vPosition,pSwirl,phytoncide);
  vPosition.y=mix(vPosition.y,offsetY,phytoncide);
  // 2ieme morph target
  offsetY=vPositionA.y+.5*t;
  pSwirl=mix(vPositionA,swirl(vPositionA,pindex,2.),u_swirlStep+.05);
  vPositionA=mix(vPositionA,pSwirl,phytoncide);
  vPositionA.y=mix(vPositionA.y,offsetY,phytoncide);
  // --------------------------------------
  // end phytoncide
  
  vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.);
  vec4 mvPositionA=modelViewMatrix*vec4(vPositionA,1.);
  mvPosition=mix(mvPosition,mvPositionA,u_lerp);
  float phytoncideSize=(size*15.)*(1./-mvPosition.z);
  gl_PointSize=mix((5.+size*6.)*(1./-mvPosition.z),phytoncideSize,phytoncide);
  gl_Position=projectionMatrix*mvPosition;
}
