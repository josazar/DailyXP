varying vec2 vUv;
varying vec3 vGeometryPos;

void main(){
  vUv=uv;
  vGeometryPos = position;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
