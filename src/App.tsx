import * as React from 'react'

import BlackAround from './pages/blackaround'
// import Racer from './pages/racer'

function App() {
	return (
		<React.Suspense fallback={'loading'}>
			<div>
				<BlackAround />
				{/* <Racer /> */}
			</div>
		</React.Suspense>
	)
}

export default App
