export default /* glsl */ `
#include <common>

uniform vec2 mousePos;
uniform bool restart;


float floor = -2.2;
float acc = .0;

void main()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec3 mouse = vec3(mousePos.x, mousePos.y, 0.);

  vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
  vec3 selfPosition = texture2D( texturePosition, uv ).yyy;
  float dirUpdate = texture2D( textureVelocity, uv ).w;
  float acceleration = texture2D( textureVelocity, uv ).x;

  vec3 velocity = selfVelocity;


  
  if (selfPosition.y < floor) {
    dirUpdate = -dirUpdate;
    // acceleration -= .00001 ;
  } 
  
  velocity.y *= dirUpdate;
    
  // Apply Force
  velocity.y += acceleration;


  
   if ( velocity.y < -.21 )  velocity.y = 0.;


  gl_FragColor = vec4( acceleration, velocity.y, 0. , dirUpdate);
}


`;
