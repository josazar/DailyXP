uniform float uOpacity;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;

varying vec3 vOffset;




void main(){
  vec3 colorA=vec3(1.,.8,0.);
  float diff=1.;

  vec3 col= vec3(1.);

  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
   


  col = texture2D(texture3, uv).rgb;
  
  // Mouse interaction
   if(vOffset.x < 1.){
     // col=mix(col,colorA,1.-vOffset.x);
    col = texture2D(texture2, uv).rgb;
   }
  if(vOffset.x > 1.5){
    col = texture2D(texture1, uv).rgb;
   }

  
  
  gl_FragColor=vec4(col,uOpacity);
}
