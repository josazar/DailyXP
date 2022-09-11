import create from "zustand";
import { Vector2 } from "three";
import toast from "react-hot-toast";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

const useStore = create((set, get) => ({
  mouseMoved: false,
  mouseCoords: new Vector2(),
  activeGeometry: null,

  setMouseMove: (bool) => {
    set({ mouseMoved: bool });
  },
  setMouseCoords: ({ x, y }) => {
    get().mouseCoords.set(x, y);
  },

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
