export default /* glsl */ `
varying vec2 vUv;
varying vec3 vColor;
varying float life;

void main(){
  vec3 col= vec3(vColor.rgb);
  vec2 cxy = 2. * gl_PointCoord - 1.0;

  if (dot(cxy, cxy) > 1.0) discard;

  gl_FragColor = vec4(col, life * .75);
}
`;
