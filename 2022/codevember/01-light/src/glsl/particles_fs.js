export default /* glsl */ `
varying vec2 vUv;
varying vec3 vColor;
varying float life;

void main(){
  vec3 col= vec3(vColor.rgb);
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;


  if (dot(cxy, cxy) > 1.0) discard;


  // TODO 
  // float depth = gl_FragCoord.z;
  // gl_FragColor = vec4(vColor, 1.0 - depth);
  // Check that https://github.com/mrdoob/three.js/issues/13749

  gl_FragColor = vec4(col, life * .75);
}
`;
