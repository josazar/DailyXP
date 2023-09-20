import create from "zustand";
import { BufferGeometry } from "three";
import toast from "react-hot-toast";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

export interface StoreState {
  
}

const useStore = create<StoreState>()((set, get) => ({
  // States

}));

export default useStore;
