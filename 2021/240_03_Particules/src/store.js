import create from 'zustand'
import { Vector2 } from 'three'

const useStore = create(set => ({
  pointerSpace: {x: 0, y: 0},
  // uniforms: {
  //   uTime: { type: "f", value: 0 },
  //   uMouse: { value: new Vector2(0,0.5)}
  // }
  // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 })
}))


export default useStore
