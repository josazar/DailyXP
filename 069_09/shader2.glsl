
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_3;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define AB_SCALE.95

vec2 displace(vec2 uv,vec2 offset)
{
  float d=smoothstep(.2,2.,texture2D(u_texture_3,(uv*1.-vec2(sin(u_time)*.025,0))+offset).r)*.15;
  return vec2(d);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  
  vec2 dg=displace(uv,vec2(.00,.0)*AB_SCALE);
  vec2 db=displace(uv,vec2(.00,0)*AB_SCALE);
  // uv.y+=0.1;
  vec2 dr=displace(uv,vec2(.12,.52)*AB_SCALE*tan(-u_time*.2));
  
  vec3 color=vec3(0);
  color+=vec3(1,0,0)*texture2D(u_texture_1,uv-dr).r;
  color+=vec3(0,1,0)*texture2D(u_texture_1,uv-dg).g;
  color+=vec3(0,0,1)*texture2D(u_texture_1,uv-db).b;
  gl_FragColor+=vec4(color,1.);
}
