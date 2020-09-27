
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_2;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AA 2
#define PI 3.1415926

// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main(){
  vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  vec2 posOrigin=pos*1.025;
  pos-=.25;
  float radius=.5;
  float circle=smoothstep(radius,radius*.99,length(pos));
  vec2 pos2=pos*.85;
  vec2 posMix=mix(pos2,pos,cos(u_time)*.5+.5);
  float circle2=smoothstep(radius,radius*.9,length(pos2*1.15+random(pos)));
  float diff=circle-circle2;
  circle=smoothstep(radius,radius*.98,length(posOrigin-.05*((sin(u_time/20.)*12.))));
  
  // satellite
  pos/=.165;
  pos.x-=random(posOrigin)/10.+cos(u_time/2.)*8.;
  pos.y+=random(posOrigin)/10.+cos(u_time/2.);
  radius=.1;
  float circle3=smoothstep(radius,radius*.5,length(pos));
  diff-=circle-circle3;
  
  // satellite 2
  pos/=.85;
  pos.x*=random(posOrigin)/10.+sin(u_time/2.)*8.;
  pos.y-=random(posOrigin)/10.+sin(u_time/2.);
  radius=.21;
  float circle4=smoothstep(radius,radius*.25,length(pos));
  diff+=circle4;
  
  vec3 col=vec3(diff);
  gl_FragColor+=vec4(col,1.);
}
