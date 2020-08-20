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
  vec2 p=vec2((2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.xy);
  
  vec2 l;
  for(int i=0;i<2;i++){
    l-=length(p-.1*cos(length(cos(p.yx*2.)+cos(p.yx*5.))*22.));
    p=vec2(0.,1.9)+vec2(gl_FragCoord.xy*.0055)*l*20.*sin(u_time/20000.);
  }
  gl_FragColor=vec4(vec3(p.y>1.5?step(fract(length(p)*100.),.2105):0.),1);
  // gl_FragColor=vec4(col,1.);
}
