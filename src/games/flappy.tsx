import create from 'zustand'
import * as React from 'react'
import { css } from 'twind/css'
import { tw, apply } from 'twind'

import { randomInteger } from '../utils'
import { MiniCGames } from '../components'

const GRAVITY = 0.89
const FLAPPY_SIZE = 8
const title = apply(
	`text-white`,
	css`
		font-family: 'Courier New', Courier, monospace;
	`
)
const gyro = apply(
	`before:(rounded-lg transition-colors)`,
	css`
		position: relative;
		z-index: 1;
		&::before {
			z-index: -1;
			content: '';
			position: absolute;
			top: -20px;
			width: 25px;
			height: 25px;
			right: 15px;
		}
	`
)

type Block = { x: number; y: number; gap: number; width: number }
type State = {
	y: number
	velocity: number
	blocks: Block[]
	focused: boolean
	score: number
	best: number
	setF: (b: boolean) => void
	keydown: (event: KeyboardEvent) => void
	reset: () => void
	createBlock: () => void
	addScore: () => void
	draw: (ctx: CanvasRenderingContext2D | null) => void
}

const useStore = create<State>((set, get) => ({
	focused: false,
	y: 45,
	velocity: -2,
	blocks: [],
	score: 0,
	best: 0,
	setF: (b) => set({ focused: b }),
	keydown: (event: KeyboardEvent) => {
		if (!get().focused) return
		switch (event.key) {
			case 'ArrowUp':
			case 'w':
			case ' ':
				if (get().velocity > -4) set((s) => ({ velocity: s.velocity - 4 }))
				break
		}
	},
	createBlock: () => {
		let id: NodeJS.Timeout
		id = setTimeout(() => {
			if (document.visibilityState === 'visible')
				set((s) => ({
					blocks: [
						...s.blocks,
						{
							x: 100,
							y: randomInteger(15, 85),
							gap: randomInteger(25, 40),
							width: randomInteger(10, 25),
						},
					],
				}))
			else clearTimeout(id)
			get().createBlock()
		}, 3000)
	},
	reset: () => {
		set((s) => ({
			focused: s.focused,
			y: 45,
			velocity: 0,
			blocks: [],
			score: 0,
			best: Math.max(s.best, s.score),
		}))
	},
	addScore: () => set((s) => ({ score: s.score + 1 })),
	draw: (ctx) => {
		if (ctx === null) return
		// update if game is focused
		if (get().focused && document.visibilityState === 'visible') {
			const blocks: Block[] = []
			for (let block of get().blocks) {
				if (block.x + block.width >= 0) {
					block.x -= 3
					blocks.push(block)
				} else get().addScore()
			}
			set((s) => ({
				blocks,
				y: s.y + s.velocity,
				velocity: s.velocity + GRAVITY,
			}))
			// collision
			const player = get().y
			for (let block of get().blocks) {
				if (block.x < 25 + FLAPPY_SIZE && block.x + block.width > 25 + FLAPPY_SIZE) {
					if (player < block.y - block.gap / 2 || player + FLAPPY_SIZE > block.y + block.gap / 2) get().reset()
				}
			}
		}

		// Draw stuff
		ctx.clearRect(0, 0, 100, 100)
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, 100, 100)

		ctx.fillStyle = 'white'
		// draw blocks
		for (let block of get().blocks) {
			ctx.fillRect(block.x, 0, block.width, block.y - block.gap / 2)
			ctx.fillRect(block.x, block.y + block.gap / 2, block.width, 100 - block.y + block.gap / 2)
		}

		// draw flappy cube
		ctx.fillRect(25, get().y, FLAPPY_SIZE, FLAPPY_SIZE)
	},
}))

function Flappy({ focused }: { focused: boolean }) {
	const state = useStore()

	React.useEffect(() => {
		state.setF(focused)
	}, [focused])

	React.useEffect(() => {
		document.addEventListener('keydown', state.keydown)
		return () => document.removeEventListener('keydown', state.keydown)
	}, [state.keydown])

	React.useEffect(() => {
		state.createBlock()
	}, [])

	return (
		<div
			className={tw(
				'flex flex-col justify-center items-center rounded gap-0 cursor-pointer',
				gyro,
				focused ? 'before:(bg-green-500)' : 'before:(bg-red-500)'
			)}
		>
			<div className={tw(title, 'bg-gradient-to-b from-green-400 to-green-600 text-white flex-1 w-full font-bold text-center text-lg')}>
				Flappy
			</div>
			<div
				className={tw(
					'p-0 m-0 flex flex-row w-full justify-end bg-black',
					'border-2 border-b-0 border-green-600',
					css`
						width: 104px;
						font-size: 0.7rem;
					`
				)}
			>
				<span className={tw(title, 'flex-1 pl-1 text-left')}>Score:{state.score}</span>
			</div>
			<div className={tw('border-2 border-t-0 border-b-0 border-green-600')}>
				<MiniCGames draw={state.draw} FPS={12} />
			</div>
			<div
				className={tw(
					'p-0 m-0 flex flex-row w-full items-center justify-center bg-black',
					'border-2 border-t-0 border-green-600',
					css`
						width: 104px;
						font-size: 0.7rem;
					`
				)}
			>
				<span className={tw(title, 'flex-1 pr-1 text-right')}>Best:{state.best}</span>
			</div>
			<div className={tw('relative w-full h-8 bg-gradient-to-b from-green-400 to-green-600')}>
				<div className={tw('absolute top-2 left-5')}>
					<div className={tw('absolute top-0 left-1 bg-gray-800 h-3 w-1')} />
					<div className={tw('absolute top-1 left-0 bg-gray-800 h-1 w-3')} />
				</div>
				<div className={tw('absolute right-7 top-4 rounded-full bg-gray-800 w-2 h-2')} />
				<div className={tw('absolute right-4 top-3 rounded-full bg-gray-800 w-2 h-2')} />
			</div>
		</div>
	)
}

export default Flappy
