export default /* glsl */ `

uniform sampler2D texturePosition; //RenderTarget containing the transformed positions
uniform sampler2D textureColor;  //RenderTarget containing the transformed colors

uniform float uPointSize;

varying vec2 vUv;
varying vec3 vColor;
varying float life;

attribute vec2 reference;   // the xy positions of the vertices

void main(){
  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vUv = reference;
  vColor = texture( textureColor, reference ).xyz;
  vec4 pos = texture( texturePosition, reference );
  
  // Life
  life = 1. - ( pos.a / 1000. );

  if( pos.a == 0. ) life = 0.;

  // regular projection of our position
  vec4 mvPosition = modelViewMatrix * vec4(pos.xyz,1.);
  
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize / -mvPosition.z  ;
}

`;
