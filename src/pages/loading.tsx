import { useCallback, useRef } from "react"
import { css } from "twind/css"
import { apply, tw } from "twind"
import color from "nice-color-palettes"
import { animated, useSpring, useSprings } from "@react-spring/web"

import { randomInteger } from "../utils"
import {
	container,
	section,
	SkiDude,
	RocketIcon,
	MiniCanvas,
} from "../components"

const gooey = css`
	filter: url(#goo);
`

function getD(index: number) {
	switch (index) {
		case 0:
			return 1000
		case 1:
			return 3500
		case 2:
			return 1600
		case 3:
			return 2100
	}
}

function GoeySpinner({ nb = 4, color }: { nb?: number; color?: string }) {
	const [springs] = useSprings(nb, (index: number) => ({
		loop: true,
		config: { duration: getD(index) },
		transform: "rotate(360deg)",
		from: { transform: "rotate(0deg)" },
	}))

	return (
		<div
			className={tw(
				`relative`,
				css`
					width: 100px;
					height: 100px;
				`,
				gooey,
			)}
		>
			{springs.map((spring, idx) => (
				<animated.div
					key={`ball_goey_spinner_${idx}`}
					style={spring}
					className={tw(
						`absolute :after::(bg-${color ?? "red-500"})`,
						css`
							top: 0px;
							left: 35px;
							width: 24px;
							height: 50px;
							transform-origin: bottom center;
							&:after {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 24px;
								height: 24px;
								border-radius: 100%;
							}
						`,
					)}
				/>
			))}
		</div>
	)
}

const wrapperduo = apply(
	`absolute top-0 left-0 flex flex-row justify-center items-center`,
	css`
		transform-origin: center center;
		width: 100px;
		height: 100px;
	`,
)
function DuoSpinner({ color }: { color?: string }) {
	const spring = useSpring({
		loop: true,
		config: { duration: 2500 },
		transform: "rotate(360deg)",
		from: { transform: "rotate(0deg)" },
	})
	const spring2 = useSpring({
		loop: true,
		config: { duration: 1500 },
		transform: "rotate(360deg)",
		from: { transform: "rotate(0deg)" },
	})

	return (
		<div
			className={tw(
				"relative",
				css`
					width: 100px;
					height: 100px;
				`,
			)}
		>
			<animated.div style={spring} className={tw(wrapperduo, gooey)}>
				<div
					className={tw(`bg-${color ?? "red-500"} rounded-full m-1 w-8 h-8`)}
				/>
				<div
					className={tw(`bg-${color ?? "red-500"} rounded-full m-1 w-8 h-8`)}
				/>
			</animated.div>
			<animated.div
				style={spring2}
				className={tw(wrapperduo, gooey, "justify-around")}
			>
				<div className={tw(`bg-${color ?? "red-500"} rounded-full w-6 h-6`)} />
				<div className={tw(`bg-${color ?? "red-500"} rounded-full w-6 h-6`)} />
			</animated.div>
		</div>
	)
}

const tree = apply(css`
	width: 32px;
	height: 48px;
	clip-path: polygon(50% 0%, 5% 100%, 95% 100%);
`)

const Tree = ({
	scale,
	color,
	tx,
}: { tx?: number; color?: string; scale?: number }) => (
	<div
		className={tw(
			`absolute bottom-0 bg-${color ?? "red-500"}`,
			tree,
			css`
				transform-origin: bottom center;
				transform: translateX(${tx ?? 0}px) scale(${scale ?? 1});
			`,
		)}
	/>
)

function GoingUp() {
	const springT = useSpring({
		loop: true,
		config: { duration: 1800 },
		to: { transform: "translateX(-100px)" },
		from: { transform: "translateX(100px) " },
	})
	return (
		<div
			className={tw(
				"relative w-full h-full overflow-hidden -skew-y-12",
				css`
					width: 100px;
					height: 100px;
				`,
			)}
		>
			<div
				className={tw(`absolute w-full h-1 bottom-0 left-0 bg-yellow-200`)}
			/>
			<animated.div style={springT} className={tw("absolute bottom-1")}>
				<Tree color={"green-200"} />
				<Tree scale={0.7} tx={10} color={"green-400"} />
				<Tree scale={0.5} tx={5} color={"green-700"} />
			</animated.div>
			<div
				className={tw(
					"absolute w-full bg-gray-400",
					css`
						top: 64px;
						height: 2px;
					`,
				)}
			/>
			<SkiDude className={tw("absolute bottom-1 left-8")} size="32px" />
			<animated.div style={springT} className={tw("absolute bottom-1")}>
				<Tree scale={1.1} tx={80} color={"green-400"} />
				<Tree scale={0.4} tx={75} color={"green-200"} />
				<Tree scale={0.6} tx={55} color={"green-700"} />
			</animated.div>
		</div>
	)
}

