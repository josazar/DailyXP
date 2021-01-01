
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AB_SCALE.95

vec2 displace(vec2 uv,vec2 offset)
{
  float d=smoothstep(.2,2.,texture2D(u_texture_0,(uv*1.-vec2(sin(u_time/4.)*.5,0))+offset).r)*.25;
  return vec2(d);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  vec2 dr=displace(uv,vec2(0,.02)*AB_SCALE),
  dg=displace(uv,vec2(.01,.01)*AB_SCALE),
  db=displace(uv,vec2(.01,0)*AB_SCALE);
  
  vec3 color=vec3(0);
  color+=vec3(1,0,0)*texture2D(u_texture_1,uv-dr).r;
  color+=vec3(0,1,0)*texture2D(u_texture_1,uv-dg).g;
  color+=vec3(0,0,1)*texture2D(u_texture_1,uv-db).b;
  gl_FragColor+=vec4(color,1.);
}
