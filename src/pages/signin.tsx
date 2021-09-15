import { apply, tw } from 'twind'
import color from 'nice-color-palettes'
import { useObserver } from '@alexvcasillas/use-observer'
import { useTrail, animated, config } from 'react-spring'
import { useForm, SubmitHandler } from 'react-hook-form'
import React, { useCallback, useEffect, useRef } from 'react'

import { container, section, Title, Canvas } from '../components'
import { randomInteger } from '../utils'

const wrapper = apply`relative min-h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
const form = apply`relative col-span-1 flex flex-col justify-center items-center px-4 py-16 md:px-24`
const canvas = apply`absolute top-0 left-0 w-full h-full`
const inputContainer = apply`w-full flex flex-col justify-start items-start py-4`
const wrapperlabel = apply`w-full flex flex-row justify-start items-center`
const label = apply`px-2 py-1 text-white text-sm font-light bg-gray-700`
const error = apply`px-2 py-1 bg-red-400 text-white text-sm self-justify-end text-right`
const spacer = apply`flex-1`
const input = apply`w-full border-b-1 px-2 py-1 text-gray-500`
const button = apply`w-full border-1 px-8 py-2 rounded-sm transition-colors bg-white border-gray-900 text-gray-700 hover:(bg-gray-900 text-white)`
const logo = apply`w-16 self-start`
const img = apply`col-span-1 xl:col-span-2 h-full object-cover`
const link = apply`absolute bottom-2 right-4 font-normal px-2 rounded-sm bg-white `

type Inputs = {
	email: string
	password: string
	passwordconfirm: string
}

const nbStars = 200
const colors = color[randomInteger(0, color.length - 1)]

type Star = {
	x: number
	y: number
	velocity: number
	color: string
}

function SignIn() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>()
	const stars = useRef<Star[]>([])
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const trail = useTrail(5, {
		cancel: !inView,
		delay: 500,
		config: config.gentle,
		opacity: 1,
		transform: 'translateY(0px)',
		from: { opacity: 0, transform: 'translateY(30px)' },
	})
	useEffect(() => {
		if (!ref.current) return
		const rect = ref.current.getBoundingClientRect()
		stars.current = []
		for (let i = 0; i < nbStars; i++) {
			const y = randomInteger(-rect.width, rect.height)
			const ratio = rect.height / 4
			const r = Math.floor(y / ratio)
			stars.current.push({
				x: randomInteger(-100, 0),
				y,
				velocity: randomInteger(2, 4),
				color: colors[y < 0 ? 0 : r + 1],
			})
		}
	}, [ref, stars])

	const draw = useCallback(
		(ctx: CanvasRenderingContext2D | null, frameCount: number) => {
			if (ctx === null) return
			for (let star of stars.current) {
				ctx.fillStyle = star.color
				ctx.fillRect(star.x, star.y, 3, 3)
				star.x += star.velocity
				star.y += star.velocity
				if (star.x > ctx.canvas.width || star.y > ctx.canvas.height) {
					star.x = 0
					star.y = randomInteger(-ctx.canvas.width, ctx.canvas.height)
					star.velocity = randomInteger(2, 4)
					const ratio = ctx.canvas.height / 4
					const r = Math.floor(star.y / ratio)
					star.color = colors[star.y < 0 ? 0 : r + 1]
				}
			}
		},
		[stars]
	)

	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

	return (
		<div className={tw(container, 'h-screen')} id="day2">
			<div className={tw(section, 'rounded-sm shadow-sm')}>
				<Title title="Rainbow Form." />
				<div className={tw(wrapper)}>
					<form ref={ref} className={tw(form)} onSubmit={handleSubmit(onSubmit)}>
						<Canvas containerRef={ref} draw={draw} className={tw(canvas)} />
						<animated.img style={trail[0]} className={tw(logo)} src="logo.png" alt="logo" />
						<animated.div className={tw(inputContainer)} style={trail[1]}>
							<div className={tw(wrapperlabel)}>
								<label className={tw(label)} htmlFor="name">
									Email
								</label>
								<div className={tw(spacer)} />
								{errors.email && <span className={tw(error)}>required</span>}
							</div>
							<input
								className={tw(input)}
								type="email"
								id="email"
								placeholder="test@wcastand.dev"
								{...register('email', { required: true })}
							/>
						</animated.div>
						<animated.div className={tw(inputContainer)} style={trail[2]}>
							<div className={tw(wrapperlabel)}>
								<label className={tw(label)} htmlFor="password">
									Password
								</label>
								<div className={tw(spacer)} />
								{errors.password && <span className={tw(error)}>required</span>}
							</div>
							<input
								className={tw(input)}
								type="password"
								id="password"
								placeholder="*********"
								{...register('password', { required: true })}
							/>
						</animated.div>
						<animated.div className={tw(inputContainer)} style={trail[3]}>
							<div className={tw(wrapperlabel)}>
								<label className={tw(label)} htmlFor="confirmpassword">
									Confirm password
								</label>
								<div className={tw(spacer)} />
								{errors.passwordconfirm && <span className={tw(error)}>required</span>}
							</div>
							<input
								className={tw(input)}
								type="password"
								id="confirmpassword"
								placeholder="*********"
								{...register('passwordconfirm', { required: true })}
							/>
						</animated.div>
						<animated.button style={trail[4]} className={tw(button)} type="submit">
							Sign in
						</animated.button>
					</form>
					<img className={tw(img)} src="pride.jpg" alt="pride parade" />
					<a className={tw(link)} href="https://unsplash.com/photos/HcAU5A-e3YI" title="source">
						Norbu GYACHUNG - Unsplash
					</a>
				</div>
			</div>
		</div>
	)
}

export default SignIn
