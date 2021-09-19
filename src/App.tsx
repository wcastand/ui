import { tw } from 'twind'
import * as React from 'react'
import { css } from 'twind/css'

import Home from './pages/home'
import Todo from './pages/todo'
import OClock from './pages/clock'
import Loading from './pages/loading'
import MiniGames from './pages/minigames'
import JeopardyApp from './pages/jeopardy'
import BlackAround from './pages/blackaround'

const snapper = css`
	max-height: 100vh;
	overflow-y: scroll;
	scroll-snap-type: y mandatory;
`

function App() {
	return (
		<React.Suspense fallback={'loading'}>
			<div className={tw(snapper)}>
				<Home />
				<BlackAround />
				<Loading />
				<Todo />
				<JeopardyApp />
				<OClock />
				<MiniGames />
			</div>
		</React.Suspense>
	)
}

export default App
