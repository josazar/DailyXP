// uniform float progress;
// uniform sampler2D texture1;
// uniform sampler2D texture2;

// uniform vec4 resolution;
// varying vec2 vUv;
// varying vec4 vPosition;

// void main(){
  //   vec2 p=-1.+4.*vUv;
  //   p=fract(p*5.);
  //   vec3 col=vec3(p.x+cos(time)*.5+.5,p.y,1.);
  
  //   gl_FragColor=vec4(col,1.);
// }

uniform float time;
uniform samplerCube tCube;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main(){
  
  vec4 reflectedColor=textureCube(tCube,vec3(-vReflect.x,vReflect.yz));
  vec4 refractedColor=vec4(1.);
  
  refractedColor.r=textureCube(tCube,vec3(-vRefract[0].x,vRefract[0].yz)).r;
  refractedColor.g=textureCube(tCube,vec3(-vRefract[1].x,vRefract[1].yz)).g;
  refractedColor.b=textureCube(tCube,vec3(-vRefract[2].x,vRefract[2].yz)).b;
  
  gl_FragColor=mix(refractedColor,reflectedColor,clamp(vReflectionFactor,0.,1.));
  
}
