import React from 'react'
import MiniPlayer from './components/MiniPlayer'
import './App.css'

const STREAM_PLAYBACK_URL =
	'https://usher.ttvnw.net/api/lvs/hls/lvs.lvs-client-example.c6341be8-a3c7-42bc-b89a-8dabe040eae9.m3u8'

const App = () => (
	<div className="App">
		<MiniPlayer streamUrl={STREAM_PLAYBACK_URL} transition />
		{[...Array(10)].map((_, i) => (
			<div className="App-contentPlaceholder" key={i} />
		))}
	</div>
)

export default App
