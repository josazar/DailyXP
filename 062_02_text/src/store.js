import create from 'zustand'

export const useStore = create((set, get) => {
	return {
		currentTime: 0,
		totalTime: 32,
		currentPhrase: -1,
		increasePercent: () => set((state) => ({ percent: state.percent + 1 })),
		increaseTime: (diff) =>
			set((state) => ({ currentTime: state.currentTime + diff })),
	}
})
