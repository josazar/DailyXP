
varying vec2 vMouse;
varying vec3 vPos;
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
  // vec3 color = vec3();

  // vec3 color = vec3(vMouse.x);
  vec3 color = vec3(circle(-vMouse + vPos.xy,5.5));
  color += vec3(vPos.x * .25, .0, .84);

  gl_FragColor=vec4(color,1.);
}
