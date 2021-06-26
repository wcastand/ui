import React from 'react'
import { useSpring, animated, config } from 'react-spring'
import { apply, tw } from 'twind'
import { css } from 'twind/css'

import { section, image } from '../components'

const container = apply`text-base grid grid-cols-1 gap-0`
const wrapper = apply`relative grid`
const text = apply`text-uppercase block text-9xl leading-none`
const thanks = apply`absolute bottom-4 left-4 text-sm flex flex-col`
const barwrapper = apply`w-full h-full flex`
const bar = apply`h-full bg-gray-900`

const barwidth = css`
	width: 15px;
`
const latter = css`
	line-height: 110px;
`
const custom = css`
	width: 320px;
	justify-content: flex-start;
	justify-items: center;
	align-items: center;
	grid-template-columns: 29px 35px 180px 34px 31.5px;
	grid-gap: 0px;
	overflow: hidden;
	padding-left: 6px;
	padding-right: 4px;
	height: 90px;
`

function BlackAround() {
	const props = useSpring({
		delay: 800,
		loop: true,
		config: config.slow,
		to: [{ height: '0px' }, { height: '90px' }, { height: '250px' }, { height: '0px' }],
		from: { height: '0px' },
	})

	return (
		<section className={tw(section)}>
			<div className={tw(container)}>
				<span className={tw(text, latter)}>Black</span>
				<animated.div style={props} className={tw([wrapper, custom])}>
					<div className={tw(barwrapper, apply`justify-start`)}>
						<div className={tw(bar, barwidth)} />
					</div>
					<div className={tw(barwrapper, apply`justify-center`)}>
						<div className={tw(bar, barwidth)} />
					</div>
					<img className={tw(image)} src="/bg.jpg" alt="test" />
					<div className={tw(barwrapper, apply`justify-center`)}>
						<div className={tw(bar, barwidth)} />
					</div>
					<div className={tw(barwrapper, apply`justify-end`)}>
						<div className={tw(bar, barwidth)} />
					</div>
				</animated.div>
				<span className={tw(text, latter)}>round</span>
			</div>
			<div className={tw(thanks)}>
				<a href="https://unsplash.com/photos/pumko2FFxY0" title="link to pic" target="_blank">
					Thanks for the pic
				</a>
				<a href="https://dribbble.com/shots/15899930-Intro-Animation-Awwwards-Course" title="link to inspi" target="_blank">
					Thanks for the inspiration (first 3 seconds)
				</a>
			</div>
		</section>
	)
}

export default BlackAround
