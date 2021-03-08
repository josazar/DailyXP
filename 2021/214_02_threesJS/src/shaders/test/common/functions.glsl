
/* Easing Quint InOut equation */
/* Adapted from Robert Penner easing equations */
float easeQuintInOut(float t) {
  t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t * t;
  return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}
/* Easing Back Out equation */
/* Adapted from Robert Penner easing equations */
float easeBackOut(float t){
  float s=1.70158;
  return((t=t-1.)*t*((s+1.)*t+s)+1.);
}

// SDF SHAPES
float circleSDF(vec2 st){
  return length(st-.5)*2.;
}
float triSDF(vec2 st){
  st=(st*2.-1.)*2.;
  return max(abs(st.x)*.866025+st.y*.5,-st.y*.5);
}
float rectSDF(vec2 st,vec2 s){
  st=st*2.-1.;
  return max(abs(st.x/s.x),abs(st.y/s.y));
}
float rhombSDF(vec2 st){
  return max(triSDF(st),triSDF(vec2(st.x,1.-st.y)));
}
// 11
float crossSDF(vec2 st,float s){
  vec2 size=vec2(.25,s);
  return min(rectSDF(st,size.xy),
  rectSDF(st,size.yx));
}

// 27
float hexSDF(vec2 st){
  st=abs(st*2.-1.);
  return max(abs(st.y),st.x*.866025+st.y*.5);
}

// methods
float stroke(float x,float s,float w){
  float d=step(s,x+w*.5)-step(s,x-w*.5);
  return clamp(d,0.,1.);
}
float flip(float v,float pct){
  return mix(v,1.-v,pct);
}
vec3 bridge(vec3 c,float d,float s,float w){
  c*=1.-stroke(d,s,w*2.);
  return c+stroke(d,s,w);
}
float fill(float x,float size){
  return 1.-step(size,x);
}
vec2 rotate(vec2 st,float a){
  st=mat2(cos(a),-sin(a),sin(a),cos(a))*(st-.5);
  return st+.5;
}

// Noises
float noise(vec3 p)
{
  vec3 i=floor(p);
  vec4 a=dot(i,vec3(1.,57.,21.))+vec4(0.,57.,21.,78.);
  vec3 f=cos((p-i)*acos(-1.))*(-.5)+.5;
  a=mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)),f.x);
  a.xy=mix(a.xz,a.yw,f.y);
  return mix(a.x,a.y,f.z);
}

vec2 hash12(float t){
  float x=fract(sin(t*674.3)*453.2);
  float y=fract(sin((t+x)*714.3)*263.2);
  return vec2(x,y);
  
}
vec2 hash12_polar(float t){
  float x=fract(sin(t*674.3)*453.2);
  float y=fract(sin((t+x)*714.3)*263.2);
  return vec2(x,y);
  
}
