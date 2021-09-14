uniform sampler2D positions;
uniform float uPointSize;
uniform vec3 uCursorPos;

varying vec3 vOffset;
varying float vLife;

void main(){
  vec3 pos=texture2D(positions,position.xy).xyz;
  vOffset=vec3(distance(pos,uCursorPos));
  vLife = texture2D(positions,position.xy).a;
  vec4 mvPosition=modelViewMatrix*vec4(pos,1.);

  gl_Position=projectionMatrix*mvPosition;
  gl_PointSize = uPointSize / -mvPosition.z;
  // gl_PointSize=pointSize;
}
