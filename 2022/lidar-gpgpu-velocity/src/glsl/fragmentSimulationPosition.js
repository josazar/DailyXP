export default /* glsl */ `
#include <common>

uniform float restart;
uniform sampler2D originalTexture;
uniform vec4 spherePos;

// uniform float frequency;
// uniform float amplitude;
// uniform float maxDistance;

float floor = -2.2;

void main()	{
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;

    vec4 inputTexture = texture2D( texturePosition, uv );
    vec3 pos = inputTexture.xyz;
    float life = inputTexture.a;
    vec3 velocity = texture2D( textureVelocity, uv ).xyz;
    vec4 original = texture2D( originalTexture, uv );
    float GO = restart;


    if( life == 0. ) {
	  pos = original.xyz;
      life = original.a;
	}


    // COLLISION
    
    float r = spherePos.a;
    vec3 pp = spherePos.xyz - pos.xyz;
    float d = ( r * r ) / ( pp.x * pp.x + pp.y * pp.y + pp.z * pp.z ) ;

    if (d > r) {
        GO = 1.;
    }

    if (pos != original.xyz  ) {
        GO = 1.;
    }




    // UPDATE
    pos += velocity * GO;
    

    // EDGES  
    if (pos.y <= floor) {
        pos.y = floor ;
    } 

    // Life
    life += 5. * GO;
	if( life > 1400. ) life =  0.;

    gl_FragColor = vec4( pos, life );
}


`;
