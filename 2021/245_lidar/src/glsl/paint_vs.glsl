varying vec2 vUv;


void main(){
  vUv = uv;

  vec3 pos = position;

  vec4 mvPosition = modelViewMatrix * vec4(pos,1.);
  gl_Position = projectionMatrix * mvPosition;
}
