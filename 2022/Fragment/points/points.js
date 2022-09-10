import {
    PerspectiveCamera, 
    Vector3,
    DataTexture, 
    BufferGeometry,
    BoxGeometry,
    InstancedMesh,
    MeshStandardMaterial,
    RGBFormat,
    FloatType,
    Mesh,
    MeshBasicMaterial,
    DynamicDrawUsage,
    HemisphereLight,
    MeshPhongMaterial,
    Matrix4,
    Color
}  from "three";

let camera;

export let props = {
    background: {
        value: "#0057b8",
    },
    count: {
        value:100
    }
}


const {w, h} = {
    w: 256,
    h: 256
}
const material = new MeshPhongMaterial( {color: 0x00ff00} );

export let init = ({ scene, width, height }) => {
    camera = new PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.z = 10;
    camera.lookAt(new Vector3());


    // Lights
    const light = new HemisphereLight( 0xffffff, 0x888888 );
    light.position.set( 0, 4, 0 );
    scene.add( light );
    // Instanced Mesh
    
    // Create a vertex buffer of size width * height with normalized coordinates   
    // const length = w * h; 
    // let vertices = new Float32Array(length * 3);
    // for (let i = 0; i < length; i++) {
    //     let i3 = i * 3;
    //     vertices[i3 + 0] = (i % w) / w;
    //     vertices[i3 + 1] = (i / w) / h;
    // }  
    //populate a Float32Array of random positions


    // Create the particles geometry
    const geometry = new BoxGeometry(2,2,2);

    
    // Shader Material   
    const mesh = new InstancedMesh(geometry, material, props.count.value );

    let i = 0;
    const offset = ( props.count.value - 1 ) / 2;

    const matrix = new Matrix4();

    for ( let x = 0; x < props.count.value; x ++ ) {

        for ( let y = 0; y < props.count.value; y ++ ) {

            for ( let z = 0; z < props.count.value; z ++ ) {

                matrix.setPosition( offset - x, offset - y, offset - z );

                mesh.setMatrixAt( i, matrix );
                mesh.setColorAt( i, new Color() );

                i ++;

            }

        }

    }

    scene.add(mesh);
};

export let update = ({ renderer, scene, time, deltaTime }) => {
    renderer.render(scene, camera);
};

export let resize = ({ width, height }) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

export let rendering = "three";



//returns an array of random 3D coordinates
function getRandomData( width, height, size ){
    var len = width * height * 3;
    var data = new Float32Array( len );
    while ( len-- ) data[len] = ( Math.random() -.5 ) * size ;

    return data;
}
