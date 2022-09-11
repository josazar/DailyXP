export default /* glsl */ `

uniform sampler2D texturePosition; //RenderTarget containing the transformed positions
uniform sampler2D textureVelocity; //RenderTarget containing the transformed velocity
uniform sampler2D colorTexture;  //RenderTarget containing the transformed colors

uniform float uPointSize;

varying vec2 vUv;
varying vec3 vColor;

attribute vec2 reference;   // the xy positions of the vertices

void main(){
  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vUv = reference;
  vColor = texture( colorTexture, reference ).xyz;
  vec3 pos = texture( texturePosition, reference ).xyz;
  
  vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);

  //pos += velocity;


  // regular projection of our position
  vec4 mvPosition = modelViewMatrix * vec4(pos,1.);
  
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize / -mvPosition.z  ;
}

`;
