import create from 'zustand'
import { Vector2 } from 'three'
import toast from 'react-hot-toast';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'


const useStore = create(set => ({
  pointerSpace: {x: 0, y: 0, z: 0},
  activeGeometry: null,

  loadPlyFile: (url) => {
    const loader = new PLYLoader()

    toast.loading('Loading...', {
        position: 'bottom-center',
    });
        
    loader.load(
        url,
        (geometry) => {
            geometry.center()
            set({ activeGeometry: geometry })
            setTimeout(() => {  toast.dismiss() }, 500);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
      )
    
  },
}))


export default useStore
