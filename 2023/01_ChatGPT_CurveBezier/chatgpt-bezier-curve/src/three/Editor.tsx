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
Line} from 'three'

export class Editor {
    renderer: WebGLRenderer;
    canvas;
    scene;
    camera;

    constructor(canvas: HTMLCanvasElement) {
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
        this.camera.position.z = 70;

        this.init();

    }

    init() {
        // Set up the curves and add them to the scene
        var curves: Line<BufferGeometry, LineBasicMaterial>[] = [];
        for (var i = 0; i < 25; i++) {
            var points = [    
                new Vector3( -20, 0, i * 2 ),   
                new Vector3( -10, 15, i * 3 ),    
                new Vector3( 20, 0, i * 4 ),   
                new Vector3( 20, 10, i * 5 )  
            ];
            var curve = this.drawSplineCurve(points);
            this.scene.add(curve);
            curves.push(curve);
        }

        // RAF
        const animate =  () => {
            requestAnimationFrame(animate);


            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }


    drawSplineCurve(points: Vector3[]) {
        // Create the curve
        var curve = new CubicBezierCurve3(
            points[0],
            points[1],
            points[2],
            points[3]
        );
        
        // Get a set of points along the curve
        var curvePoints = curve.getPoints(50);
        
        // Create a buffer geometry to hold the curve points
        var curveGeometry = new BufferGeometry().setFromPoints(curvePoints);
        
        // Create a material and a line from the geometry
        var curveMaterial = new LineBasicMaterial({ color: 0xffff00, linewidth: 50 });
        var curveLine = new Line(curveGeometry, curveMaterial);

        return curveLine;
    }
}