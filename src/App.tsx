import { tw } from 'twind'
import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { css } from 'twind/css'

import Home from './pages/home'
import Todo from './pages/todo'
import SignIn from './pages/signin'
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
							<SignIn />
							<Todo />
							<JeopardyApp />
						</Route>
					</Switch>
				</Router>
			</div>
		</React.Suspense>
	)
}

export default App
