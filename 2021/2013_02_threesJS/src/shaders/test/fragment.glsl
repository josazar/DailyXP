uniform float uTime;

uniform vec3 uColor;
varying vec2 vUv;

float easeQuintInOut(float t){
    t=t*2.;if(t<1.)return.5*t*t*t*t*t;
    return.5*((t-=2.)*t*t*t*t+2.);
}

float circleSDF(vec2 st){
    return length(st-.5)*2.;
}
float fill(float x,float size){
    return 1.-step(size,x);
}

void main()
{
    vec3 color=vec3(vUv,1.);
    float c=circleSDF(vUv);
    // float ease=easeQuintInOut(sin(uTime)*.5+.85);
    c=fill(c,.75);
    float A=c;
    
    gl_FragColor=vec4(color,A);
}
