
//https://www.shadertoy.com/view/Wl2SWG

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  
  vec2 uv=(gl_FragCoord.xy*2.-u_resolution)/min(u_resolution.x,u_resolution.y);
  // uv.x+=sin(u_time)+cos(u_time*2.1);
  // uv.y+=cos(u_time)+sin(u_time*1.6);
  vec3 col=vec3(0.);
  vec2 translate=vec2(-.5,.5);
  // uv+=translate;
  const int count=30;
  for(int i=0;i<count;i++){
    float radius=.6;
    float rad=radians(360./float(count))*float(i);
    col+=.003/length((uv+vec2(radius*cos(rad*cos(u_time)),radius*sin(rad+cos(u_time)))));
  }
  // col+= 0.02/length(uv);
  col+=.1*(abs(sin(u_time))+.1)/length(uv)/2.;
  gl_FragColor=vec4(col,1.);
}
