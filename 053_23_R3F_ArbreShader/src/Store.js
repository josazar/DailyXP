import create from 'zustand'

export const useStore = create((set) => ({
	currentScene: 0,
	nextScene: () => set((state) => ({ currentScene: state.currentScene + 1 })),
	removeAllScenes: () => set({ currentScene: 0 }),
}))
