
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

// Based on https://www.shadertoy.com/view/4sSSzG
float triangle(vec2 st,
  vec2 p0,vec2 p1,vec2 p2,
float smoothness){
  vec3 e0,e1,e2;
  
  e0.xy=normalize(p1-p0).yx*vec2(+1.,-1.);
  e1.xy=normalize(p2-p1).yx*vec2(+1.,-1.);
  e2.xy=normalize(p0-p2).yx*vec2(+1.,-1.);
  
  e0.z=dot(e0.xy,p0)-smoothness;
  e1.z=dot(e1.xy,p1)-smoothness;
  e2.z=dot(e2.xy,p2)-smoothness;
  
  float a=max(0.,dot(e0.xy,st)-e0.z);
  float b=max(0.,dot(e1.xy,st)-e1.z);
  float c=max(0.,dot(e2.xy,st)-e2.z);
  
  return smoothstep(smoothness*2.,
    1e-7,
    length(vec3(a,b,c)));
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
  
  float circle(in vec2 _st,in float _radius){
    vec2 dist=_st-vec2(.5);
    return 1.-smoothstep(_radius-(_radius*.01),
    _radius+(_radius*.01),
    dot(dist,dist)*4.);
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
        float rect(in vec2 st,in vec2 size){
          size=.25-size*.25;
          vec2 uv=step(size,st*(1.-st));
          return uv.x*uv.y;
        }
        
        void main(){
          vec2 pos=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
          
          vec2 m=u_mouse-.5;
          // fraction
          // pos=fract(pos)-.5;
          vec3 bleu=vec3(.2353,.4667,.8941);
          
          float n=snoise(pos+cos(abs(sin(u_time))*.25));
          
          float line=step(lines(pos+n,.5),.85);
          vec3 col=vec3(pos+.5,1);
          
          // triangle
          
          // rect
          for(float i=0.;i<200.;i++){
            pos=rot(pos,u_time/55.);
            float c=circle(pos*n,cos(u_time)*.5+.52);
            float c2=circle(pos*n,cos(u_time)*.5+.51);
            col=mix(col,vec3(.098,.0588,.3216),c);
            col=mix(col,bleu,c2);
            
          }
          
          gl_FragColor+=vec4(col,1.);
        }
        