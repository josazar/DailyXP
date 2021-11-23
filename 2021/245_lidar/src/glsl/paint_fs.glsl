uniform float uTime;
uniform vec2 uMouse;
uniform vec2 u_resolution;
uniform float PR;

varying vec2 vUv;

void main(){
  
  vec3 color=vec3(vUv.x,vUv.y,0.);
  
  gl_FragColor=vec4(color,1.);
}
