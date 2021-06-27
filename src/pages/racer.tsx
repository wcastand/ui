import { tw } from 'twind'
import * as THREE from 'three'
import React, { useMemo, useEffect } from 'react'
import { useLoader, Canvas } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import { section, container, Title } from '../components'

function Racer() {
	const obj = useLoader(OBJLoader, 'plane.obj')
	const target = new THREE.Object3D()
	const mat = useMemo(() => new THREE.MeshToonMaterial({ color: 0xf34985 }), [])

	useEffect(() => {
		target.position.set(-50, -82, 40)
	}, [])

	useEffect(() => {
		if (obj) {
			obj.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = mat
					child.castShadow = true
					child.receiveShadow = true
				}
			})
		}
	}, [obj])

	return (
		<section className={tw(container)}>
			<div className={tw(section)}>
				<Title title="Day.2" />
				<Canvas
					shadows
					gl={{ alpha: true, antialias: true, pixelRatio: window.devicePixelRatio, shadowMapEnabled: true }}
					camera={{
						position: [-180, 180, 180],
						fov: 10,
					}}
					onCreated={({ camera }) => {
						camera.lookAt(new THREE.Vector3(0, 0, 0))
					}}
				>
					<ambientLight intensity={1} color={0xffffff} />
					<directionalLight
						position={[20, 40, 0]}
						castShadow
						shadow-mapSize-width={512}
						shadow-mapSize-height={512}
						color={0xffffff}
						intensity={1}
						target={target}
					/>
					<mesh>
						<primitive object={obj} scale={2} position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]} />
						<meshToonMaterial attach="material" color="orange" />
					</mesh>
					<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
						<boxGeometry args={[40, 40, 4]} />
						<meshToonMaterial attach="material" color="orange" />
					</mesh>
				</Canvas>
			</div>
		</section>
	)
}

export default Racer
