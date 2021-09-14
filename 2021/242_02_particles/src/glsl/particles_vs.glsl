uniform sampler2D positions;
uniform float uPointSize;
uniform vec3 uCursorPos;

varying vec3 vOffset;

void main(){
  vec3 pos=texture2D(positions,position.xy).xyz;

  vOffset=vec3(distance(pos,uCursorPos));

  float pointSize = uPointSize;

  if(vOffset.x<1.){
    pointSize=mix(pointSize,pointSize*6.,1.-vOffset.x);
  }
  
  vec4 mvPosition=modelViewMatrix*vec4(pos,1.);
  gl_Position=projectionMatrix*mvPosition;
  gl_PointSize = uPointSize / -mvPosition.z;
  // gl_PointSize=pointSize;
}
