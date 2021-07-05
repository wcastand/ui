import * as React from 'react'
import * as THREE from 'three'
import { apply, tw } from 'twind'
import { useSpring, animated } from '@react-spring/three'
import { Canvas, RootState, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'

import { container, section, Title } from '../components'

const thanks = apply`z-10 absolute bottom-4 left-4 font-light text-white hover:(text-gray-300)`
// 1920 × 3360

const TEXTURES = [
	['poe/death.jpg', 'poe/death-normal.png'],
	['poe/justice.jpg', 'poe/justice-normal.png'],
	['poe/strength.jpg', 'poe/strength-normal.png'],
	['poe/temperance.jpg', 'poe/temperance-normal.png'],
	['poe/the-chariot.jpg', 'poe/the-chariot-normal.png'],
	['poe/the-devil.jpg', 'poe/the-devil-normal.png'],
	['poe/the-emperor.jpg', 'poe/the-emperor-normal.png'],
	['poe/the-empress.jpg', 'poe/the-empress-normal.png'],
	['poe/the-fool.jpg', 'poe/the-fool-normal.png'],
	['poe/the-hanged-man.jpg', 'poe/the-hanged-man-normal.png'],
	['poe/the-hermit.jpg', 'poe/the-hermit-normal.png'],
	['poe/the-hierophant.jpg', 'poe/the-hierophant-normal.png'],
	['poe/the-high-priestess.jpg', 'poe/the-high-priestess-normal.png'],
	['poe/the-judgement.jpg', 'poe/the-judgement-normal.png'],
	['poe/the-lovers.jpg', 'poe/the-lovers-normal.png'],
	['poe/the-magician.jpg', 'poe/the-magician-normal.png'],
	['poe/the-moon.jpg', 'poe/the-moon-normal.png'],
	['poe/the-star.jpg', 'poe/the-star-normal.png'],
	['poe/the-sun.jpg', 'poe/the-sun-normal.png'],
	['poe/the-tower.jpg', 'poe/the-tower-normal.png'],
	['poe/the-world.jpg', 'poe/the-world-normal.png'],
	['poe/wheel-of-fortune.jpg', 'poe/wheel-of-fortune-normal.png'],
]

const ratio = 1920 / 3360
const radius = 14

function MyLight() {
	const target = React.useRef<THREE.Object3D>()
	const mylight = React.useRef<THREE.Object3D>()
	return (
		<>
			<mesh ref={target} position={[0, 0, 0]} />
			<spotLight ref={mylight} intensity={1.2} position={[0, 13, 5]} target={target.current} distance={50} />
		</>
	)
}

function Card({ texture, index }: { texture: string[]; index: number }) {
	const myMesh = React.useRef<THREE.Mesh>(null)
	const textures = useTexture(texture)
	const [active, setActive] = React.useState(false)
	const { scale } = useSpring({ scale: active ? 1.2 : 1 })
	const [x, z] = React.useMemo(() => {
		const a = ((Math.PI * 2) / TEXTURES.length) * index + Math.PI
		const x = Math.cos(a) * radius
		const z = Math.sin(a) * radius
		return [x, z]
	}, [index])
	useFrame(({ camera }) => {
		if (!myMesh.current) return
		myMesh.current.lookAt(camera.position.clone().normalize())
	})
	return (
		<animated.mesh
			position={[x, 0, z]}
			ref={myMesh}
			onPointerOut={() => setActive(false)}
			onPointerOver={() => setActive(true)}
			scale={scale}
		>
			<planeGeometry args={[3, 3 / ratio, 2]} />
			<meshPhongMaterial
				map={textures[0]}
				normalMap={textures[1]}
				normalMapType={THREE.ObjectSpaceNormalMap}
				side={THREE.DoubleSide}
				shininess={35}
			/>
		</animated.mesh>
	)
}
function Cards() {
	const ref = React.useRef<THREE.Object3D>()
	useFrame(() => {
		if (!ref.current) return
		ref.current.rotation.y += 0.002
	})
	return (
		<group ref={ref} position={[0, 0, 0]}>
			{TEXTURES.map((texture, idx) => (
				<Card key={`card_${idx}`} texture={texture} index={idx} />
			))}
		</group>
	)
}

function Camera() {
	const mycam = React.useRef<THREE.Object3D>()
	return <PerspectiveCamera ref={mycam} makeDefault fov={45} near={0.001} far={100} />
}

function Poe() {
	const init = ({ scene }: RootState) => {
		scene.background = new THREE.Color(0x111827)
	}

	return (
		<div className={tw(container, 'h-screen bg-white')} id="poe">
			<div className={tw(section, 'bg-gray-900')}>
				<Title title="Day.4" subtitle="Path of exile" className={tw('text-white')} />
				<a className={tw(thanks)} href={'https://www.artstation.com/artwork/rAyR3m'} title="Thiago Lehmann - Major Arcana" target="_blank">
					Source: Thiago Lehmann - Major Arcana
				</a>
				<Canvas onCreated={init} gl={{ antialias: true, pixelRatio: window.devicePixelRatio }}>
					<Camera />
					<ambientLight intensity={0.3} color={0xffffff} />
					<MyLight />
					<Cards />
				</Canvas>
			</div>
		</div>
	)
}

export default Poe
