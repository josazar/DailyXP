export default /* glsl */ `
varying vec2 vUv;
varying vec3 vColor;

void main(){
  vec3 col= vec3(vColor.rgb);
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;

  if (dot(cxy, cxy) > 1.0) discard;
  gl_FragColor=vec4(col, 1.);
}
`;
