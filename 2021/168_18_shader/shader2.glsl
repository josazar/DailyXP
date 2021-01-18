precision highp float;
uniform vec2 u_resolution;
uniform float u_time;// Time elapsed

#define THETA 2.399963229728653

vec2 spiralPosition(float t)
{
    float angle = t * THETA - u_time * .001;
    float radius = ( t + .5 ) * .5;
    return vec2( radius * cos( angle ) + .5, radius * sin( angle ) + .5 );
}
void main()
{
  vec2 p = -1. + 2.*gl_FragCoord.xy / u_resolution.xy;
  p*=1000.;
// Code Tweak from: https://www.shadertoy.com/view/td3Xzr
// Original Author:  OZEG :https://www.shadertoy.com/user/ozeg
  float a = 0.;
  float d = 5.;
  for(int i = 0; i < 20; i++)
  {
      vec2 pointDist = p - spiralPosition( float(i) ) * 1.66*cos(u_time);
      a += atan( pointDist.x, pointDist.y );
      d = min( dot( pointDist, pointDist ), d );
  }
  d = sqrt( d ) * .02;
  d = 1. - pow( - d, 2. );
  a += cos( length( p ) * .01 + u_time * .25 ) * 2.75;
  vec3 col  = d * (.5 + .5 * sin( a + u_time + vec3( 2.9, 1.7, 0 ) ) );

  gl_FragColor = vec4(col,1.0);
}
