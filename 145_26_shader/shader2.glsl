precision highp float;
uniform vec2 u_resolution;  // Width and height of the shader
uniform float u_time;  // Time elapsed

// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.01 // Surface Distance



float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}
float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}


float GetDist(vec3 p)
{
    vec4 s = vec4(0,1,6.,1); //Sphere. xyz is position w is radius
    float sphereDist = length(p-s.xyz) - s.w;
    float planeDist = p.y;
    float c1 = sdCapsule(p, vec3(0.,.5,6.),vec3(0.,1.,5.),0.15);
    float eyeG = sdCapsule(p, vec3(-.35,1.,6.),vec3(-.35,1.2,5.),0.08);
    float eyeD = sdCapsule(p, vec3(.35,1.,6.),vec3(.35,1.2,5.),0.08);
    float c2 = sdCapsule(p, vec3(.95,1.,6.),vec3(1.5,1.,4.5),0.25);
    float c3 = sdCapsule(p, vec3(-.95,1.,6.),vec3(-1.5,1.,4.5),0.25);
    float e = sdEllipsoid(p-vec3(0.65,1.5,5.5), vec3(.42,.65,.2));
    float e2 = sdEllipsoid(p-vec3(-0.65,1.5,5.5), vec3(.42,.65,.2));
    float d = min(sphereDist,planeDist);
    d =min(d, c1);
    d =min(d, c2);
    d =min(d, c3);
    d =min(d, e);
    d =min(d, e2);
    d =min(d, eyeG);
    d =min(d, eyeD);

    d+= sin(u_time)*0.04 ;

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
    vec3 lightPos = vec3(5.*cos(u_time)*0.2,5.,1.0*sin(u_time)*0.5); // Light Position
    vec3 l = normalize(lightPos-p); // Light Vector
    vec3 n = GetNormal(p); // Normal Vector

    float dif = dot(n,l); // Diffuse light
    dif = clamp(dif,0.,1.); // Clamp so it doesnt go below 0

    // Shadows
    float d = RayMarch(p+n*SURF_DIST*2., l);

    if(d<length(lightPos-p)) dif *= .1;
    return dif;
}


void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 ro = vec3(0,1,0); // Ray Origin/ Camera
    vec3 rd = normalize(vec3(uv.x,uv.y,1));
    float d = RayMarch(ro,rd); // Distance
    // d/= 10.;


    vec3 p = ro + rd * d;

    float dif = GetLight(p); // Diffuse lighting
    // d*= .2;

    // vec3 color = vec3(d);
    // vec3 color = vec3(0);
    vec3 color = vec3(dif);

    // color = GetNormal(p);

    // Set the output color
    gl_FragColor = vec4(color,1.0);
}
