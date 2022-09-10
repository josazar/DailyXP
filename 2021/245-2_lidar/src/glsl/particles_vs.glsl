uniform sampler2D positions; //RenderTarget containing the transformed positions
uniform float uPointSize;
uniform sampler2D colors;

varying vec3 vColor;

attribute vec3 color;

// https://barradeau.com/blog/?p=621

void main(){
  // the mesh is a normalized square so the uvs = the xy positions of the vertices
  vec3 pos=texture2D( positions, position.xy ).xyz;

  // pos now contains a 3D position in space, we can use it as a regular vertex
 
  // colors from texture
  // vColor = texture2D( colors, position.xy ).xyz;


  vColor = color;

  float pointSize = uPointSize;

  // regular projection of our position
  vec4 mvPosition = modelViewMatrix*vec4(pos,1.);
  gl_Position = projectionMatrix * mvPosition;
  // gl_PointSize = uPointSize / -mvPosition.z;
  gl_PointSize = pointSize;
  // gl_PointSize = ( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize;
}
