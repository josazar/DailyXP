precision highp float;
uniform vec2 u_resolution;  // Width and height of the shader
uniform float u_time;  // Time elapsed

// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.01 // Surface Distance


mat2 Rot(float a) {
 float s = sin(a);
 float c = cos(a);
 return mat2(c, -s, s, c);
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
  vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float GetDist(vec3 p)
{
    vec4 s = vec4(0,1,6.,1);
    float sphereDist = length(p-s.xyz) - s.w - sin(p.x*5.5+u_time*2.)*.2;
    float planeDist = p.y;

    vec3 bp = p - vec3(0,2,10.5);
    float scale = mix(1., 2., smoothstep(-2.,2.,bp.y));
    bp.xy *= scale;
    bp.xy *= Rot(2.85);
    float box = sdBox(bp,vec3(1.6,1,3));

    float Cyl = sdRoundedCylinder(p-vec3(0.,1.5*cos(u_time)*0.1+.85,6.), .55, .54, .01)- sin(p.y*4.5)*.2;;

    float d = min(sphereDist*0.6,planeDist);
    d = min(d, Cyl);
    d = min(d, box);



    return d;
}

float RayMarch(vec3 ro, vec3 rd)
{
    float dO = 0.; //Distane Origin
    for(int i=0;i<MAX_STEPS;i++)
    {
        vec3 p = ro + rd * dO;
        float ds = GetDist(p); // ds is Distance Scene
        dO += ds;
        if(dO > MAX_DIST || ds < SURF_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p); // Distance
    vec2 e = vec2(.01,0); // Epsilon
    vec3 n = d - vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx));

    return normalize(n);
}


float GetLight(vec3 p)
{
    // Directional light
    vec3 lightPos = vec3(5.,5.,1.0); // Light Position
    vec3 l = normalize(lightPos-p); // Light Vector
    vec3 n = GetNormal(p); // Normal Vector

    float dif = dot(n,l); // Diffuse light
    dif = clamp(dif,0.,1.); // Clamp so it doesnt go below 0

    // // Shadows
    // float d = RayMarch(p+n*SURF_DIST*2., l);

    // if(d<length(lightPos-p)) dif *= .1;
    return dif;
}


void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 ro = vec3(0.2*cos(u_time),1,1.5); // Ray Origin/ Camera
    vec3 rd = normalize(vec3(uv.x,uv.y,1));
    float d = RayMarch(ro,rd); // Distance
    vec3 p = ro + rd * d;
    float dif = GetLight(p);
    vec3 color = vec3(dif);
    // Set the output color
    gl_FragColor = vec4(color,1.0);
}
