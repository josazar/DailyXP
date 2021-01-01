/*

Le vertex est activé en premier
Fragment Shader
Shader
y = f(x)

Voir le Glossaire des Glsl
Ressources :
- shadertoy.com
- bookofshader
- Catlike Coding
- https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm



*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
float map(float n,float start1,float stop1,float start2,float stop2){
  return(n-start1)/(stop1-start1)*(stop2-start2)+start2;
}

float sdCross(in vec2 p,in vec2 b,float r)
{
  p=abs(p);p=(p.y>p.x)?p.yx:p.xy;
  vec2 q=p-b;
  float k=max(q.y,q.y);
  vec2 w=(k>0.)?q:vec2(b.y-p.x,-k);
  return sign(k)*length(max(w,0.))+r;
}

void main(){
  // float c = cos(u_time);
  vec2 p=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  
  // size
  vec2 si=.1+.2*cos(vec2(.9,1.17));if(si.x<si.y)si=si.yx;
  
  // corner radious
  float ra=.1*sin(u_time*5.2);
  // float ra = 0.1*sin(1.2 );
  float d=sdCross(p,si,ra);
  
  vec3 col=vec3(1.)-sign(d)*vec3(.4196,.6471,.1176);
  
  gl_FragColor=vec4(col,1.);
}
