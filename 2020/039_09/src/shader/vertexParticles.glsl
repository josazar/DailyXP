
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI=3.141592653589793238;

attribute vec3 color;
attribute float size;
varying vec3 vColor;

void main()
{
  vUv=uv;
  vColor=color;
  vNormal=normal;
  vPosition=position;
  
  float offset=(.5+.5*sin(position.y+time)/4.)*1.25;
  vec3 newpos=position+normal*.02+offset*normal;
  newpos.y+=cos(time)*.1;
  vec4 mvPosition=modelViewMatrix*vec4(newpos,1.);
  gl_PointSize=(4.+size*14.)*(1./-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}
