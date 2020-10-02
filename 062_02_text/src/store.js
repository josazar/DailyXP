import create from 'zustand'

export const useStore = create((set, get) => {
	return {
		currenTime: 0,
		totalTime: 15,
		increasePercent: () => set((state) => ({ percent: state.percent + 1 })),
		increaseTime: (diff) =>
			set((state) => ({ currenTime: state.currenTime + diff })),
	}
})
