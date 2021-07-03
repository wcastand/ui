import * as React from 'react'
import * as THREE from 'three'
import { apply, tw } from 'twind'
import color from 'nice-color-palettes'
import { useState, useLayoutEffect, useRef, useEffect, useMemo } from 'react'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import { container, section, Title } from '../components'
import { randomInteger } from '../utils'

function Cell({ shape }: any) {
	const extrudeSettings = useMemo(
		() => ({
			steps: 1,
			depth: randomInteger(5, 120),
			bevelEnabled: false,
		}),
		[]
	)
	return (
		<mesh>
			<meshBasicMaterial color={color[randomInteger(0, color.length - 1)][randomInteger(0, 5)]} side={THREE.DoubleSide} />
			<extrudeGeometry args={[shape, extrudeSettings]} />
		</mesh>
	)
}

function Svg({ url }: any) {
	// @ts-ignore
	const { paths } = useLoader(SVGLoader, url)
	const shapes = useMemo(() => paths.flatMap((p: any) => p.toShapes(true).map((shape: any) => ({ shape }))), [paths])
	const ref = useRef<THREE.Object3D>()
	useLayoutEffect(() => {
		if (ref.current) {
			const sphere = new THREE.Box3().setFromObject(ref.current).getBoundingSphere(new THREE.Sphere())
			ref.current.position.set(-sphere.center.x, -sphere.center.y, 0)
		}
	}, [])
	return (
		<group ref={ref} position={[0, 0, 0]}>
			{shapes.map((props: any) => (
				<Cell key={props.shape.uuid} {...props} />
			))}
		</group>
	)
}

function Poe() {
	const ref = useRef<THREE.Camera>()

	return (
		<div className={tw(container, 'h-screen bg-white')} id="city">
			<div className={tw(section, 'bg-gray-900')}>
				<Title title="Day.5" subtitle="City plan" className={tw('text-white')} />
				<Canvas
					onCreated={({ camera }) => (ref.current = camera)}
					frameloop="demand"
					orthographic
					camera={{ position: [0, 0, 50], zoom: 2, up: [0, 0, 1], far: 10000 }}
					gl={{ antialias: true, pixelRatio: window.devicePixelRatio }}
				>
					<OrbitControls camera={ref.current} />
					<ambientLight intensity={10} color={0xffffff} />
					<Svg url="/map.svg" />
				</Canvas>
			</div>
		</div>
	)
}

export default Poe
