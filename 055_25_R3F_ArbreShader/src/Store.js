import create from 'zustand'

export const useStore = create((set, get) => {
	let cancelRainTO = undefined
	let cancelWavesTO = undefined

	return {
		currentScene: 0,
		nextScene: () => set((state) => ({ currentScene: state.currentScene + 1 })),
		removeAllScenes: () => set({ currentScene: 0 }),
		acorns: [],
		waves: [],

		// Main actions
		actions: {
			// RainFall of acorns
			rain() {
				let posX = Math.random() * 6 - 3
				let posY = Math.random() * 6 - 3
				set((state) => ({
					acorns: [
						...state.acorns,
						{
							time: Date.now(),
							x: posX,
							z: posY,
						},
					],
				}))
				// waves
				set((state) => ({
					waves: [
						...state.waves,
						{
							time: Date.now(),
							x: posX,
							z: posY,
						},
					],
				}))
				clearTimeout(cancelRainTO)
				cancelRainTO = setTimeout(
					() =>
						set((state) => ({
							acorns: state.acorns.filter(
								(item) => Date.now() - item.time <= 1000
							),
						})),
					1000
				)
			},
		},
	}
})
