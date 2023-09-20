export default /* glsl */ `
#include <common>
#define MAX_SPHERES 4

uniform float lifeDuration;
uniform sampler2D originalTexture;
uniform vec4 spherePos[MAX_SPHERES];

// uniform float frequency;
// uniform float amplitude;
// uniform float maxDistance;

uniform float floor;


void main()	{
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;

    vec4 inputTexture = texture2D( texturePosition, uv );
    vec3 pos = inputTexture.xyz;
    float life = inputTexture.a;
    vec3 velocity = texture2D( textureVelocity, uv ).xyz;
    vec4 original = texture2D( originalTexture, uv );


    // if( life == 0. ) {
	//   pos = original.xyz;
    //   life = original.a;
	// }

    vec4 newValues = vec4(original.xyz, original.a);
    vec4 resetValues = vec4(original.xyz, 0.0);

    life = mix(life, resetValues.a, step(life, 0.0));
    pos = mix(pos, resetValues.xyz, step(life, 0.0));



    // COLLISION    
    // **********
    for (int i = 0; i < MAX_SPHERES; i++) { // Loop through all the spheres

        float r = spherePos[i].a;
        vec3 pp = spherePos[i].xyz - pos.xyz;
        float d = (r * r) / (pp.x * pp.x + pp.y * pp.y + pp.z * pp.z);
        
        float isOutsideSphere = step(d, r);   
        
        // Apply Friction
        // ****************
        velocity.x *= mix(1.0, 0.99, isOutsideSphere);
        velocity.z *= mix(1.0, 0.29, isOutsideSphere);
        
        // Apply Bounciness
        // ****************
        velocity.y *= mix(1.0, 0.19, isOutsideSphere);

        
        // UPDATE
        pos += velocity;

        // END COLLISION
    // **************
    }


    // EDGES  
    if (pos.y <= floor) {
        pos.y = floor ;
    } 

    // Life
    life += 3.5;
	if( life > lifeDuration  ) life =  0.;

    gl_FragColor = vec4( pos, life );
    

}


`;