const vertexShader = `
uniform mat4 textureMatrix;
varying vec4 vUv;
void main(){
  vUv=textureMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
`
export { vertexShader }
