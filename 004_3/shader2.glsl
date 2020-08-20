
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
//generic rotation formula
vec2 rot(vec2 uv,float a){
  return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
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
  // Some useful functions
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
  //
  // Description : GLSL 2D simplex noise function
  //      Author : Ian McEwan, Ashima Arts
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License :
  //  Copyright (C) 2011 Ashima Arts. All rights reserved.
  //  Distributed under the MIT License. See LICENSE file.
  //  https://github.com/ashima/webgl-noise
  //
  float snoise(vec2 v){
    
    // Precompute values for skewed triangular grid
    const vec4 C=vec4(.211324865405187,
      // (3.0-sqrt(3.0))/6.0
      .366025403784439,
      // 0.5*(sqrt(3.0)-1.0)
      -.577350269189626,
      // -1.0 + 2.0 * C.x
    .024390243902439);
    // 1.0 / 41.0
    
    // First corner (x0)
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    
    // Other two corners (x1, x2)
    vec2 i1=vec2(0.);
    i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec2 x1=x0.xy+C.xx-i1;
    vec2 x2=x0.xy+C.zz;
    
    // Do some permutations to avoid
    // truncation effects in permutation
    i=mod289(i);
    vec3 p=permute(
      permute(i.y+vec3(0.,i1.y,1.))
      +i.x+vec3(0.,i1.x,1.));
      
      vec3 m=max(.5-vec3(
          dot(x0,x0),
          dot(x1,x1),
          dot(x2,x2)
        ),0.);
        
        m=m*m;
        m=m*m;
        
        // Gradients:
        //  41 pts uniformly over a line, mapped onto a diamond
        //  The ring size 17*17 = 289 is close to a multiple
        //      of 41 (41*7 = 287)
        
        vec3 x=2.*fract(p*C.www)-1.;
        vec3 h=abs(x)-.5;
        vec3 ox=floor(x+.5);
        vec3 a0=x-ox;
        
        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt(a0*a0 + h*h);
        m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
        
        // Compute final noise value at P
        vec3 g=vec3(0.);
        g.x=a0.x*x0.x+h.x*x0.y;
        g.yz=a0.yz*vec2(x1.x,x2.x)+h.yz*vec2(x1.y,x2.y);
        return 130.*dot(m,g);
      }
      
      #define OCTAVES 3
      float turbulence(in vec2 st){
        // Initial values
        float value=0.;
        float amplitude=.5;
        float frequency=0.;
        //
        // Loop of octaves
        for(int i=0;i<OCTAVES;i++){
          value+=amplitude*abs(snoise(st));
          st*=2.;
          amplitude*=.5;
        }
        return value;
      }
      
      void main(){
        vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
        vec2 center=vec2(.5,.5*u_resolution.y/u_resolution.x);
        float size=min(u_resolution.x,u_resolution.y);
        float pixSize=1./size;
        float stroke=pixSize*1.5;
        
        vec2 m=u_mouse-.5;
        pos=rot(pos*turbulence(pos/2.*u_time/2.),u_time/1.);
        // fraction
        // pos=fract(pos*1.);
        // rotation
        float n=noise(pos+cos(u_time*.25));
        
        float line=step(lines(pos,.5),.85);
        vec3 col=vec3(.4,.02,.238)+line;
        // col+= turbulence(pos*3.0);
        gl_FragColor+=vec4(col,1.);
      }
      