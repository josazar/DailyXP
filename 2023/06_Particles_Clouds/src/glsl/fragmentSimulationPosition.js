export default /* glsl */ `
#include <common>
#define MAX_SPHERES 5

uniform float lifeDuration;
uniform sampler2D originalTexture;
uniform vec4 spherePos[MAX_SPHERES];

// uniform float frequency;
// uniform float amplitude;
// uniform float maxDistance;

uniform float floorValue;


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
        float isInsideSphere = 1.0 - isOutsideSphere;
        
        // Apply Friction
        // ****************
        velocity *= mix(1.0, 0.1, isOutsideSphere);
        // velocity.z *= mix(1.0, 0.09, isOutsideSphere);    
        // velocity.y *= mix(1.0, 0.09, isOutsideSphere);
        
        // UPDATE
        pos += velocity;
        // END COLLISION
    // **************
    }


    // EDGES  
    if (pos.y <= floorValue) {
        pos.y = floorValue ;
    } 

    // Life
    life += 4.5;
	if( life > lifeDuration  ) life =  0.;

    gl_FragColor = vec4( pos, life );

}


`;
