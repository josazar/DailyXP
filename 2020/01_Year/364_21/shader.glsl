
#ifdef GL_ES
precision mediump float;
#endif

#define AA 3
#define PI 3.1415926

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

//generic rotation formula
vec2 rot(vec2 uv,float a){
  return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
}

float sdEquilateralTriangle(in vec2 p)
{
  const float k=sqrt(3.);
  p.x=abs(p.x)-1.;
  p.y=p.y+1./k;
  if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
  p.x-=clamp(p.x,-2.,0.);
  return-length(p)*sign(p.y);
}

vec2 random2(vec2 p){
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
vec4 permute(vec4 x){
  return mod((34.*x+1.)*x,289.);
}
vec2 cellular2x2(vec2 P){
  #define K.142857142857// 1/7
  #define K2.0714285714285// K/2
  #define jitter.8// jitter 1.0 makes F1 wrong more often
  vec2 Pi=mod(floor(P),289.);
  vec2 Pf=fract(P);
  vec4 Pfx=Pf.x+vec4(-.5,-1.5,-.5,-1.5);
  vec4 Pfy=Pf.y+vec4(-.5,-.5,-1.5,-1.5);
  vec4 p=permute(Pi.x+vec4(0.,1.,0.,1.));
  p=permute(p+Pi.y+vec4(0.,0.,1.,1.));
  vec4 ox=mod(p,7.)*K+K2;
  vec4 oy=mod(floor(p*K),7.)*K+K2;
  vec4 dx=Pfx+jitter*ox;
  vec4 dy=Pfy+jitter*oy;
  vec4 d=dx*dx+dy*dy;// d11, d12, d21 and d22, squared
  // Sort out the two smallest distances
  #if 0
  // Cheat and pick only F1
  d.xy=min(d.xy,d.zw);
  d.x=min(d.x,d.y);
  return d.xx;// F1 duplicated, F2 not computed
  #else
  // Do it right and find both F1 and F2
  d.xy=(d.x<d.y)?d.xy:d.yx;// Swap if smaller
  d.xz=(d.x<d.z)?d.xz:d.zx;
  d.xw=(d.x<d.w)?d.xw:d.wx;
  d.y=min(d.y,d.z);
  d.y=min(d.y,d.w);
  return sqrt(d.xy);
  #endif
}

void main(){
  vec2 st=gl_FragCoord.xy/u_resolution.xy;
  st.x*=u_resolution.x/u_resolution.y;
  vec3 color=vec3(.0);
  vec3 colorA=texture2D(u_texture_1,st).rgb;
  
  vec2 m=u_mouse/u_resolution;
  // Scale
  st*=10.;
  
  // Tile the space
  vec2 i_st=floor(st);
  vec2 f_st=fract(st);
  float m_dist=.5;// minimum distance
  if(u_resolution.y>u_resolution.x){
    st.y*=u_resolution.y/u_resolution.x;
    st.y-=(u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x;
  }else{
    st.x*=u_resolution.x/u_resolution.y;
    st.x-=(u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y;
  }
  
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      // Neighbor place in the grid
      vec2 neighbor=vec2(float(x),float(y));
      
      // Random position from current + neighbor place in the grid
      vec2 point=random2(i_st+neighbor);
      // point = m;
      
      // Animate the point
      point=.5+.5*sin(u_time+6.2831*point);
      
      // Vector between the pixel and the point
      vec2 diff=neighbor+point-f_st;
      
      // Distance to the point
      float dist=length(diff);
      // Keep the closer distance
      m_dist=min(m_dist,dist);
    }
  }
  // vec2 pos=st-.5;
  
  vec2 F=cellular2x2(st*22.);
  
  vec2 pos=st-.5;
  float a=dot(pos,pos)-u_time*.1;
  
  float n=1.-step(abs(sin(a))-.1,.05+(F.x-F.y)*2.);
  // Draw the min distance (distance field)
  // color.rg*=F.xy;
  color=m_dist+vec3(F.y,F.x,F.x/.5);
  // Draw cell center
  // color += 1.-step(.02, m_dist);
  // color-=abs(sin(80.*m_dist))*.27;
  // Draw grid
  //color.r += step(.98, f_st.x) + step(.98, f_st.y);
  
  // Show isolines
  // color -= step(.7,abs(sin(27.0*m_dist)))*.5;
  
  gl_FragColor=vec4(color,1.);
}
