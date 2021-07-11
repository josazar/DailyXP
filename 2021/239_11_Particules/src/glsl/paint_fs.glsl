uniform float uTime;
uniform vec2 uMouse;
uniform vec2 u_resolution;
uniform float PR;

varying vec2 vUv;



float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}
void main(){
  // vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // st.x *= u_resolution.x/u_resolution.y;

  vec3 color = vec3(circle(-uMouse + vUv,0.01));
  color += vec3(vUv.x, vUv.y, 0.);

  gl_FragColor=vec4(color,1.);
}
