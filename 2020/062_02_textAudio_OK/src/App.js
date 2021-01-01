import React, { useState } from 'react'
import { TextAudio } from './Components/TextAudio/TextAudio'
import { ProgressManager } from './Components/TextAudio/ProgressManager'

function App() {
	return (
		<div className="App">
			<TextAudio />
			<ProgressManager />
		</div>
	)
}

export default App
