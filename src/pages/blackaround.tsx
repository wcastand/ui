import React from 'react'
import { css } from 'twind/css'
import { apply, tw } from 'twind'
import { useObserver } from '@alexvcasillas/use-observer'
import { useSpring, animated, config } from 'react-spring'

import { container, section, image, Title } from '../components'

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
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const props = useSpring({
		cancel: !inView,
		delay: 500,
		loop: true,
		config: config.slow,
		to: [{ height: '0px' }, { height: '90px' }, { height: '250px' }, { height: '0px' }],
		from: { height: '0px' },
	})

	return (
		<section className={tw(container)}>
			<div className={tw(section)}>
				<Title title="Day.1" />
				<div className={tw`relative text-base grid grid-cols-1 gap-0`}>
					<span className={tw(text, latter)}>Black</span>
					<animated.div ref={ref} style={props} className={tw('relative grid', custom)}>
						<div className={tw(barwrapper, 'justify-start')}>
							<div className={tw(bar, barwidth)} />
						</div>
						<div className={tw(barwrapper, 'justify-center')}>
							<div className={tw(bar, barwidth)} />
						</div>
						<img className={tw(image)} src="/bg.jpg" alt="test" />
						<div className={tw(barwrapper, 'justify-center')}>
							<div className={tw(bar, barwidth)} />
						</div>
						<div className={tw(barwrapper, 'justify-end')}>
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
			</div>
		</section>
	)
}

export default BlackAround
