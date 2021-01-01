//https://thndl.com/square-shaped-shaders.html

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926
#define S smoothstep

#define WATER_COL vec3(.1569,.4118,.5686)
#define WATER2_COL vec3(.0275,.2627,.4196)
#define FOAM_COL vec3(.949,1.,1.)
float circ(vec2 pos,vec2 c,float s)
{
  c=abs(pos-c);
  c=min(c,1.-c);
  return smoothstep(0.,.002,sqrt(s)-sqrt(dot(c,c)))*-1.;
  
}
// Foam pattern for the water constructed out of a series of circles
float waterlayer(vec2 uv)
{
  uv=mod(uv,1.);// Clamp to [0..1]
  float ret=1.;
  ret+=circ(uv,vec2(.37378,.277169),.0268181);
  ret+=circ(uv,vec2(.0317477,.540372),.0193742);
  ret+=circ(uv,vec2(.430044,.882218),.0232337);
  ret+=circ(uv,vec2(.641033,.695106),.0117864);
  ret+=circ(uv,vec2(.0146398,.0791346),.0299458);
  ret+=circ(uv,vec2(.43871,.394445),.0289087);
  ret+=circ(uv,vec2(.909446,.878141),.028466);
  ret+=circ(uv,vec2(.310149,.686637),.0128496);
  ret+=circ(uv,vec2(.928617,.195986),.0152041);
  ret+=circ(uv,vec2(.0438506,.868153),.0268601);
  ret+=circ(uv,vec2(.308619,.194937),.00806102);
  ret+=circ(uv,vec2(.566936,.954457),.00981141);
  ret+=circ(uv,vec2(.0589944,.200931),.0178746);
  ret+=circ(uv,vec2(.569297,.624893),.0132408);
  ret+=circ(uv,vec2(.288357,.710972),.01265);
  ret+=circ(uv,vec2(.878141,.771279),.00322719);
  ret+=circ(uv,vec2(.150995,.376221),.00216157);
  ret+=circ(uv,vec2(.119673,.541984),.0124621);
  ret+=circ(uv,vec2(.514847,.865444),.00623523);
  ret+=circ(uv,vec2(.710575,.0415131),.00322689);
  ret+=circ(uv,vec2(.71403,.576945),.0215641);
  ret+=circ(uv,vec2(.748873,.413325),.0110795);
  ret+=circ(uv,vec2(.0623365,.896713),.0236203);
  ret+=circ(uv,vec2(.980482,.473849),.00573439);
  ret+=circ(uv,vec2(.647463,.654349),.0188713);
  ret+=circ(uv,vec2(.331283,.418536),.00598028);
  ret+=circ(uv,vec2(.658212,.910553),.000741023);
  ret+=circ(uv,vec2(.514523,.243263),.0270685);
  ret+=circ(uv,vec2(.0249494,.252872),.00876653);
  ret+=circ(uv,vec2(.502214,.47269),.0234534);
  ret+=circ(uv,vec2(.693271,.431469),.0246533);
  ret+=circ(uv,vec2(.415,.884418),.0271696);
  ret+=circ(uv,vec2(.246286,.682766),.00411623);
  ret+=circ(uv,vec2(.0761895,.16327),.0145935);
  ret+=circ(uv,vec2(.949386,.802936),.0100873);
  ret+=circ(uv,vec2(.480122,.196554),.0110185);
  ret+=circ(uv,vec2(.896854,.803707),.013969);
  ret+=circ(uv,vec2(.292865,.762973),.00566413);
  ret+=circ(uv,vec2(.0995585,.117457),.00869407);
  return max(ret,0.);
}

float hash(in float n)
{
  return fract(sin(n)*43758.5453);
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

void main(){
  float t=u_time;
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv-=.5;
  uv.x*=u_resolution.x/u_resolution.y;
  // deformation
  vec2 offs=vec2(sin(t+uv.y*25.),sin(t+uv.y*5.));
  offs*=.025;
  uv+=offs;
  
  float noise=noise(uv+u_time);
  
  //Draw
  const vec2 dist=vec2(0.);
  vec3 ret=mix(WATER_COL,WATER2_COL,waterlayer(uv+dist.xy));
  ret=mix(ret,FOAM_COL,waterlayer(vec2(1.)-uv-dist.yx));
  
  // d=mix(d,ret.b,0.5);
  gl_FragColor=vec4(ret+(noise/2.),1.);
}
