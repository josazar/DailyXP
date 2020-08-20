
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
float hash(in float n)
{
  return fract(sin(n)*43758.5453);
}

mat2 rotate2d(float angle){
  return mat2(cos(angle),-sin(angle),
  sin(angle),cos(angle));
}
float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}
float noise(in vec2 p)
{
  vec2 i=floor(p);
  vec2 f=fract(p);
  f=f*f*(3.-2.*f);
  float n=i.x+i.y*27.;
  return mix(mix(hash(n+0.),hash(n+1.),f.x),
  mix(hash(n+27.),hash(n+28.),f.x),f.y);
}
float lines(in vec2 pos,float b){
  float scale=10.;
  pos*=scale;
  return smoothstep(0.,
    .5+b*.5,
    abs((sin(pos.x*3.1415)+b*2.))*.5);
  }
  
  // Cellular noise ("Worley noise") in 2D in GLSL.
  // Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
  // This code is released under the conditions of the MIT license.
  // See LICENSE file for details.
  
  // Permutation polynomial: (34x^2 + x) mod 289
  vec4 permute(vec4 x){
    return mod((34.*x+1.)*x,289.);
  }
  
  // Cellular noise, returning F1 and F2 in a vec2.
  // Speeded up by using 2x2 search window instead of 3x3,
  // at the expense of some strong pattern artifacts.
  // F2 is often wrong and has sharp discontinuities.
  // If you need a smooth F2, use the slower 3x3 version.
  // F1 is sometimes wrong, too, but OK for most purposes.
  vec2 cellular2x2(vec2 P){
    #define K.142857142857// 1/7
    #define K2.0714285714285// K/2
    #define jitter.8// jitter 1.0 makes F1 wrong more often
    vec2 Pi=mod(floor(P),289.);
    vec2 Pf=fract(P);
    vec4 Pfx=Pf.x+vec4(-.5,-1.5,-.5,-1.5);
    vec4 Pfy=Pf.y+vec4(-.5,-.5,-1.5,-1.5);
    vec4 p=permute(Pi.x+vec4(0.,1.,0.,1.));
    p=permute(p+Pi.y+vec4(0.,0.,1.,1.));
    vec4 ox=mod(p,7.)*K+K2;
    vec4 oy=mod(floor(p*K),7.)*K+K2;
    vec4 dx=Pfx+jitter*ox;
    vec4 dy=Pfy+jitter*oy;
    vec4 d=dx*dx+dy*dy;// d11, d12, d21 and d22, squared
    // Sort out the two smallest distances
    #if 0
    // Cheat and pick only F1
    d.xy=min(d.xy,d.zw);
    d.x=min(d.x,d.y);
    return d.xx;// F1 duplicated, F2 not computed
    #else
    // Do it right and find both F1 and F2
    d.xy=(d.x<d.y)?d.xy:d.yx;// Swap if smaller
    d.xz=(d.x<d.z)?d.xz:d.zx;
    d.xw=(d.x<d.w)?d.xw:d.wx;
    d.y=min(d.y,d.z);
    d.y=min(d.y,d.w);
    return sqrt(d.xy);
    #endif
  }
  void main(){
    vec2 st=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
    vec2 pos=st.yx*vec2(1,2.2);
    float pattern=st.y;
    vec2 F=cellular2x2(pos*5.);
    float a=dot(pos,st)-u_time*.1;
    float ni=step(abs(sin(a*1.1415*5.)),F.y*.4);
    // Add noise
    float n=noise(st*200.);
    pos=rotate2d(n/10.+cos(u_time)/10.)*pos;
    pattern=step(lines(pos,.925),.42);
    float hash=hash(100.);
    // couleur
    vec3 col=vec3(pattern);
    col=mix(col,vec3(.8471,.1333,.1333),0.);
    col+=vec3(ni,ni,ni);
    gl_FragColor=vec4(col,1.);
  }
  