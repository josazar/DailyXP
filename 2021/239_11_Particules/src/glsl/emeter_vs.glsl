uniform float uTime;
uniform float uSpeed;
uniform vec2 uResolution;
uniform float frequency;
uniform float amplitude;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPos;
varying vec2 vMouse;
varying vec2 vResolution;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x){
  return x-floor(x*(1./289.))*289.;
}

vec2 mod289(vec2 x){
  return x-floor(x*(1./289.))*289.;
}

vec3 permute(vec3 x){
  return mod289(((x*34.)+1.)*x);
}

float noise(vec2 v)
{
  const vec4 C=vec4(.211324865405187,// (3.0-sqrt(3.0))/6.0
  .366025403784439,// 0.5*(sqrt(3.0)-1.0)
  -.577350269189626,// -1.0 + 2.0 * C.x
.024390243902439);// 1.0 / 41.0
// First corner
vec2 i=floor(v+dot(v,C.yy));
vec2 x0=v-i+dot(i,C.xx);

// Other corners
vec2 i1;
//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
//i1.y = 1.0 - i1.x;
i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
// x0 = x0 - 0.0 + 0.0 * C.xx ;
// x1 = x0 - i1 + 1.0 * C.xx ;
// x2 = x0 - 1.0 + 2.0 * C.xx ;
vec4 x12=x0.xyxy+C.xxzz;
x12.xy-=i1;

// Permutations
i=mod289(i);// Avoid truncation effects in permutation
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))
+i.x+vec3(0.,i1.x,1.));

vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
m=m*m;
m=m*m;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

vec3 x=2.*fract(p*C.www)-1.;
vec3 h=abs(x)-.5;
vec3 ox=floor(x+.5);
vec3 a0=x-ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);

// Compute final noise value at P
vec3 g;
g.x=a0.x*x0.x+h.x*x0.y;
g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.*dot(m,g);
}

vec3 curl(float x,float y,float z){
float eps=1.,eps2=2.*eps;
float n1,n2,a,b;

x+=uTime*.01 * uSpeed;
y+=uTime*.05 * uSpeed;
z+=uTime*.05 * uSpeed;

vec3 curl=vec3(0.);

n1=noise(vec2(x,y+eps));
n2=noise(vec2(x,y-eps));
a=(n1-n2)/eps2;

n1=noise(vec2(x,z+eps));
n2=noise(vec2(x,z-eps));
b=(n1-n2)/eps2;

curl.x=a-b;

n1=noise(vec2(y,z+eps));
n2=noise(vec2(y,z-eps));
a=(n1-n2)/eps2;

n1=noise(vec2(x+eps,z));
n2=noise(vec2(x+eps,z));
b=(n1-n2)/eps2;

curl.y=a-b;

n1=noise(vec2(x+eps,y));
n2=noise(vec2(x-eps,y));
a=(n1-n2)/eps2;

n1=noise(vec2(y+eps,z));
n2=noise(vec2(y-eps,z));
b=(n1-n2)/eps2;

curl.z=a-b;

return curl;
}
/* Easing Circular InOut equation */
/* Adapted from Robert Penner easing equations */
float easeCircularInOut(float t){
t=t*2.;if((t)<1.)return-.5*(sqrt(1.-t*t)-1.);
return.5*(sqrt(1.-(t-=2.)*t)+1.);
}

/* Easing Circular In equation */
/* Adapted from Robert Penner easing equations */
float easeCircularIn(float t) {
return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}
/* Easing Quint In equation */
/* Adapted from Robert Penner easing equations */
float easeQuintIn(float t){
return t*t*t*t*t;
}



void main(){
  // vUv = uv;
  vMouse = uMouse;
  vResolution = uResolution;

  vec3 pos=position;
  vec3 tar=pos+curl(pos.x*frequency,pos.y*frequency*(amplitude*.15),pos.z*frequency)*amplitude;

  float d=length(pos-tar)/amplitude;

  pos = mix(pos,tar,pow(d,easeQuintIn(cos(uTime)  )));

  vec2 offSet = vec2(distance(pos.xy, vMouse ));
  float diff = .7;

  if (offSet.x < diff && offSet.y < diff) {

//    pos.x += .3 / offSet.x * .2;
  //  pos.y += .3 / offSet.y * .2;
    pos.x *= 1. + cos(offSet.x) * .2;
    pos.y *= 1. + cos(offSet.y) * .2;
  }

  vPos = pos;

  vec4 mvPosition=modelViewMatrix*vec4(pos,1.);

  // Points Size
  gl_PointSize=.2*(30./-mvPosition.z);
  // gl_PointSize=1.;
  gl_Position=projectionMatrix*mvPosition;
}
