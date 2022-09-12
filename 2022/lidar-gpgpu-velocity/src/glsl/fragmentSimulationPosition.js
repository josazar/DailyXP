export default /* glsl */ `
#include <common>

uniform float restart;
uniform sampler2D originalTexture;

// uniform float frequency;
// uniform float amplitude;
// uniform float maxDistance;

float floor = -1.74;

void main()	{
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;

    vec4 inputTexture = texture2D( texturePosition, uv );
    vec3 pos = inputTexture.xyz;
    float life = inputTexture.a;
    vec3 velocity = texture2D( textureVelocity, uv ).xyz;
    vec4 original = texture2D( originalTexture, uv );


    if( life == 0. ) {
	  pos = original.xyz;
      life = original.a;
	}


    // UPDATE
    pos += velocity * restart;
    
      
    if (pos.y <= floor) {
        pos.y = floor -.005;
    } 

    // Life
    life += 10. * restart;
	if( life > 1400. ) life =  0.;

    gl_FragColor = vec4( pos, life );
}


`;
