import { useEffect, useRef, useState } from 'react';
import { Editor } from '../three/Editor';

const Scene = () => {
	const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(( ) => {
		if (!canvas.current) {
			return;
		}

        const editor = new Editor(canvas.current!);
    }, [canvas])

    return (<>
    <canvas
        id="canvas3d"
        ref={canvas}
    ></canvas>
    </>)
    
}
 
export default Scene;