import { tw } from "twind"
import * as React from "react"
import { css } from "twind/css"

import Home from "./pages/home"
import Todo from "./pages/todo"
import OClock from "./pages/clock"
import Loading from "./pages/loading"
import BlackAround from "./pages/blackaround"
import ColorMind from "./pages/colormind"

import { inject } from "@vercel/analytics"

inject()

const snapper = css`
	max-height: 100vh;
	overflow-y: scroll;
	scroll-snap-type: y mandatory;
`

function App() {
	return (
		<React.Suspense fallback={"loading"}>
			<div className={tw(snapper)}>
				<Home />
				<BlackAround />
				<Loading />
				<Todo />
				<OClock />
				<ColorMind />
			</div>
		</React.Suspense>
	)
}

export default App
