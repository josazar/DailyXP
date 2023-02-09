import create from "zustand";
import { BufferGeometry } from "three";
import toast from "react-hot-toast";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

export interface StoreState {
  activeGeometry: BufferGeometry | undefined
  loadPlyFile: (url: string) => void
}

const useStore = create<StoreState>()((set, get) => ({
  // States
  activeGeometry: undefined,


  // Actions
  loadPlyFile: (url) => {
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
