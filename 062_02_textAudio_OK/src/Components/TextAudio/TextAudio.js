import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SplitText from '../../vendors/gsap/SplitText'
import json from './story.json'
import { useStore } from '../../store'

/* TODO:
X create a JSON file
X add data-time attribute to each sentences
_ afficher Opacity 1 si data-time <= currenTime
*/
export const TextAudio = () => {
	const textRef = useRef()
	const splitText = useRef()
	const wordElements = useRef([])
	const currentPhrase = useStore((state) => state.currentPhrase)
	console.log('Render Text audio')

	useEffect(() => {
		splitText.current = new SplitText(textRef.current, { type: 'words' })
	}, [])
	useEffect(() => {
		if (currentPhrase !== -1) showElement(wordElements.current[currentPhrase])
	}, [currentPhrase])

	const showElement = (elem) => {
		// gsap.fromTo(elem, { opacity: 0 }, { duration: 1, opacity: 1, stagger: 0.1 })
		// gsap.fromTo(
		// 	elem.children,
		// 	{ opacity: 0 },
		// 	{ duration: 0.75, opacity: 1, stagger: 0.25 }
		// )
		gsap.to(elem.children, { duration: 0.45, color: 'white', stagger: 0.25 })
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
