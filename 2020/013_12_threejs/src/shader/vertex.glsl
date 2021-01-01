
// varying vec2 vUv;

// void main()
// {
  //   vUv=uv;
  //   vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  //   gl_Position=projectionMatrix*mvPosition;
// }

uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;

uniform float time;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main(){
  
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  vec4 worldPosition=modelMatrix*vec4(position,1.);
  
  vec3 worldNormal=normalize(mat3(modelMatrix[0].xyz,modelMatrix[1].xyz,modelMatrix[2].xyz)*normal);
  
  vec3 I=worldPosition.xyz-cameraPosition;
  
  vReflect=reflect(I,worldNormal);
  vRefract[0]=refract(normalize(I),worldNormal,mRefractionRatio);
  vRefract[1]=refract(normalize(I),worldNormal,mRefractionRatio*.99);
  vRefract[2]=refract(normalize(I),worldNormal,mRefractionRatio*.98);
  vReflectionFactor=mFresnelBias+mFresnelScale*pow(1.+dot(normalize(I),worldNormal),mFresnelPower);
  
  gl_Position=projectionMatrix*mvPosition;
  
}
