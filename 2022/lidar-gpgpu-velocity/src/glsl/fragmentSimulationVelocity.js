export default /* glsl */ `
#include <common>

uniform vec2 mousePos;
uniform float restart;
uniform sampler2D originalTexture;


// CONST
vec3 ACC = vec3(.0, .0, .0);
vec3 gravity = vec3(.0, -.5, .0);
vec3 wind = vec3(.0, 1.0, .0);

float mass = 75.;
float bounciness = .97;
float friction = .75;

// SCENES OBJECTS
// Level of the PLY object Floor
// ****************************************

float floor = -1.74;


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
  vec4 original = texture2D( originalTexture, uv );
  vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
  float life = texture2D( texturePosition, uv ).w;
  float dirUpdate = texture2D( textureVelocity, uv ).w;
  
  vec3 velocity = selfVelocity;




  // EDGES SIMPLE FLOOR
  // ************************
  if (selfPosition.y <= floor) {
    dirUpdate = -dirUpdate * bounciness;
    velocity.x *= bounciness * friction;
    velocity.z *= bounciness * friction;

  } 

  velocity.y *= dirUpdate;





  // Apply Forces
  // ****************
  ACC = applyForce( gravity );

  // ACC = applyForce(wind);

  
  // UDPATE
  // ***********************

  ACC *= restart;
  velocity += ACC;

  // LIFE
  if (life == 0.) {
   velocity = original.xyz;
   dirUpdate = 1.;
  }


  gl_FragColor = vec4(velocity , dirUpdate);
}


`;
