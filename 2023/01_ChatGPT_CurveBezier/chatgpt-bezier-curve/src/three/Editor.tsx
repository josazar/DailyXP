import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer, 
    SphereGeometry,
    MeshBasicMaterial, 
    Mesh} from 'three'

export class Editor {
    renderer: WebGLRenderer;
    canvas;
    scene;
    camera;

    constructor(canvas: HTMLCanvasElement) {
        // First, we need to create a scene, a camera, and a renderer
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

        // Init camera position
        this.camera.position.z = 15;

        this.init();

        // RAF
        this.animate()
    }

    init() {
        const radius = 5;
        const widthSegments = 32;
        const heightSegments = 32;
        const geometry = new SphereGeometry(radius, widthSegments, heightSegments);

        const material = new MeshBasicMaterial({ color: 0xffffff });
        const sphere = new Mesh(geometry, material);
        this.scene.add(sphere);
    }

    animate =  () => {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
      };
}