const Star = ({ className, x, y, ...props }: any) => (
	<animated.div
		className={tw(
			"absolute bg-yellow-300",
			css`
				width: 4px;
				height: 4px;
				top: ${y ?? 0}px;
				left: ${x ?? 0}px;
			`,
			className,
		)}
		{...props}
	/>
)

function Space() {
	const [stars] = useSprings(8, (idx) => ({
		loop: true,
		config: { duration: (idx + 3) * 400 },
		to: { transform: "translateY(100px) rotate(45deg)" },
		from: { transform: "translateY(-100px) rotate(45deg)" },
	}))
	return (
		<div
			className={tw(
				"relative",
				css`
					width: 100px;
					height: 100px;
					background: linear-gradient(0deg, #1d4ed8, #312e81);
					clip-path: url(#blob);
				`,
			)}
		>
			<animated.div className={tw("absolute h-full w-full")}>
				{stars.map((star, idx) => (
					<Star
						key={`star_${idx}`}
						x={randomInteger(10, 90)}
						y={0}
						style={star}
					/>
				))}
			</animated.div>
			<RocketIcon
				size="32px"
				className={tw(
					"z-10 absolute",
					css`
						top: calc(50% - 12px);
						left: calc(50% - 8px);
					`,
				)}
			/>
		</div>
	)
}

function FillingCube() {
	const state = useRef({
		x: 0,
		y: 0,
		color: color[randomInteger(0, color.length - 1)][randomInteger(0, 5)],
	})

	const draw = useCallback(
		(ctx) => {
			if (state.current === null) return
			ctx.fillStyle = state.current.color
			ctx.fillRect(state.current.x, state.current.y, 10, 10)
			if (state.current.x + 10 < 100) state.current.x += 10
			else if (state.current.y + 10 < 100) {
				state.current.x = 0
				state.current.y += 10
			} else {
				state.current = {
					x: 0,
					y: 0,
					color: color[randomInteger(0, color.length - 1)][randomInteger(0, 5)],
				}
			}
		},
		[state],
	)
	return <MiniCanvas draw={draw} />
}

function Loading() {
	return (
		<div className={tw(container)} id="loading">
			<div className={tw(section)}>
				<div
					className={tw(
						"flex-1 w-full flex flex-wrap gap-4 justify-center items-center",
					)}
				>
					<GoeySpinner />
					<DuoSpinner color="green-300" />
					<GoingUp />
					<Space />
					<FillingCube />
				</div>

				<div className={tw("absolute bottom-2 left-2 text-xs")}>
					Icons made by{" "}
					<a
						href="https://www.flaticon.com/authors/smashicons"
						title="Smashicons"
					>
						Smashicons
					</a>{" "}
					from{" "}
					<a href="https://www.flaticon.com/" title="Flaticon">
						www.flaticon.com
					</a>
				</div>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width={0}
				height={0}
			>
				<defs>
					<filter id="goo">
						<feGaussianBlur
							in="SourceGraphic"
							stdDeviation="10"
							result="blur"
						/>
						<feColorMatrix
							in="blur"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
							result="goo"
						/>
						<feBlend in="SourceGraphic" in2="goo" />
					</filter>
					<clipPath id="blob">
						<path
							d="M74.7,12.1c6.7,5.6,12.8,10.4,16.9,16.6c4,6.3,5.9,14,5.6,21.5c-0.4,7.5-3,14.8-5.6,23.6
	c-2.5,8.8-5.1,19.1-11.4,22.7c-6.3,3.7-16.4,0.9-25.3-1.5c-8.8-2.3-16.3-4.1-22.5-7.9c-6.2-3.8-11.2-9.5-17.6-16S0.7,57.6,3.7,52.1
	s16.6-9.2,23.6-14.7c6.9-5.5,7.1-12.7,10.4-20.3C40.8,9.6,47.2,1.8,54,1.1C60.8,0.3,67.9,6.6,74.7,12.1z"
						/>
					</clipPath>
				</defs>
			</svg>
		</div>
	)
}

export default Loading
