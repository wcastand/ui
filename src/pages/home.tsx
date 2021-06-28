import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { apply, tw } from 'twind'
import { Canvas, RootState } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useObserver } from '@alexvcasillas/use-observer'
import { useTrail, animated, config } from 'react-spring'
import color from 'nice-color-palettes'
import { useSpring, animated as tanimated } from '@react-spring/three'

import { container, section, Title } from '../components'
import { randomInteger } from '../utils'

const wrapper = apply`absolute`
const welcome = apply`text-2xl font-normal`
const name = apply`text-6xl font-bold`
const job = apply`text-4xl font-normal`
const plus = apply`text-xl font-normal`
const desc = apply`text-vase font-light`
const link = apply`px-4 first:pl-0 last:pr-0`

function getPos(min: number, max: number): number {
	let x = randomInteger(min, max)
	while (x > -8 && x < 8) {
		x = randomInteger(min, max)
	}
	return x
}

function Cubes({ n, ratio }: { ratio: number; n: number }) {
	const colors = useMemo(() => color[randomInteger(0, color.length)], [])
	const cubes = useMemo(() => {
		const arr = []
		for (let i = 0; i < n; i++) {
			const size = randomInteger(1, 3)
			const x = getPos(-40, 40)
			const y = getPos(-40 * ratio, 40 * ratio)
			arr.push(
				<mesh key={`cubes_${i}`} castShadow position={[x, 0, y]}>
					<boxGeometry args={[size, 5, size]} />
					<meshPhongMaterial attach="material" color={colors[randomInteger(0, colors.length)]} />
				</mesh>
			)
		}
		return arr
	}, [n])

	return <>{cubes}</>
}

function Home() {
	const planeRef = useRef<THREE.Object3D>()
	const { inView, ref } = useObserver({ threshold: 0.5 })
	const trail = useTrail(5, {
		cancel: !inView,
		delay: 500,
		config: config.gentle,
		opacity: 1,
		transform: 'translateY(0px)',
		from: { opacity: 0, transform: 'translateY(30px)' },
	})
	const anims = useMemo(() => new Array(5).fill(0).map(() => ({ position: [randomInteger(-40, 40), 1, randomInteger(-40, 40)] })), [])

	const { position } = useSpring({
		config: config.molasses,
		from: { position: [0, 1, 0] },
		to: [...anims, { position: [0, 1, 0] }],
	})

	const ratio = useMemo(() => window.innerHeight / window.innerWidth, [])

	const init = (state: RootState) => {
		const {
			camera,
			size: { width, height },
		} = state

		const aabb = new THREE.Box3().setFromObject(planeRef.current!)

		camera.lookAt(new THREE.Vector3(0, 0, 0))
		camera.zoom = Math.min(width / (aabb.max.x - aabb.min.x), height / (aabb.max.y - aabb.min.y))
		camera.updateProjectionMatrix()
	}
	return (
		<section className={tw(container)}>
			<div className={tw(section, `shadow-md rounded-sm`)}>
				<Canvas shadows gl={{ alpha: true, antialias: true, pixelRatio: window.devicePixelRatio, shadowMapEnabled: true }} onCreated={init}>
					<OrthographicCamera position={[0, 10, 0]} makeDefault />
					<ambientLight intensity={1} color={0xffffff} />
					<tanimated.pointLight castShadow color={0xffffff} intensity={10} position={position as any} />
					<Cubes n={10} ratio={ratio} />
					<mesh ref={planeRef} receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
						<planeGeometry args={[100, 100 * ratio, 2]} />
						<meshPhongMaterial attach="material" color={0xffffff} />
					</mesh>
				</Canvas>
				<Title title="Intro." />
				<div ref={ref} className={tw(wrapper)}>
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
						Just a few things i play with while i look for a job.
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
