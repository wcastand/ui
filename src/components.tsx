import * as React from 'react'
import { animated, useSpring, config } from 'react-spring'
import { useObserver } from '@alexvcasillas/use-observer'
import { apply, tw } from 'twind'
import { css } from 'twind/css'

export const container = apply(
	css`
		scroll-snap-align: start;
	`,
	apply`h-screen w-screen relative top-0 left-0 text-gray-900 font-sans font-bold p-12`
)
export const section = apply`relative h-full w-full flex justify-center items-center bg-white`
export const image = apply`w-full h-full object-cover`

export type TitleProps = {
	title: string
}
export function Title({ title }: TitleProps) {
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const props = useSpring({
		cancel: !inView,
		delay: 250,
		config: config.molasses,
		to: { transform: 'translateX(0%)', opacity: 1 },
		from: { transform: 'translateX(20%)', opacity: 0 },
	})

	return (
		<animated.h2 ref={ref} style={props} className={tw('absolute top-4 left-4 text-5xl uppercase font-sans font-bold tracking-tighter')}>
			{title}
		</animated.h2>
	)
}
