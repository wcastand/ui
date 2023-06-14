import { tw } from "twind"

import Snake from "../games/snake"
import Flappy from "../games/flappy"
import { container, section } from "../components"
import { useState } from "react"

function MiniGames() {
	const [focus, setF] = useState("")
	return (
		<div className={tw(container)} id="minigames">
			<div className={tw(section)}>
				<div className={tw("flex flex-row gap-12")}>
					<div onClick={() => setF("snake")}>
						<Snake focused={focus === "snake"} />
					</div>
					<div onClick={() => setF("flappy")}>
						<Flappy focused={focus === "flappy"} />
					</div>
				</div>
				<div
					className={tw("absolute bottom-2 left-2 text-sm flex flex-col px-2")}
				>
					<span>Click on the arcade to start it!</span>
				</div>
			</div>
		</div>
	)
}

export default MiniGames
