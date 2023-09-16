export default /* glsl */ `
#include <common>

uniform vec4 spherePos;
uniform float restart;
uniform sampler2D originalTexture;
uniform float floor;
// + (from add Variable threejs)
// textureVelocity
// texturePosition


// CONST
vec3 ACC = vec3(.0, .0, .0);
vec3 gravity = vec3(.0, -.2, .0);
vec3 wind = vec3(-.75, .2, .5);
float mass = 65.;
float bounciness = .97;
float friction = .8;


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
  float GO = restart;



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
  


  // Collision
  // ********************************
  float r = spherePos.a;
  vec3 pp = spherePos.xyz - selfPosition.xyz;
  float d = ( r * r ) / ( pp.x * pp.x + pp.y * pp.y + pp.z * pp.z ) ;

  if (d > r) {
    GO = 1.;
    ACC = applyForce(wind * pp.x * pp.z * .01);

    // Apply Friction
    // ****************
    velocity.x *= friction;
    velocity.z *= friction;

    // Apply Bounciness
    // ****************
    velocity.y *= bounciness * friction * .25;
  }
  // End Collision
  

  if (selfVelocity != original.xyz  ) {
    GO = 1.;
  }

  ACC = applyForce( gravity );
  
  // UDPATE
  // ***********************

  ACC *= GO;
  velocity += ACC;

  // LIFE
  if (life == 0.) {
   velocity = original.xyz * .8;
   dirUpdate = 1.;
  }


  gl_FragColor = vec4(velocity , dirUpdate);
}


`;
