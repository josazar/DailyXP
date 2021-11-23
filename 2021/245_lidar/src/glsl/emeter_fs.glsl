varying vec3 vCursorPos;
varying vec3 vPos;
varying vec2 vResolution;
varying vec3 vColor;
varying vec3 vOffset;

float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}

void main(){
  
  float dist=length(gl_PointCoord-vec2(.5));
  float disc=smoothstep(.5,.49,dist);
  vec3 col=vColor;
  col*=1.2;
  
  vec3 colorA=vec3(1.,.7686,0.);
  float diff=1.;
  
  // Mouse interaction
  if(vOffset.x<diff){
    col=mix(col,colorA,1.-vOffset.x);
  }

  if(col.z>disc)discard;

  gl_FragColor=vec4(col,1.);
}
