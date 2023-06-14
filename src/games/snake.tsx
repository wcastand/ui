import { create } from "zustand"
import { css } from "twind/css"
import { tw, apply } from "twind"

import { randomInteger } from "../utils"
import { MiniCGames } from "../components"
import { useEffect } from "react"

const BLOCK_SIZE = 4
const gyro = apply(
	`before:(rounded transition-colors)`,
	css`
		position: relative;
		z-index: 1;
		&::before {
			z-index: -1;
			content: '';
			position: absolute;
			top: -10px;
			width: 15px;
			height: 15px;
			right: 15px;
		}
	`,
)
const title = apply(
	`text-white`,
	css`
		font-family: 'Courier New', Courier, monospace;
	`,
)

function isMultipleOf4(n: number): boolean {
	if (n == 1) return false
	// Find XOR of all numbers from 1 to n
	let XOR = 0
	for (let i = 1; i <= n; i++) XOR = XOR ^ i
	// If XOR is equal n, then return true
	return XOR == n
}

function getPosition(): POS {
	let x = randomInteger(0, 100 - BLOCK_SIZE)
	let y = randomInteger(0, 100 - BLOCK_SIZE)
	while (!isMultipleOf4(x)) x = randomInteger(0, 100 - BLOCK_SIZE)
	while (!isMultipleOf4(y)) y = randomInteger(0, 100 - BLOCK_SIZE)
	return { x, y }
}

const detection = (current: POS) => ({ x, y }: POS, index: number): boolean =>
	index !== 0 && x === current.x && y === current.y

type POS = { x: number; y: number }
type State = {
	focused: boolean
	direction: "N" | "S" | "W" | "E"
	length: number
	best: number
	path: POS[]
	food: POS
	setF: (b: boolean) => void
	reset: () => void
	keydown: (event: KeyboardEvent) => void
	draw: (ctx: CanvasRenderingContext2D | null) => void
}

const useStore = create<State>((set, get) => ({
	focused: false,
	direction: "E",
	length: 1,
	best: 0,
	path: [{ x: 48, y: 48 }],
	food: getPosition(),
	setF: (b) => set({ focused: b }),
	reset: () => {
		set((s) => ({
			focused: s.focused,
			direction: s.direction,
			length: 1,
			best: Math.max(s.best, s.length),
			path: [{ x: 48, y: 48 }],
			food: getPosition(),
		}))
	},
	keydown: (event: KeyboardEvent) => {
		// listen to keyboard event only if game is focused
		if (!get().focused) return
		switch (event.key) {
			case "ArrowUp":
			case "w":
				set((s) => ({ direction: s.direction !== "S" ? "N" : s.direction }))
				break
			case "ArrowDown":
			case "s":
				set((s) => ({ direction: s.direction !== "N" ? "S" : s.direction }))
				break
			case "ArrowLeft":
			case "a":
				set((s) => ({ direction: s.direction !== "E" ? "W" : s.direction }))
				break
			case "ArrowRight":
			case "d":
				set((s) => ({ direction: s.direction !== "W" ? "E" : s.direction }))
				break
		}
	},
	draw: (ctx) => {
		if (ctx === null) return
		// update if game is focused
		let pos = get().path[0]
		const direction = get().direction
		const path = get().path.slice()
		const food = get().food
		if (get().focused && document.visibilityState === "visible") {
			// driving
			switch (direction) {
				case "N":
					path.unshift({
						x: pos.x,
						y: pos.y - BLOCK_SIZE < 0 ? 100 - BLOCK_SIZE : pos.y - BLOCK_SIZE,
					})
					break
				case "S":
					path.unshift({
						x: pos.x,
						y: pos.y + BLOCK_SIZE >= 100 ? 0 : pos.y + BLOCK_SIZE,
					})
					break
				case "W":
					path.unshift({
						x: pos.x - BLOCK_SIZE < 0 ? 100 - BLOCK_SIZE : pos.x - BLOCK_SIZE,
						y: pos.y,
					})
					break
				case "E":
					path.unshift({
						x: pos.x + BLOCK_SIZE >= 100 ? 0 : pos.x + BLOCK_SIZE,
						y: pos.y,
					})
					break
			}
			pos = path[0]
			// test loose condition collision
			if (path.some(detection(pos))) {
				get().reset()
			}

			// test eating food
			if (pos.x === food.x && pos.y === food.y)
				set((s) => ({ length: s.length + 1, food: getPosition() }))

			// make sure we only save used positions in path[]
			path.splice(get().length)
			set({ path })
		}

		// Draw stuff
		ctx.clearRect(0, 0, 100, 100)
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, 100, 100)

		ctx.fillStyle = "red"
		ctx.fillRect(food.x, food.y, BLOCK_SIZE, BLOCK_SIZE)

		ctx.fillStyle = "white"
		for (let i = 0; i < get().length; i++)
			ctx.fillRect(path[i].x, path[i].y, BLOCK_SIZE, BLOCK_SIZE)
	},
}))

function Snake({ focused }: { focused: boolean }) {
	const state = useStore()

	useEffect(() => {
		state.setF(focused)
	}, [focused])

	useEffect(() => {
		document.addEventListener("keydown", state.keydown)
		return () => document.removeEventListener("keydown", state.keydown)
	}, [state.keydown])

	return (
		<div
			className={tw(
				"flex flex-col justify-center items-center rounded gap-0 cursor-pointer",
				gyro,
				focused ? "before:(bg-green-500)" : "before:(bg-red-500)",
			)}
		>
			<div
				className={tw(
					title,
					"bg-gradient-to-b from-gray-100 to-gray-300 text-gray-800 flex-1 w-full font-bold text-center text-lg",
				)}
			>
				Snake
			</div>
			<div
				className={tw(
					"p-0 m-0 flex flex-row w-full justify-end bg-black",
					"border-2 border-b-0 border-gray-300",
					css`
						width: 104px;
						font-size: 0.7rem;
					`,
				)}
			>
				<span className={tw(title, "flex-1 pl-1 text-left")}>
					Score:{state.length}
				</span>
			</div>
			<div className={tw("border-2 border-b-0 border-t-0 border-gray-300")}>
				<MiniCGames draw={state.draw} FPS={12} />
			</div>
			<div
				className={tw(
					"p-0 m-0 flex flex-row w-full items-center justify-center bg-black",
					"border-2 border-t-0 border-gray-300",
					css`
						width: 104px;
						font-size: 0.7rem;
					`,
				)}
			>
				<span className={tw(title, "flex-1 pr-1 text-right")}>
					Best:{state.best}
				</span>
			</div>
			<div
				className={tw(
					"relative w-full h-8 bg-gradient-to-b from-gray-100 to-gray-400",
				)}
			>
				<div className={tw("absolute top-2 left-5")}>
					<div className={tw("absolute top-0 left-1 bg-gray-800 h-3 w-1")} />
					<div className={tw("absolute top-1 left-0 bg-gray-800 h-1 w-3")} />
				</div>
				<div
					className={tw(
						"absolute right-7 top-4 rounded-full bg-gray-800 w-2 h-2",
					)}
				/>
				<div
					className={tw(
						"absolute right-4 top-3 rounded-full bg-gray-800 w-2 h-2",
					)}
				/>
			</div>
		</div>
	)
}

export default Snake
