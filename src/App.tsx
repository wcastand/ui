import { tw } from 'twind'
import * as React from 'react'
import { css } from 'twind/css'

import Poe from './pages/poe'
import Home from './pages/home'
import Pong from './pages/pong'
import Todo from './pages/todo'
import SignIn from './pages/signin'
import Loading from './pages/loading'
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
				<SignIn />
				<Pong />
				<Poe />
				<Loading />
				<Todo />
			</div>
		</React.Suspense>
	)
}

export default App
