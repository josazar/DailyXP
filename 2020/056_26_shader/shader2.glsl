
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

vec2 brickTile(vec2 _st,float _zoom){
  _st*=_zoom;
  
  // Here is where the offset is happening
  _st.y+=step(1.,mod(_st.x,3.))*1.;
  
  return fract(_st);
}

vec2 random2(vec2 st){
  st=vec2(dot(st,vec2(127.1,311.7)),
  dot(st,vec2(269.5,183.3)));
  return-1.+2.*fract(sin(st)*43758.5453123);
}
// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st){
  vec2 i=floor(st);
  vec2 f=fract(st);
  
  vec2 u=f*f*(3.-2.*f);
  
  return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
  dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
  mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
  dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

float box(in vec2 _st,in vec2 _size){
  _size=vec2(.5)-_size*.5;
  vec2 uv=smoothstep(_size,
    _size+vec2(.001),
  _st);
  uv*=smoothstep(_size,
    _size+vec2(.001),
    vec2(1.)-_st);
    return uv.x*uv.y;
  }
  
  void main(){
    vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
    pos=gl_FragCoord.xy/u_resolution.xy;
    vec3 color_A=vec3(.036,.722,.790);
    vec3 color_B=vec3(.7882,.0353,.6627);
    vec3 color_C=vec3(.9725,.8353,.0667);
    vec3 color_D=vec3(0.,1.,.4157);
    
    vec3 col=vec3(0.);
    pos.x=noise(pos);
    
    // pos = brickTile(pos,2.0);
    float modulo=mod(u_time/3.,1.);
    pos.y-=modulo-.12;
    // pos=scale(vec2(1.,(cos(u_time)*.5+.5)*10.))*pos;
    float light=box(pos,vec2(.005,.2));
    col=mix(col,color_A,light);
    
    // light 2
    pos+=.2;
    light=box(pos,vec2(.005,.2));
    col=mix(col,color_B,light);
    
    // light3
    pos+=.2;
    light=box(pos,vec2(.005,.2));
    col=mix(col,color_C,light);
    
    // light4
    pos.x-=.12;
    light=box(pos,vec2(.005,.2));
    col=mix(col,color_D,light);
    
    for(int i=0;i<12;i++){
      // posOrigin.x-=rand(1.);
      // pos.x-=float(i);
      pos.x-=.01*float(i);
      pos.y-=float(i)/100.;
      light=box(pos,vec2(.005,.2));
      
      col=mix(col,color_D,light);
      
    }
    
    // col+=vec3(pos.x,pos.y,0.);
    gl_FragColor+=vec4(col,1.);
  }
  