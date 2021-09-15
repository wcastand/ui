import React from 'react'
import { apply, tw } from 'twind'
import { useObserver } from '@alexvcasillas/use-observer'
import { useTrail, animated, config } from 'react-spring'

import { container, section, Title } from '../components'

const wrapper = apply`absolute px-4 md:px-0`
const welcome = apply`text-2xl font-normal`
const name = apply`text-6xl font-bold`
const job = apply`text-4xl font-normal`
const plus = apply`text-xl font-normal`
const desc = apply`text-vase font-light`
const link = apply`px-4 first:pl-0 last:pr-0`

function Home() {
	const { inView, ref } = useObserver({ threshold: 0.1 })
	const trail = useTrail(5, {
		cancel: !inView,
		delay: 500,
		config: config.gentle,
		opacity: 1,
		transform: 'translateY(0px)',
		from: { opacity: 0, transform: 'translateY(30px)' },
	})
	return (
		<section className={tw(container, 'h-screen')} id="home">
			<div ref={ref} className={tw(section, `shadow-md rounded-sm`)}>
				<Title title="Intro." />
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
