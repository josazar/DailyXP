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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Editor {
    renderer: WebGLRenderer;
    canvas;
    scene;
    camera;
    controls;

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
        this.controls = new OrbitControls( this.camera, this.renderer.domElement)

        // Init camera position
        this.camera.position.z = 20;

        this.init();

    }

    init() {
        // Set up the control points for the curves
        var points1 = [
            new Vector3( -10, 0, 0 ),
            new Vector3( -5, 5, 0 ),
            new Vector3( 0, 7, 0 ),
            new Vector3( 5, 5, 0 )
        ];
        var points2 = [
            new Vector3( 5, 5, 0 ),
            new Vector3( 10, 0, 0 ),
            new Vector3( 7, -5, 0 ),
            new Vector3( 0, -7, 0 )
        ];
        var points3 = [
            new Vector3( 0, -7, 0 ),
            new Vector3( -7, -5, 0 ),
            new Vector3( -10, 0, 0 ),
            new Vector3( -5, 5, 0 )
        ];
        var points4 = [
            new Vector3( -5, 5, 0 ),
            new Vector3( -3, 10, 0 ),
            new Vector3( 3, 10, 0 ),
            new Vector3( 5, 5, 0 )
        ];
        
        // Create the curves
        var curve1 = this.drawSplineCurve(points1);
        var curve2 = this.drawSplineCurve(points2);
        var curve3 = this.drawSplineCurve(points3);
        var curve4 = this.drawSplineCurve(points4);

        const curves: Line<BufferGeometry, LineBasicMaterial>[] = [];
        curves.push(curve1)
        curves.push(curve2)
        curves.push(curve3)
        curves.push(curve4)
        
        // Add the curves to the scene
        this.scene.add(curve1);
        this.scene.add(curve2);
        this.scene.add(curve3);
        this.scene.add(curve4);


        // RAF
        const animate =  () => {
            requestAnimationFrame(animate);
            // Update the position of the control points for each curve
            for (var i = 0; i < 4; i++) {
                var curve = this.scene.children[i] as Line<BufferGeometry, LineBasicMaterial>;
                var position = curve.geometry.attributes.position;
                for (var j = 0; j < position.count; j += 3) {
                    position.setXYZ(j, position.getX(j), Math.sin(Date.now() * 0.002 + j), position.getZ(j));
                }
                position.needsUpdate = true;
              }

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