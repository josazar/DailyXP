export default /* glsl */ `
#include <common>
#define MAX_SPHERES 4
uniform vec4 spherePos[MAX_SPHERES];

uniform sampler2D originalTexture;
uniform float floor;
// + (from add Variable threejs)
// textureVelocity
// texturePosition


// CONST
vec3 ACC = vec3(.0, .0, .0);
vec3 gravity = vec3(.0, -.25, .0);
vec3 wind = vec3(-.0, .0, .0);
float mass = 85.;
float bounciness = .95;
float friction = .09;


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
  // if (selfPosition.y <= floor) {
  //   dirUpdate = -dirUpdate * bounciness;
  //   velocity.x *= bounciness * friction;
  //   velocity.z *= bounciness * friction;
  // } 

  // v2 without if statement
  float belowFloor = step(selfPosition.y, floor);
  dirUpdate = mix(dirUpdate, -dirUpdate * bounciness, belowFloor);
  velocity.x *= mix(bounciness * friction, 1.0, belowFloor)    ;
  velocity.z *= mix(bounciness * friction, 1.0, belowFloor);

  // end test


  velocity.y *= dirUpdate;

  // Apply Forces
  // ****************
  


  // Collision
  // ********************************
  for (int i = 0; i < MAX_SPHERES; i++) { // Loop through all the spheres

    float r = spherePos[i].a;
    vec3 pp = spherePos[i].xyz - selfPosition.xyz;
    float d = ( r * r ) / ( pp.x * pp.x + pp.y * pp.y + pp.z * pp.z ) ;

    // test v2 without if statement
    float aboveRadius = step(d, r);
    ACC = mix(ACC, applyForce(wind), aboveRadius);
    
    // Apply Friction
    // ****************
    velocity.xy *= mix(friction, 1.0, aboveRadius);
    
    // Apply Bounciness
    // ****************
    velocity.y *= mix(bounciness * friction, 1.0, aboveRadius);
    
    // End Collision
    // **************  
  } 
  
  ACC = applyForce( gravity );
  
  // UDPATE
  // ***********************
  velocity += ACC;
  

  // LIFE
  // if (life == 0.) 
  vec3 newVelocity = mix(velocity, original.xyz * 0.8, step(life, 0.0));
  dirUpdate = mix(dirUpdate, 1.0, step(life, 0.0));
  velocity = newVelocity;


  gl_FragColor = vec4(velocity , dirUpdate);
  
}


`;
