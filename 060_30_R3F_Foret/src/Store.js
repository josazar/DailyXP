import create from 'zustand'

export const useStore = create((set, get) => {
	let cancelRainTO = undefined

	return {
		acorns: [],
		currentScene: 0,
		fallingLeafs: false,
		// Main actions
		actions: {
			// ************************************
			// RainFall of acorns
			// *************************************
			rain() {
				let posX = Math.random() * 8 - 4
				let posZ = Math.random() * 8 - 4
				set((state) => ({
					acorns: [
						...state.acorns,
						{
							time: Date.now(),
							x: posX,
							z: posZ,
						},
					],
				}))
				clearTimeout(cancelRainTO)
				cancelRainTO = setTimeout(
					() =>
						set((state) => ({
							acorns: state.acorns.filter(
								(item) => Date.now() - item.time <= 3000
							),
						})),
					3000
				)
			},

			// *************************************
			toggleFallingLeaf(fallingLeafs = !get().fallingLeafs) {
				set({ fallingLeafs })
			},
			// *************************************

			nextScene: () =>
				set((state) => ({ currentScene: state.currentScene + 1 })),
			removeAllScenes: () => set({ currentScene: 0 }),
		},
	}
})
