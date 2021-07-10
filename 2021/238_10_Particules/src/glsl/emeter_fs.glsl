
varying vec2 vMouse;
varying vec2 vUv;
varying vec2 vResolution;


float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
  // vec2 st = gl_FragCoord.xy/vResolution.xy;
  // st.x *= vResolution.x/vResolution.y;
  vec3 color = vec3(circle( vec2(0.8) ,0.81));

  // vec3 color = vec3(vMouse.x);
  // vec3 color = vec3(circle(-vMouse + vUv,0.01));
  // color += vec3(vUv.x);

  gl_FragColor=vec4(color,1.);
}
