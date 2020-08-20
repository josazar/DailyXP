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

void main(){
  // float c = cos(u_time);
  vec2 uv=vec2(gl_FragCoord.xy/u_resolution.xy);
  
  // SDF : SIGNED DISTANCE FUNCTION
  vec3 color=vec3(0.,0.,0.);
  float y=fract(cos(214.*2.)+51.);
  
  // color.b=  0.5 * sin(u_time + 2.0 *3.1415 * uv.x) + 0.5;
  // CIRCLE
  float offset=map(cos(u_time*4.+2.*3.1415*uv.x),-1.,1.,.5,.6);
  
  float circ=length(uv.xy-offset)*2.;
  float radius=map(cos(u_time*4.+2.*3.1415*uv.x),-1.,1.,.5,.6);
  
  color+=step(radius,circ);
  color.rg+=uv.xy-.5;
  
  // RECT
  // float rect = rectSDF(0.25,0.75,circ);
  
  gl_FragColor=vec4(color,1.);
}
