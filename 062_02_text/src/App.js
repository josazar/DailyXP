import React, { useState } from 'react'
import { TextAudio } from './Components/TextAudio/TextAudio'
import { ProgressBar } from './Components/TextAudio/ProgressBar'

function App() {
	return (
		<div className="App">
			<TextAudio />
			<ProgressBar />
		</div>
	)
}

export default App
