
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// VEDA GL : extension
float map(float n,float start1,float stop1,float start2,float stop2){
  return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
}

// vec2 mapvec2(float n,float start1,float stop1,float start2,float stop2){
  //   return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
// }

float map01(float n){
  return.5*n+.5;
}

float rectSDF(vec2 uv,vec2 s){
  return 2.*max(abs(uv.x/s.x),abs(uv.y/s.y));
}

vec2 rotate2d(vec2 uv,float a){
  return mat2(
    cos(a),-sin(a),
    sin(a),cos(a)
  )*uv;
}

float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec3 color=vec3(0.);
  vec2 m=u_mouse/u_resolution;
  
  float time=u_time*.5;
  
  if(fract(time)>.5){
    if(fract(uv.y*.5)>.5){
      uv.x+=fract(time)*.2;
    }else{
      uv.x-=fract(time)*.2;
    }
  }else{
    if(fract(uv.x*.5)>.5){
      uv.y+=fract(time)*.2;
    }else{
      uv.y-=fract(time)*.2;
    }
  }
  float mul=10.;
  vec2 uvGrid=fract(uv.xy*mul);
  vec2 id=floor(mul*uvGrid.xy);
  
  float circ0=circle(uv,.5);
  // uvGrid+=circ0;
  // float sdf=distance(p,vec2(.5));
  vec2 uvRotated=rotate2d(uvGrid.xy,.222228*u_time);
  
  vec2 translation=.915*vec2(
    mod(u_time,uv.x)*circ0,
    step(1.,mod(u_time,uv.x))
  );
  // float rect=rectSDF(uv.xy-.5-translation,vec2(1.));
  float size=m.x;
  float rect=rectSDF(uvRotated+translation,vec2(.95+size));
  color+=step(.85,rect);
  
  // color.rg+=uv;
  
  // debug
  // if(uvGrid.x<.01||uvGrid.y<.01){
    //   color=vec3(.5,.0,0.);
  // }
  
  gl_FragColor=vec4(color,1.);
}
