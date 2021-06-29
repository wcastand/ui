import * as React from 'react'
import { useRef, useEffect } from 'react'
import { animated, useSpring, config } from 'react-spring'
import { useObserver } from '@alexvcasillas/use-observer'
import { apply, tw } from 'twind'
import { css } from 'twind/css'

export const container = apply(
	css`
		scroll-snap-align: start;
	`,
	apply`w-screen relative top-0 left-0 text-gray-900 font-sans font-bold p-0 lg:p-12`
)
export const section = apply`relative h-full w-full flex justify-center items-center bg-white`
export const image = apply`w-full h-full object-cover`

export type TitleProps = {
	title: string
	subtitle?: string
}
export function Title({ title, subtitle }: TitleProps) {
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const props = useSpring({
		cancel: !inView,
		delay: 250,
		config: config.molasses,
		to: { transform: 'translateX(0%)', opacity: 1 },
		from: { transform: 'translateX(20%)', opacity: 0 },
	})

	return (
		<animated.h2
			ref={ref}
			style={props}
			className={tw('z-10 absolute top-4 left-4 text-5xl uppercase font-sans font-bold tracking-tighter flex justify-start items-end')}
		>
			{title} {subtitle && <span className={tw('pl-2 text-lg tracking-normal')}>- {subtitle}</span>}
		</animated.h2>
	)
}

export type CanvasProps = {
	containerRef: React.RefObject<HTMLElement>
	draw: (ctx: CanvasRenderingContext2D | null, frameCount: number) => void
} & React.HTMLAttributes<HTMLCanvasElement>

export function Canvas({ containerRef, draw, ...props }: CanvasProps) {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (ref.current === null || !containerRef.current) return
		const rect = containerRef.current.getBoundingClientRect()
		const canvas = ref.current
		canvas.width = rect.width
		canvas.height = rect.height
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId = 0

		//Our draw came here
		const render = () => {
			frameCount++
			draw(context, frameCount)
			animationFrameId = window.requestAnimationFrame(render)
		}
		render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [draw])
	return <canvas ref={ref} {...props} />
}
