export default /* glsl */ `
#include <common>

uniform vec2 mousePos;
uniform bool restart;

void main()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec3 mouse = vec3(mousePos.x, mousePos.y, 0.);

  vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
  vec3 velocity = selfVelocity;

  // *************************** Mouse direction
  float dist;
  dist = length( mouse );

 
  velocity.y = 5.; 

  float limit = 50000.;

  velocity = clamp(velocity, vec3(-5.),	vec3(limit));
  velocity += .1 * selfVelocity;

  if (restart) {
    velocity *= 0.75;
  }


  gl_FragColor = vec4( velocity , 1.);
}


`;
