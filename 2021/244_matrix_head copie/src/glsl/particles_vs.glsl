uniform sampler2D positions;
uniform float uPointSize;

varying float vLife;

void main(){
  vec3 pos=texture2D(positions,position.xy).xyz;
  vLife = texture2D(positions,position.xy).a;
  vec4 mvPosition=modelViewMatrix*vec4(pos,1.);

  gl_Position=projectionMatrix*mvPosition;
  gl_PointSize = uPointSize / -mvPosition.z;
}
