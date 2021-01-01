//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926

float Circle(vec2 uv,vec2 p,float r,float blur){
  float d=length(uv-p);
  float c=smoothstep(r,r-blur,d);
  return c;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;// toujours bien scalé
  
  float c,c2,c3;
  vec2 pos;
  vec3 col=vec3(.6,.25,.4627);
  float x=uv.x;
  float m=-sin(u_time+x*15.*(cos(u_time)*.5+.5))*.1;
  float y=uv.y-m;
  x+=.2*cos(u_time)*y;
  
  float ellipse=Circle(vec2(x,y),vec2(0.,-.1),.25+y*.22,.02);
  ellipse-=Circle(vec2(x,y),vec2(0.,-.099),.245+y*.22,.002);
  
  float blur=.08;
  float ellipse2=Circle(vec2(x,y),vec2(0.,-.1),.22+y*.2,blur);
  ellipse2-=Circle(vec2(x,y),vec2(0.,-.099),.23+y*.24,blur);
  
  col+=vec3(ellipse);
  col-=vec3(ellipse2);
  gl_FragColor=vec4(col,1.);
}
