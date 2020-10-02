import React, { useEffect, useState, useRef } from 'react'
import './ProgressBar.css'
import { useStore } from '../../store'
import json from './story.json'

export const ProgressManager = () => {
	const currentTime = useStore((state) => state.currentTime)
	const totalTime = useStore((state) => state.totalTime)
	const currentPhrase = useStore((state) => state.currentPhrase)
	const increaseTime = useStore((state) => state.increaseTime)
	const [finished, setFinished] = useState(false)
	const dataTimes = useRef([])
	const percent = (currentTime / totalTime) * 100

	// get data_time from JSON in a simple array
	useEffect(() => {
		json.story.map((value, index) => {
			dataTimes.current.push(value.data_time)
		})
	}, [])

	// LOOP that increase currentTime
	useEffect(() => {
		const intervalID = setInterval(() => {
			if (currentTime < totalTime) increaseTime(0.1)
			else {
				setFinished(true)
				clearInterval(intervalID)
			}
			if (dataTimes.current[currentPhrase + 1] < currentTime) {
				useStore.setState({ currentPhrase: currentPhrase + 1 })
			}
			if (currentTime <= totalTime) clearInterval(intervalID)
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
		</>
	)
}
