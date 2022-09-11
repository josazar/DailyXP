export default /* glsl */ `
#include <common>

uniform vec2 mousePos;
uniform bool restart;

// CONST
vec3 ACC = vec3(.0, .0, .0);
vec3 gravity = vec3(.0, -.5, .0);
vec3 wind = vec3(.0, 1.0, .0);

float mass = 100.;
float bounciness = .99;

// Level of the PLY object Floor
float floor = -2.2;


// Newton Law:
// MASS: M - FORCE: F - ACC: A 
// F = M * A  Or A = F / M
// ****************************************
vec3 applyForce(vec3 force) {
  vec3 f = force / mass;
  ACC += f;

  return ACC;
}

void main()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
  vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
  float dirUpdate = texture2D( textureVelocity, uv ).w;
  vec3 velocity = selfVelocity;

 
  // EDGES SIMPLE FLOOR
  // ************************
  if (selfPosition.y < floor) {
    dirUpdate = -dirUpdate * bounciness;
  } 
  velocity.y *= dirUpdate;

  velocity.x *= bounciness * .98;
  velocity.z *= bounciness * .99;


  // Apply Forces
  // ****************
  ACC = applyForce( gravity );
  
  if ( restart == true) {
    ACC = applyForce(wind);
  }

  
  // UDPATE
  // ***********************
  velocity += ACC;
   





  gl_FragColor = vec4(velocity , dirUpdate);
}


`;
