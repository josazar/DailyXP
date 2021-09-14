uniform sampler2D positions;// Data Texture containing original positions
uniform float uTime;
uniform float uSpeed;
uniform float uCurlFreq;
uniform vec3 uCursorPos;

varying vec2 vUv;
varying vec3 vGeometryPos;

#define PI 3.1415926538

// #pragma glslify:curl=require('glsl-curl-noise')
// #pragma glslify:noise=require('glsl-noise/classic/3d')

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
  return t*t*t*(t*(t*6.-15.)+10.);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0=floor(P);// Integer part for indexing
  vec3 Pi1=Pi0+vec3(1.);// Integer part + 1
  Pi0=mod289(Pi0);
  Pi1=mod289(Pi1);
  vec3 Pf0=fract(P);// Fractional part for interpolation
  vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz;
  vec4 iz1=Pi1.zzzz;
  
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);
  vec4 ixy1=permute(ixy+iz1);
  
  vec4 gx0=ixy0*(1./7.);
  vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);
  gy0-=sz0*(step(0.,gy0)-.5);
  
  vec4 gx1=ixy1*(1./7.);
  vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);
  gy1-=sz1*(step(0.,gy1)-.5);
  
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;
  g010*=norm0.y;
  g100*=norm0.z;
  g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;
  g011*=norm1.y;
  g101*=norm1.z;
  g111*=norm1.w;
  
  float n000=dot(g000,Pf0);
  float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
  float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
  float n111=dot(g111,Pf1);
  
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2*n_xyz;
}

mat4 rotation3d(vec3 axis,float angle){
  axis=normalize(axis);
  float s=sin(angle);
  float c=cos(angle);
  float oc=1.-c;
  
  return mat4(
    oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
    oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
    oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
    0.,0.,0.,1.
  );
}

vec3 rotate(vec3 v,vec3 axis,float angle){
  return(rotation3d(axis,angle)*vec4(v,1.)).xyz;
}

vec3 snoiseVec3(vec3 x){
  
  float s=cnoise(vec3(x));
  float s1=cnoise(vec3(x.y-19.1,x.z+33.4,x.x+47.2));
  float s2=cnoise(vec3(x.z+74.2,x.x-124.5,x.y+99.4));
  vec3 c=vec3(s,s1,s2);
  return c;
  
}

vec3 curlNoise(vec3 p){
  
  const float e=.1;
  vec3 dx=vec3(e,0.,0.);
  vec3 dy=vec3(0.,e,0.);
  vec3 dz=vec3(0.,0.,e);
  
  vec3 p_x0=snoiseVec3(p-dx);
  vec3 p_x1=snoiseVec3(p+dx);
  vec3 p_y0=snoiseVec3(p-dy);
  vec3 p_y1=snoiseVec3(p+dy);
  vec3 p_z0=snoiseVec3(p-dz);
  vec3 p_z1=snoiseVec3(p+dz);
  
  float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
  float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
  float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;
  
  const float divisor=1./(2.*e);
  return normalize(vec3(x,y,z)*divisor);
  
}

void main(){
  float t=uTime*.15*uSpeed;
  
  vec2 uv=vUv;
  
  vec3 pos=texture2D(positions,uv).rgb;// basic simulation: displays the particles in place.
  vec3 curlPos=texture2D(positions,uv).rgb;
  vec3 finalPos=vec3(0.);
  
  // Move the particles here
  // pos = rotate(pos, vec3(0.0, 0.0, 1.0), t + sin(length(pos.xy) * 2.0 + PI * 0.5) * 10.0);
  // pos = rotate(pos, vec3(1.0, 0.0, 0.0), -t);
  // pos.z += tan(length(length(pos.xy) * 10.0) - t) * 1.0;
  pos=curlNoise(pos*uCurlFreq+t);
  
  curlPos=curlNoise(curlPos*uCurlFreq+t);
  
  // if you uncomment the next noise additions
  // you'll get very pleasing flocking particles
  // inside the bounds of a sphere
  // curlPos+=curlNoise(curlPos*uCurlFreq*2.)*.5;
  // curlPos+=curlNoise(curlPos*uCurlFreq*4.)*.25;
  curlPos+=curlNoise(curlPos*uCurlFreq*8.)*.125;
  curlPos+=curlNoise(pos*uCurlFreq*16.)*.0625;
  
  finalPos=mix(pos,curlPos,cnoise(pos+t));

  float offSet = .25;

  // Mouse Pos
  if(distance(finalPos,uCursorPos) < .85) {
    finalPos = mix(finalPos, uCursorPos, - 0.4 );
  }

  // finalPos = vGeometryPos;

  gl_FragColor=vec4(finalPos,1.);
}
