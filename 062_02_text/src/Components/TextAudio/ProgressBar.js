import React, { useEffect, useState } from 'react'
import './ProgressBar.css'
import { useStore } from '../../store'

export const ProgressBar = () => {
	const currenTime = useStore((state) => state.currenTime)
	const totalTime = useStore((state) => state.totalTime)
	const increaseTime = useStore((state) => state.increaseTime)
	const [finished, setFinished] = useState(false)

	const percent = (currenTime / totalTime) * 100

	useEffect(() => {
		const intervalID = setInterval(() => {
			if (currenTime < totalTime) increaseTime(0.1)
			else {
				setFinished(true)
				clearInterval(intervalID)
			}
		}, 100)

		return () => {
			clearInterval(intervalID)
		}
	})

	return (
		<>
			<div className="progress-bar">
				<div style={{ width: `${percent}%` }} className="progress"></div>
			</div>
			<span>{Math.trunc(currenTime)}</span>
			{finished && <p>THE END!</p>}
		</>
	)
}
