import React from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import CloudPoints from './CloudPoints';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'


const ScenePoints = () => {

  // const treeGeometry = useLoader(PLYLoader, '/3D/tree_2.ply')
  // const josephGeometry = useLoader(PLYLoader, '/3D/JosephLow.ply')
  const moonchazar = useLoader(PLYLoader, '/3D/moonchazar_clean.ply')


  return (
    <group>
      {/* <CloudPoints bufferGeometry={treeGeometry}/> */}
      <CloudPoints bufferGeometry={moonchazar}/>
    </group>
  );
};

export default ScenePoints;
