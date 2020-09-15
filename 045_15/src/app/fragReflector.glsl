uniform vec3 color;
uniform float opacity;
uniform sampler2D tDiffuse;
varying vec4 vUv;

float blendOverlay(float base,float blend){
  return(base<.5?(2.*base*blend):(1.-2.*(1.-base)*(1.-blend)));
}

vec3 blendOverlay(vec3 base,vec3 blend){
  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

void main(){
  vec4 base=texture2DProj(tDiffuse,vUv);
  gl_FragColor=vec4(blendOverlay(base.rgb,color),opacity);
}
