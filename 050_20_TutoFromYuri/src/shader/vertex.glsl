

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
  vUv=uv;
  vNormal=normal;
  vPosition=position;
  
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;
}
