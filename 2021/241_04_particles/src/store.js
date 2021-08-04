import create from 'zustand'
import { Vector2 } from 'three'

const useStore = create(set => ({
  pointerSpace: {x: 0, y: 0, z: 0},
}))


export default useStore
