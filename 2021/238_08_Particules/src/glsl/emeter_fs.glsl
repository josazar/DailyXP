uniform sampler2D uTexture;

void main(){
  // float dist=length(gl_PointCoord-vec2(.5));
  // float disc=smoothstep(.5,.48,dist);
  vec3 color=vec3(0.);

  // if(disc<.5)discard;
  gl_FragColor=vec4(color,1.);
}
