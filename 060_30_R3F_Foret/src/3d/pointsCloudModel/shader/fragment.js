const fragmentShader = `

uniform float u_time;
uniform float u_lerp;
uniform float u_progress;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionB;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vColorB;
varying float vPhytoncide;
varying float vSpeed;
varying float vModulo;

void main() {
  float t=mix(1.,1.-vModulo,vPhytoncide);
  float dist=length(gl_PointCoord-vec2(.5));
  float disc=smoothstep(.5,.49,dist);
  vec3 col=mix(vColor,vColorB,u_lerp);
  col*=1.4;
  gl_FragColor=vec4(col,disc*.7*t);

  // FOG color
  #ifdef USE_LOGDEPTHBUF_EXT
    float depth = gl_FragDepthEXT / gl_FragCoord.w;
  #else
    float depth = gl_FragCoord.z / gl_FragCoord.w;
  #endif
  float fogFactor = smoothstep( fogNear, fogFar, depth );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
}

`

export { fragmentShader }
