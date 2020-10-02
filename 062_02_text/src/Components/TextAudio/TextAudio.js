import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SplitText from '../../vendors/gsap/SplitText'
import json from './story.json'

/* TODO:
_ create a JSON file
_ add data-time attribute to each sentences
*/
export const TextAudio = () => {
	console.log('render Text Audio')

	const textRef = useRef()
	const splitText = useRef()
	const wordElements = useRef([])

	useEffect(() => {
		splitText.current = new SplitText(textRef.current, { type: 'words' })
		wordElements.current.map((value) => (value.style.opacity = 1))
		handleAnim()
	}, [])

	const handleAnim = () => {
		wordElements.current.map((value, index) =>
			gsap.fromTo(
				value.children,
				{ opacity: 0 },
				{ duration: 2, opacity: 1, stagger: 0.1 }
			)
		)
	}

	return (
		<div ref={textRef} className="textContainer">
			{json.story.map((item, index) => (
				<span
					key={index}
					data-time={item.data_time}
					ref={(span) => (wordElements.current[index] = span)}
					className="sentence"
				>
					{item.text}
				</span>
			))}
		</div>
	)
}
