import React from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import CloudPoints from './TreePoints';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'


const ScenePoints = () => {

  const treeGeometry = useLoader(PLYLoader, '/3D/tree_2.ply')
  const josephGeometry = useLoader(PLYLoader, '/3D/JosephLow.ply')


  return (
    <group>
      <CloudPoints bufferGeometry={treeGeometry}/>
      <CloudPoints bufferGeometry={josephGeometry}/>
    </group>
  );
};

export default ScenePoints;
