uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
  float dist=length(gl_PointCoord-vec2(.5));
  float disc=smoothstep(.5,.35,dist);
  gl_FragColor=vec4(disc,1.);
}

