export default /* glsl */ `
#include <common>
#define MAX_SPHERES 5
uniform vec4 spherePos[MAX_SPHERES];

uniform sampler2D originalTexture;
uniform float floorValue;
// + (from add Variable threejs)
// textureVelocity
// texturePosition


// CONST
vec3 ACC = vec3(.0, -.0050, -.00);
vec3 gravity = vec3(.0,-0.08, .0);
vec3 wind = vec3(.0, .0, .0);

float mass = 25.;
float bounciness = .09802;
float friction = .8;



// 3D Perlin noise implementation in GLSL returning vec3
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}


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
  // if (selfPosition.y <= floorValue) {
  //   dirUpdate = -dirUpdate * bounciness;
  //   velocity.x *= bounciness * friction;
  //   velocity.z *= bounciness * friction;
  // } 

  // without if statement
  float belowFloor = step(selfPosition.y, floorValue);
  dirUpdate = mix(dirUpdate, -dirUpdate * bounciness, belowFloor);
  velocity.x *= mix(bounciness * friction, 1.0, belowFloor)    ;
  velocity.z *= mix(bounciness * friction, 1.0, belowFloor);

  // Noisy
  // Calculate a noise value based on position and time (life)
  float noiseValue = cnoise(selfPosition * .05 * (life) );
  
  velocity.y *= dirUpdate + noiseValue;

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
