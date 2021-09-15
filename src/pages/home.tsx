import React, { useLayoutEffect, useEffect } from 'react'
import { apply, tw } from 'twind'
import create from 'zustand'
import shallow from 'zustand/shallow'
import { TiMediaPlay, TiMediaPause } from 'react-icons/ti'
import { useObserver } from '@alexvcasillas/use-observer'
import { useTrail, animated, config } from 'react-spring'

import { container, section, Title, Canvas } from '../components'
import { randomInteger } from '../utils'

const wrapper = apply`absolute px-4 md:px-0`
const welcome = apply`text-2xl font-normal`
const name = apply`text-6xl font-bold`
const job = apply`text-4xl font-normal`
const plus = apply`text-xl font-normal`
const desc = apply`text-vase font-light`
const link = apply`px-4 first:pl-0 last:pr-0`
const btn = apply`px-2 py-1 text-base text-gray-400 hover:(text-gray-900) transition-colors text-center flex justify-center items-center`

type State = {
	playing: boolean
	state: boolean[]
	x: number
	y: number
	toggle: (p?: boolean) => void
	init: (w: number, h: number) => void
	tick: (state: boolean[], x: number, y: number) => boolean[]
	draw: (ctx: CanvasRenderingContext2D | null, { w, h }: { w: number; h: number }) => void
}

function getNeighbours(state: boolean[], x: number, y: number, width: number): number {
	let nb = 0
	for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (state[width * (x + j) + (y + i)]) nb++
	return nb
}

const useStore = create<State>((set, get) => ({
	playing: true,
	state: [],
	x: 0,
	y: 0,
	toggle: (p?: boolean) =>
		set((s) => ({
			playing: p ? p : !s.playing,
		})),
	init: (w: number, h: number) => {
		const x = Math.floor(w / 10)
		const y = Math.floor(h / 10)
		const size = x * y
		const lives = Math.floor(size * 0.2)
		let state: boolean[] = []
		for (let i = 0; i < size; i++) state[i] = false
		for (let i = 0; i < lives; i++) state[randomInteger(0, size)] = true
		set({ state, x, y, playing: true })
	},
	tick: (state: boolean[], x: number, y: number): boolean[] => {
		const newState = state.slice()
		for (let i = 0; i < y; i++)
			for (let j = 0; j < x; j++) {
				const index = x * i + j
				const cell = state[index]
				const alivedNeighbours = getNeighbours(state, i, j, x)
				if (cell) {
					if (alivedNeighbours === 3 || alivedNeighbours === 4) newState[index] = true
					else newState[index] = false
				} else {
					if (alivedNeighbours === 3) newState[index] = true
					else newState[index] = false
				}
			}
		return newState
	},
	draw: (ctx: CanvasRenderingContext2D | null, { w, h }: { w: number; h: number }) => {
		if (ctx === null) return
		const isPlaying = get().playing
		if (!isPlaying) return
		const x = get().x
		const y = get().y
		const tick = get().tick
		const state = get().state

		const newState = tick(state, x, y)

		ctx.clearRect(0, 0, w, h)
		ctx.fillStyle = '#f1f1f1'
		for (let i = 0; i < y; i++)
			for (let j = 0; j < x; j++) {
				const cell = newState[x * i + j]
				if (cell) ctx.fillRect(j * 10, i * 10, 10, 10)
			}
		set({ state: newState })
	},
}))

const isPlayingSelector = (s: State) => s.playing
const selector = (
	s: State
): [
	(w: number, h: number) => void,
	(p?: boolean) => void,
	(ctx: CanvasRenderingContext2D | null, { w, h }: { w: number; h: number }) => void
] => [s.init, s.toggle, s.draw]

function Home() {
	const { inView, ref } = useObserver({ threshold: 0.1 })
	const [init, toggle, draw] = useStore(selector, shallow)
	const isPlaying = useStore(isPlayingSelector, shallow)
	const trail = useTrail(5, {
		cancel: !inView,
		delay: 500,
		config: config.gentle,
		opacity: 1,
		transform: 'translateY(0px)',
		from: { opacity: 0, transform: 'translateY(30px)' },
	})

	function reset() {
		if (!ref.current) return
		const rect = ref.current.getBoundingClientRect()
		init(rect.width, rect.height)
	}

	useEffect(() => {
		reset()
	}, [])
	useLayoutEffect(() => {
		window.addEventListener('resize', reset)
		return () => window.removeEventListener('resize', reset)
	}, [])

	return (
		<section className={tw(container, 'h-screen')} id="home">
			<div ref={ref} className={tw(section, `shadow-md rounded-sm`)}>
				<Title title="Intro." />
				<Canvas containerRef={ref} draw={draw} FPS={12} />
				<div className={tw('absolute top-16 left-2 flex flex-row justify-center items-center gap-1')}>
					<button className={tw(btn)} onClick={reset}>
						reset
					</button>
					<button className={tw(btn)} onClick={() => toggle()}>
						{isPlaying ? <TiMediaPause size={20} /> : <TiMediaPlay size={20} />}
					</button>
				</div>
				<div className={tw(wrapper)}>
					<animated.span style={trail[0]} className={tw(welcome)}>
						Hi, I'm
					</animated.span>
					<animated.h1 style={trail[1]} className={tw(name)}>
						William
					</animated.h1>
					<animated.h3 style={trail[2]} className={tw(job)}>
						Fullstack JS/TS developer
					</animated.h3>
					<animated.h5 style={trail[3]} className={tw(plus)}>
						and beginner in Rust
					</animated.h5>
					<animated.p style={trail[3]} className={tw(desc)}>
						Mainly fun and experiments found here, also looking for a remote job.
					</animated.p>
					<animated.div style={trail[4]}>
						<a target="_blank" className={tw(link)} href="https://twitter.com/wcastand" tabIndex={1} accessKey="t" title="Twitter">
							Twitter
						</a>
						-
						<a target="_blank" className={tw(link)} href="https://github.com/wcastand" tabIndex={2} accessKey="g" title="Github">
							Github
						</a>
						-
						<a
							target="_blank"
							className={tw(link)}
							href="https://www.linkedin.com/in/wcastand/"
							tabIndex={3}
							accessKey="l"
							title="Linkedin"
						>
							Linkedin
						</a>
					</animated.div>
				</div>
			</div>
		</section>
	)
}

export default Home
