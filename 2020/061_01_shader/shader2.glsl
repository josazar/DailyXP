
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives:enable

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI acos(-1.)
#define TAU 6.28

// Code pompé chez Flopine.

// #define BPM (120./60.)
#define time(speed)fract(u_time*speed)
#define bouncy(speed)(abs(sqrt(sin(time(speed)*PI))))
#define switchanim(speed)(floor(sin(time(speed)*TAU))+1.)
#define animoutexpo(speed)easeOutExpo(time(speed))
#define loopease(speed)easeInOutCirc(abs(-1.+2.*time(speed)))
#define AAstep(thre,val)smoothstep(-.7,.7,(val-thre)/min(.1,fwidth(val-thre)))
#define circle(s,puv)AAstep(s,length(puv))
#define square(s,puv)AAstep(s,max(abs(puv.x),abs(puv.y)))

#define rot(a)mat2(cos(a),sin(a),-sin(a),cos(a))

float easeOutExpo(float x)
{
  return x==1.?1.:1.-pow(2.,-10.*x);
}
float easeInOutCirc(float x)
{
  return x<.5
  ?(1.-sqrt(1.-(2.*x)*(2.*x)))/2.
  :(sqrt(1.-(-2.*x+2.)*(-2.*x+2.))+1.)/2.;
}
vec3 frame(vec2 uv)
{
  float BPM=(120./380.);
  float timing=BPM/2.;
  vec2 uu=uv;
  uu*=rot(sin(loopease(.5))*TAU);
  uu.y+=.665;
  uu.y-=bouncy(timing)*1.3;
  float f=circle(.12,uu);
  float s=square(.25,uu);
  f*=AAstep(-.65,-s);
  vec3 col=(f<=0.)?vec3(.0,.1,.6):vec3(.0,.8,.5);
  return 1.-col;
}

void main()
{
  vec2 uv=(2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
  uv.x-=.4;
  vec3 col=vec3(frame(uv));
  uv.x+=.75;
  col=mix(col,vec3(frame(uv)),.5);
  
  gl_FragColor=vec4(sqrt(col),1.);
}

