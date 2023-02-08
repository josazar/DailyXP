import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer, 
    SphereGeometry,
    MeshBasicMaterial, 
    Mesh,
    CubicBezierCurve3, 
    Vector3, 
    BufferGeometry, 
    LineBasicMaterial, 
Line,
BufferAttribute,
PointsMaterial,
Points,
ShaderMaterial,
Color} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Editor {
    renderer: WebGLRenderer;
    canvas;
    scene;
    camera;
    controls;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: false,
            stencil: true,
            depth: true,
            alpha: true, 
            preserveDrawingBuffer: true,
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvas = this.renderer.domElement;
        this.controls = new OrbitControls( this.camera, this.renderer.domElement)

        // Init camera position
        this.camera.position.z = 250;

        this.init();

    }

    init() {
        const particleCount = 10000;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 0] = Math.random() * 500 - 250;
            positions[i * 3 + 1] = Math.random() * 500 - 250;
            positions[i * 3 + 2] = Math.random() * 500 - 250;

            // Velocities
            velocities[i * 3 + 0] = Math.random() * 2 - 1;
            velocities[i * 3 + 1] = Math.random() * 2 - 1;
            velocities[i * 3 + 2] = Math.random() * 2 - 1;
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(positions, 3));
        geometry.setAttribute("velocity", new BufferAttribute(velocities, 3));

        const particleMaterial = new ShaderMaterial({
            uniforms: {
                color: { value: new Color(0xFFFFFF) },
                time: { value: 0 },
                bounce: { value: 0.9 },
                wind: { value: new Vector3(0.5, 0.5, 0.5) }
            },
            vertexShader: `
                attribute vec3 velocity;
                uniform float time;
                uniform float bounce;
                uniform vec3 wind;
                
                void main() {

                    vec3 newPosition = position + velocity * time + wind * time;

                    if (newPosition.y < 0.0) {
                        newPosition.y = abs(newPosition.y) * bounce;
                      }

                    gl_PointSize = 4. + velocity.x * 2.;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;

                void main() {
                    vec2 cxy = 2. * gl_PointCoord - 1.0;


                    if (dot(cxy, cxy) > 1.0) discard;
                    
                    float r = 0.5;
                    gl_FragColor = vec4(color, 1.);
                }
            `
        });

        const particleSystem = new Points(geometry, particleMaterial);

        this.scene.add(particleSystem);


        // RAF
        const animate =  () => {
            requestAnimationFrame(animate);
            particleMaterial.uniforms.time.value += .25;
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }


}