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

    return material
  }, [])


  // MouseEvent to get pointer 2D coordinates from -1 to 1 x/y - 0 at the center
  const onPointerMove = (event) => {

    pointer.x = event.point.x
    pointer.y = event.point.y
    pointer.z = event.point.z

    pointerSpace.x = event.spaceX
    pointerSpace.y = event.spaceY
    useStore.setState({ pointerSpace: {x: pointerSpace.x, y:pointerSpace.y } })
  }


  // RAF
  useFrame(({ clock }) => {
    // Material update
    const a = clock.getElapsedTime()

    ref.current.lookAt(camera.position)
    refTarget.current.position.set(pointer.x, pointer.y, pointer.z)

    ref.current.material.uniforms.uTime.value = a
    ref.current.material.uniforms.uMouse.value = { x: pointerSpace.x,  y: pointerSpace.y}
  })


  return (
    <group>
      <mesh ref={ref} onPointerMove={onPointerMove} material={shaderMaterial} >
        <planeGeometry args={[10,10, 1, 1]} />
      </mesh>
      <mesh ref={refTarget}>
        <sphereGeometry args={[0.4,12,12]} />
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default PlaneRayTracerTarget
