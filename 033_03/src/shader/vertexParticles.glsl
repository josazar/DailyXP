
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI=3.141592653589793238;

attribute vec3 color;
attribute float size;
varying vec3 vColor;

// varying float vSize;

void main()
{
  vUv=uv;
  vColor=color;
  vNormal=normal;
  vPosition=position;
  
  float offset=(.5+.5*sin(position.y+time/10.))*.01;
  vec3 newpos=position+normal*.02+offset*normal;
  vec4 mvPosition=modelViewMatrix*vec4(newpos,1.);
  gl_PointSize=(2.+size*10.)*(1./-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}
