import create from "zustand";
import { BufferGeometry, Vector2 } from "three";
import toast from "react-hot-toast";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

export interface StoreState {
  mouseMoved: boolean;
  mouseCoords: Vector2;
  activeGeometry: BufferGeometry | undefined;
}

const useStore = create<StoreState>()((set, get) => ({
  // States
  mouseMoved: false,
  mouseCoords: new Vector2(),
  activeGeometry: undefined,

  // Actions
  setMouseMove: (bool: boolean) => {
    set({ mouseMoved: bool });
  },
  setMouseCoords: ({ x, y } : {x: number, y: number}) => {
    get().mouseCoords.set(x, y);
  },
  loadPlyFile: (url: string) => {
    const loader = new PLYLoader();

    toast.loading("Loading...", {
      position: "bottom-center"
    });

    loader.load(
      url,
      (geometry) => {
        geometry.center();
        set({ activeGeometry: geometry });
        setTimeout(() => {
          toast.dismiss();
        }, 500);
      },
      (error) => {
      }
    );
  }
}));

export default useStore;
