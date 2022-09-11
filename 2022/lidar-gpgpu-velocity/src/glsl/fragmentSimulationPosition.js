export default /* glsl */ `
#include <common>

uniform bool restart;

// uniform float timer;
// uniform float frequency;
// uniform float amplitude;
// uniform float maxDistance;

float floor = -2.2;

void main()	{
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;

    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    vec3 velocity = texture2D( textureVelocity, uv ).xyz;


    // UPDATE
    pos += velocity;

      
    if (pos.y <= floor) {
        pos.y = floor -.005;
    } 

    gl_FragColor = vec4( pos, 1. );
}


`;
