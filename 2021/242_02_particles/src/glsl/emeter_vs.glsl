uniform float uTime;
uniform float uSpeed;
uniform vec2 uResolution;
uniform float frequency;
uniform float amplitude;
uniform vec3 uCursorPos;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vCursorPos;
varying vec2 vResolution;
varying vec3 vColor;
varying vec3 vOffset;

attribute vec3 color;

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
  vCursorPos=uCursorPos;
  vResolution=uResolution;
  vColor=color;
  
  vec3 pos=position;
  
  vec3 offSet=vec3(distance(pos,vCursorPos))*1.;
  vOffset=offSet;
  
  float diff=1.;
  
  // Mouse interaction
  if(offSet.x<diff){
    // pos=mix(pos,vCursorPos,1.-vOffset);
    
    pos=mix(pos,vCursorPos,1.-vOffset);
    
    // pos.x/=offSet.x;
    // pos.y/=offSet.y;
    // pos.z/=offSet.z;
  }
  
  // pos=mix(pos,vCursorPos,1.-vOffset);
  
  vPos=pos;
  vec4 mvPosition=modelViewMatrix*vec4(pos,1.);
  // Points Size
  gl_PointSize=.2*(30./-mvPosition.z);
  // gl_PointSize=2.;
  gl_Position=projectionMatrix*mvPosition;
}
