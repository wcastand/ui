import * as React from 'react'
import { animated, useSpring, config } from 'react-spring'
import { apply, tw } from 'twind'

export const container = apply`h-screen w-screen relative top-0 left-0 text-gray-900 font-sans font-bold p-12`
export const section = apply`relative h-full w-full flex justify-center items-center bg-white`
export const image = apply`w-full h-full object-cover`

export type TitleProps = {
	title: string
}
export function Title({ title }: TitleProps) {
	const props = useSpring({
		delay: 500,
		config: config.molasses,
		to: { transform: 'translateX(0%)', opacity: 1 },
		from: { transform: 'translateX(20%)', opacity: 0 },
	})
	return (
		<animated.h2 style={props} className={tw('absolute top-4 left-4 text-5xl uppercase font-sans font-bold tracking-tighter')}>
			{title}
		</animated.h2>
	)
}
