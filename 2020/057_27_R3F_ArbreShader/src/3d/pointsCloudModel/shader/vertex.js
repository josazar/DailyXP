const vertexShader = `
uniform float u_time;
uniform float u_lerp;
uniform float u_swirlStep;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionB;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vColorB;
varying float vIndex;
varying float vSpeed;
varying float vPhytoncide;
varying float vModulo;

// args : x: Index, y: speed, z: size, w: Phytoncide (1 ou 0)
attribute vec4 args;
attribute vec3 color;
attribute vec3 colorB;
attribute vec3 positionB;

vec3 swirl(vec3 p,float i,float dist){
  vec3 pSwirl=vec3(p.x+cos(u_time+i)/dist,p.y,p.z+sin(u_time+i)/dist);
  return pSwirl;
}

  void main() {
    vUv = uv;
    vUv=uv;
    vColor=color;
    vColorB = colorB;
    vNormal=normal;
    vPosition=position;
    vPositionB=positionB;
    vIndex=args.x;
    vSpeed=clamp(args.y,.5,.8);
    float size= args.z;
    float phytoncide = args.w;
    vPhytoncide=phytoncide;

    // first model A position
    vPosition.y+=cos(u_time+vIndex)*size/60.*(1.-phytoncide)+.1;
    // Second model B position
    vPositionB.y+=cos(u_time+vIndex)*size/60.*(1.-phytoncide)+.13;
    vPositionB.x-=.5;

    // phytoncide
    // --------------------------------
    vModulo=mod(u_time/(55.*(1.05-vSpeed)),1.);
    float t=mix(1.,vModulo,vPhytoncide);
    // 1er morph target
    float offsetY=vPosition.y+t;
    // swirl
    vec3 pSwirl=mix(vPosition,swirl(vPosition,vIndex,2.),u_swirlStep+.05);
    vPosition=mix(vPosition,pSwirl,phytoncide);
    vPosition.y=mix(vPosition.y,offsetY,phytoncide);

    // 2ieme morph target
    offsetY=vPositionB.y+.5*t;
    // swirl
    pSwirl=mix(vPositionB,swirl(vPositionB,vIndex,2.),u_swirlStep+.05);
    vPositionB = mix(vPositionB,pSwirl,phytoncide);
    vPositionB.y= mix(vPositionB.y,offsetY,phytoncide);

    // --------------------------------------
    // end phytoncide


    vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.);
    vec4 mvPositionB=modelViewMatrix*vec4(vPositionB,1.);

    // Final Position
    mvPosition=mix(mvPosition,mvPositionB,u_lerp);

    float phytoncideSize=(size*15.)*(1./-mvPosition.z);

    gl_PointSize=mix(1.+(size*6.)*(1./-mvPosition.z),phytoncideSize,phytoncide);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export { vertexShader }
