import * as React from 'react'
import { tw } from 'twind'
import { css } from 'twind/css'

import BlackAround from './pages/blackaround'
import Home from './pages/home'
// import Racer from './pages/racer'

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
				{/* <Racer /> */}
			</div>
		</React.Suspense>
	)
}

export default App
