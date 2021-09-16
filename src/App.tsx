import { tw } from 'twind'
import * as React from 'react'
import { css } from 'twind/css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './pages/home'
import Todo from './pages/todo'
import OClock from './pages/clock'
import Loading from './pages/loading'
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
				<Router>
					<Switch>
						<Route exact path="/">
							<Home />
							<BlackAround />
							<Loading />
							<Todo />
							<JeopardyApp />
							<OClock />
						</Route>
					</Switch>
				</Router>
			</div>
		</React.Suspense>
	)
}

export default App
