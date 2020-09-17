uniform vec2 resolution;
uniform float u_time;

varying vec2 vUv;

// 2D Random
float random(in vec2 st){
  return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))
      *43758.5453123);
    }
    
    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(in vec2 st){
      vec2 i=floor(st);
      vec2 f=fract(st);
      
      // Four corners in 2D of a tile
      float a=random(i);
      float b=random(i+vec2(1.,0.));
      float c=random(i+vec2(0.,1.));
      float d=random(i+vec2(1.,1.));
      
      // Smooth Interpolation
      
      // Cubic Hermine Curve.  Same as SmoothStep()
      vec2 u=f*f*(3.-2.*f);
      // u = smoothstep(0.,1.,f);
      
      // Mix 4 coorners percentages
      return mix(a,b,u.x)+
      (c-a)*u.y*(1.-u.x)+
      (d-b)*u.x*u.y;
    }
    
    mat2 rotate2d(float angle){
      return mat2(cos(angle),-sin(angle),
      sin(angle),cos(angle));
    }
    
    float lines(in vec2 pos,float b){
      float scale=10.;
      pos*=scale;
      return smoothstep(.4,
        .5+b*.5,
        abs((sin(pos.x*3.1415)+b*2.))*.5);
      }
      
      void main(){
        vec2 pos=vUv;
        //  ZEBRE
        float pattern=pos.x;
        // Add noise
        pos=rotate2d(noise(pos))*pos*10.;
        // Draw lines
        pattern=lines(pos,.5);
        gl_FragColor=vec4(vec3(pattern),.6);
        // gl_FragColor=vec4(vec3(1.),.85);
        
      }
      