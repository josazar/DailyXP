import * as THREE from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import vertexShader from './glsl/paint_vs.glsl?raw'
import fragmentShader from './glsl/paint_fs.glsl?raw'
import useStore from './store'
import { Vector2 } from 'three'


function PlaneRayTracerTarget({size}) {
  const { camera } = useThree()
  const ref = useRef()
  const refTarget = useRef()
  const pointer = new THREE.Vector3()

  const pointerSpace = new Vector2()





  // Material
  const shaderMaterial = useMemo(() => {
    const uniforms = {
        uTime: { type: "f", value: 0 },
        uMouse: { value: new Vector2(0,0)},
        PR: { type: "f",  value : window.devicePixelRatio},
        u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight)}
      }
    const material = new THREE.ShaderMaterial()
    material.uniforms = uniforms
    material.vertexShader = vertexShader
    material.fragmentShader = fragmentShader
    material.wireframe = true

    return material
  }, [])


  // MouseEvent to get pointer 2D coordinates from -1 to 1 x/y - 0 at the center
  const onPointerMove = (event) => {
    pointer.x = event.point.x
    pointer.y = event.point.y
    pointer.z = event.point.z

    // The plane must always follow the camera
    ref.current.lookAt(camera.position)
    refTarget.current.position.set(pointer.x, pointer.y, pointer.z)

    useStore.setState({ pointerSpace: {x: pointer.x, y:pointer.y, z: pointer.z } })
  }

  return (
    <group >
      <mesh ref={ref} onPointerMove={onPointerMove} material={shaderMaterial} visible={false}>
        <planeGeometry args={[20,20, 1, 1]} />
      </mesh>
      <mesh ref={refTarget} >
        <sphereGeometry args={[0.1,8,8]} />
        <meshBasicMaterial
          color="yellow"
          // side={THREE.DoubleSide}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  )
}

export default PlaneRayTracerTarget
