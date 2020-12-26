precision highp float;
uniform vec2 u_resolution;  // Width and height of the shader
uniform float u_time;  // Time elapsed

// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURFACE_DIST .01

float GetDist(vec3 p)
{
    vec4 s = vec4(0,1,6. + sin(u_time)*3.,1); //Sphere. xyz is position w is radius
    float sphereDist = length(p-s.xyz) - s.w;
    float planeDist = p.y;
    float d = min(sphereDist,planeDist);

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
        if(dO > MAX_DIST || ds < SURFACE_DIST) break;
    }
    return dO;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec3 ro = vec3(0,1,0); // Ray Origin/ Camera
    vec3 rd = normalize(vec3(uv.x,uv.y,1));
    float d = RayMarch(ro,rd); // Distance
    d/= 10.;
    vec3 color = vec3(d);

    // Set the output color
    gl_FragColor = vec4(color,1.0);
}
