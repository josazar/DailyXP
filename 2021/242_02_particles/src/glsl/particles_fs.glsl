uniform float uOpacity;

varying vec3 vOffset;

void main(){
  vec3 colorA=vec3(1.,.8,0.);
  float diff=1.;

  vec3 col= vec3(1.);

  
  // Mouse interaction
  if(vOffset.x<diff){
    col=mix(col,colorA,1.-vOffset.x);
  }
  
  // gl_FragColor = vec4(vec3(1.0), 0.25);
  gl_FragColor=vec4(col,uOpacity);
}
