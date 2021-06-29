import { apply, tw } from 'twind'
import React, { useRef, useCallback, useEffect } from 'react'
import { useObserver } from '@alexvcasillas/use-observer'

import { container, section, Title, Canvas } from '../components'

const canvas = apply`absolute top-0 left-0 w-full h-full`
const score = apply`z-10 absolute top-24 left-4 text-3xl text-gray-900`
const best = apply`z-10 absolute top-16 left-4 text-3xl text-gray-900`

const initState = {
	p1: 15,
	p2: 15,
	vy: 5,
	playing: false,
	ball: { x: 15, y: 15, vx: 3, vy: 0, speed: 1 },
	score: 0,
	best: 0,
	mouse: [0, 0],
}

function throttle(func: (...args: any) => void, timeout: number) {
	let ready: boolean = true
	// @ts-ignore
	return (...args) => {
		if (!ready) return
		ready = false
		// @ts-ignore
		func(...args)
		setTimeout(() => {
			ready = true
		}, timeout)
	}
}

function Pong() {
	const state = useRef(initState)
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const draw = useCallback(
		(ctx: CanvasRenderingContext2D | null) => {
			if (ctx === null || state.current === null) return
			const s = state.current
			const w = ctx.canvas.width
			const h = ctx.canvas.height

			let p1c = s.p1
			let p1t = s.p1 - 25
			let p1b = s.p1 + 25
			let p1l = 20
			let p1r = 30

			let p2c = s.p2
			let p2t = s.p2 - 25
			let p2b = s.p2 + 25
			let p2l = w - 30
			let p2r = w - 20

			if (s.playing) {
				// game on
				// player moves
				if (s.mouse[1] <= p1c + s.vy && s.mouse[1] >= p1c - s.vy) {
				} else if (s.mouse[1] >= p1c && p1b <= h - 20) {
					s.p1 += s.vy
					s.p2 += s.vy
				} else if (s.mouse[1] <= p1c && p1t >= 20) {
					s.p1 -= s.vy
					s.p2 -= s.vy
				}

				// collision
				let angle = 0
				if (s.ball.x > p2l && s.ball.x < p2r && s.ball.y > p2t && s.ball.y < p2b) {
					if (s.ball.y < p2c) angle = (-1 * Math.PI) / 4
					else if (s.ball.y > p2c) angle = Math.PI / 4
					s.ball.speed *= s.ball.speed < 3 ? 1.1 : 1
					s.ball.vx = -s.ball.speed * Math.cos(angle)
					s.ball.vy = s.ball.speed * Math.sin(angle)
					s.score++
				} else if (s.ball.x > p1l && s.ball.x < p1r && s.ball.y > p1t && s.ball.y < p1b) {
					if (s.ball.y < p1c) angle = (-1 * Math.PI) / 4
					else if (s.ball.y > p1c) angle = Math.PI / 4
					s.ball.speed *= s.ball.speed < 3 ? 1.1 : 1
					s.ball.vy = s.ball.speed * Math.sin(angle)
					s.ball.vx = s.ball.speed * Math.cos(angle)
					s.score++
				}

				// court collision
				if (s.ball.y > h - 20 || s.ball.y < 15) s.ball.vy *= -1

				// ball move
				s.ball.x += s.ball.vx * s.ball.speed
				s.ball.y += s.ball.vy * s.ball.speed

				// score if ball out of court
				if (s.ball.x > w - 15 || s.ball.x < 15) reset()
			} else {
				// wait to start
				p1t = h / 2 - 25
				p1c = h / 2
				p2t = h / 2 - 25
				p2c = h / 2
				s.p1 = p1c
				s.p2 = p2c
				if (s.ball.vx > 0) s.ball = { x: p1r + 1, y: p1c - 5, vx: 3, vy: 0, speed: 3 }
				else s.ball = { x: p2l - 1, y: p2c - 5, vx: 3, vy: 0, speed: 3 }
			}

			// DRAWING
			// clear
			ctx.clearRect(0, 0, w, h)
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, w, h)

			ctx.fillStyle = 'black'
			ctx.strokeStyle = 'black'
			ctx.lineWidth = 2
			// draw court
			ctx.rect(10, 10, w - 20, h - 20)
			ctx.beginPath()
			ctx.moveTo(w / 2 - 1, 10)
			ctx.lineTo(w / 2 - 1, h - 10)
			ctx.closePath()
			ctx.stroke()

			// draw score
			ctx.font = '700 20px Inconsolata'
			ctx.fillStyle = 'black'
			ctx.fillText(`Score: ${s.score} / Best: ${s.best}`, w - 230, 30, 200)

			// draw p1
			ctx.fillRect(p1l, p1t, 10, 50)

			// draw p2
			ctx.fillRect(p2l, p2t, 10, 50)

			// draw ball
			ctx.fillRect(s.ball.x, s.ball.y, 10, 10)
		},
		[state]
	)
	const reset = () => {
		state.current = {
			...state.current,
			playing: false,
			score: 0,
			best: state.current.best < state.current.score ? state.current.score : state.current.best,
			vy: 5,
		}
	}
	const move = (e: MouseEvent) => {
		state.current.mouse = [e.x - ref.current.getBoundingClientRect().x, e.y - ref.current.getBoundingClientRect().y]
	}
	const start = () => (state.current.playing = true)
	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener('mousemove', throttle(move, 10))
			ref.current.addEventListener('mouseup', start)
		}
		return () => {
			if (ref.current) {
				ref.current.removeEventListener('mousemove', move)
				ref.current.removeEventListener('mouseup', start)
			}
		}
	}, [ref])

	return (
		<section className={tw(container, 'h-screen')} id="pong">
			<div ref={ref} className={tw(section)}>
				<Title title="Day.3" subtitle="Self pong" />
				{inView && <Canvas containerRef={ref} draw={draw} className={tw(canvas)} />}
			</div>
		</section>
	)
}

export default Pong
