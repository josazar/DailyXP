
uniform float time;
uniform float lerp;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionA;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vColorA;
varying float vIndex;

attribute vec3 color;
attribute vec3 colorA;
attribute float size;
attribute vec3 positionA;
attribute float pindex;

float PI=3.141592653589793238;

float random(vec2 st){
  return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))*
      43758.5453123);
    }
    void main()
    {
      vUv=uv;
      vColor=color;
      vColorA=colorA;
      vNormal=normal;
      vPosition=position;
      vPositionA=positionA;
      vIndex=pindex;
      
      vPosition.y+=cos(time+pindex)*size/60.;
      vPositionA.y+=cos(time+pindex)*size/60.;
      // vPosition.x+=sin(time)*size/30.;
      
      vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.);
      vec4 mvPositionA=modelViewMatrix*vec4(vPositionA,1.);
      
      mvPosition=mix(mvPosition,mvPositionA,lerp);
      gl_PointSize=(2.+size*8.)*(1./-mvPosition.z);
      gl_Position=projectionMatrix*mvPosition;
    }
    