varying vec3 vColor;

void main(){
  vec3 col= vec3(vColor.rgb);
  // vec3 col = vec3(1.);
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  if (dot(cxy, cxy) > 1.0) discard;
  gl_FragColor=vec4(vColor, 1.);
}
