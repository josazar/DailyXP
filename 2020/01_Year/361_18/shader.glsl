
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926
#define BlendLinearDodgef BlendAddf
#define BlendLinearBurnf BlendSubstractf
#define BlendAddf(base,blend)min(base+blend,1.)
#define BlendSubstractf(base,blend)max(base+blend-1.,0.)
#define BlendLightenf(base,blend)max(blend,base)
#define BlendDarkenf(base,blend)min(blend,base)
#define BlendLinearLightf(base,blend)(blend<.5?BlendLinearBurnf(base,(2.*blend)):BlendLinearDodgef(base,(2.*(blend-.5))))
#define BlendScreenf(base,blend)(1.-((1.-base)*(1.-blend)))
#define BlendOverlayf(base,blend)(base<.5?(2.*base*blend):(1.-2.*(1.-base)*(1.-blend)))
#define BlendSoftLightf(base,blend)((blend<.5)?(2.*base*blend+base*base*(1.-2.*blend)):(sqrt(base)*(2.*blend-1.)+2.*base*(1.-blend)))
#define BlendColorDodgef(base,blend)((blend==1.)?blend:min(base/(1.-blend),1.))
#define BlendColorBurnf(base,blend)((blend==0.)?blend:max((1.-((1.-base)/blend)),0.))
#define BlendVividLightf(base,blend)((blend<.5)?BlendColorBurnf(base,(2.*blend)):BlendColorDodgef(base,(2.*(blend-.5))))
#define BlendPinLightf(base,blend)((blend<.5)?BlendDarkenf(base,(2.*blend)):BlendLightenf(base,(2.*(blend-.5))))
#define BlendHardMixf(base,blend)((BlendVividLightf(base,blend)<.5)?0.:1.)
#define BlendReflectf(base,blend)((blend==1.)?blend:min(base*base/(1.-blend),1.))

// Component wise blending
#define Blend(base,blend,funcf)vec3(funcf(base.r,blend.r),funcf(base.g,blend.g),funcf(base.b,blend.b))

#define BlendNormal(base,blend)(blend)
#define BlendLighten BlendLightenf
#define BlendDarken BlendDarkenf
#define BlendMultiply(base,blend)(base*blend)
#define BlendAverage(base,blend)((base+blend)/2.)
#define BlendAdd(base,blend)min(base+blend,vec3(1.))
#define BlendSubstract(base,blend)max(base+blend-vec3(1.),vec3(0.))
#define BlendDifference(base,blend)abs(base-blend)
#define BlendNegation(base,blend)(vec3(1.)-abs(vec3(1.)-base-blend))
#define BlendExclusion(base,blend)(base+blend-2.*base*blend)
#define BlendScreen(base,blend)Blend(base,blend,BlendScreenf)
#define BlendOverlay(base,blend)Blend(base,blend,BlendOverlayf)
#define BlendSoftLight(base,blend)Blend(base,blend,BlendSoftLightf)
#define BlendHardLight(base,blend)BlendOverlay(blend,base)
#define BlendColorDodge(base,blend)Blend(base,blend,BlendColorDodgef)
#define BlendColorBurn(base,blend)Blend(base,blend,BlendColorBurnf)
#define BlendLinearDodge BlendAdd
#define BlendLinearBurn BlendSubstract

#define BlendLinearLight(base,blend)Blend(base,blend,BlendLinearLightf)
#define BlendVividLight(base,blend)Blend(base,blend,BlendVividLightf)
#define BlendPinLight(base,blend)Blend(base,blend,BlendPinLightf)
#define BlendHardMix(base,blend)Blend(base,blend,BlendHardMixf)
#define BlendReflect(base,blend)Blend(base,blend,BlendReflectf)
#define BlendGlow(base,blend)BlendReflect(blend,base)
#define BlendPhoenix(base,blend)(min(base,blend)-max(base,blend)+vec3(1.))
#define BlendOpacity(base,blend,F,O)(F(base,blend)*O+blend*(1.-O))

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;

uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float map(float n,float start1,float stop1,float start2,float stop2){
  return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
}

float circle(in vec2 _st,in float _radius){
  vec2 dist=_st-vec2(.5);
  return 1.-smoothstep(_radius-(_radius*.01),
  _radius+(_radius*.01),
  dot(dist,dist)*4.);
}
// Based on Morgan
// https://www.shadertoy.com/view/4dS3Wd
float random(in vec2 st){
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
float noise(in vec2 st){
  vec2 i=floor(st);
  vec2 f=fract(st);
  
  // Four corners in 2D of a tile
  float a=random(i);
  float b=random(i+vec2(1.,0.));
  float c=random(i+vec2(0.,1.));
  float d=random(i+vec2(1.,1.));
  
  vec2 u=f*f*(3.-2.*f);
  
  return mix(a,b,u.x)+
  (c-a)*u.y*(1.-u.x)+
  (d-b)*u.x*u.y;
}

//generic rotation formula
vec2 rot(vec2 uv,float a){
  return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
}

void main(){
  vec2 st=gl_FragCoord.xy/u_resolution.xy;
  
  vec4 color=vec4(st.x,st.y,0.,1.);
  // rotation et zoom
  st=rot(st,u_time/8.);
  // st*=sin(u_time)*.5+1.5;
  
  float offset=.2;
  st=fract(st*5.);
  
  float angle=noise(st+u_time*.5)*PI;
  float radius=offset;
  st+=radius*vec2(cos(angle),sin(angle));
  
  // color=texture2D(u_texture_0,st);
  vec3 colorA=texture2D(u_texture_0,st).rgb;
  // u_texture_0.xy=rot(u_texture_0,u_time/5.);
  st*=sin(u_time)*.5+1.5;
  vec3 colorB=texture2D(u_texture_1,st).rgb;
  
  color=vec4(colorA+colorB,1.);
  
  gl_FragColor=color;
}
