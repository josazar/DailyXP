import create from 'zustand'

export const useStore = create((set, get) => {
	let cancelLaserTO = undefined
	return {
		currentScene: 0,
		nextScene: () => set((state) => ({ currentScene: state.currentScene + 1 })),
		removeAllScenes: () => set({ currentScene: 0 }),
		acorns: [],

		// Main actions
		actions: {
			// RainFall of acorns
			rain() {
				set((state) => ({
					acorns: [
						...state.acorns,
						{
							time: Date.now(),
							x: Math.random() * 2 - 1.5,
							z: Math.random() * 2 - 1.5,
						},
					],
				}))
				clearTimeout(cancelLaserTO)
				cancelLaserTO = setTimeout(
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
