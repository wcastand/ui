import { create } from "zustand"
import { css } from "twind/css"
import { apply, tw } from "twind"
import { Temporal } from "@js-temporal/polyfill"

import { container, section } from "../components"
import { useEffect } from "react"

const wrapper = apply(
	"mx-auto rounded-sm border-2 border-gray-900 font-normal font-sans text-base rounded overflow-hidden",
)

export type State = {
	time: Temporal.PlainDateTime
	update: () => void
}
const useStore = create<State>()((set) => ({
	time: Temporal.Now.plainDateTimeISO(),
	update: () => set({ time: Temporal.Now.plainDateTimeISO() }),
}))

const redtape = apply(
	css`
		height: 294px;
		&::before {
			content: '';
			position: absolute;
			top: calc(50% - 1px);
			left: 0;
			height: 2px;
			width: 100%;
			background: red;
		}
	`,
)

const dm = css`
	height: 58.8px;
	line-height: 58.8px;
`
const ds = css`
	height: 42px;
	line-height: 42px;
`
const dlabel = css`
	font-size: 11rem;
	line-height: 0.75;
`

function Clock() {
	const { time, update } = useStore((s) => s)

	useEffect(() => {
		const timerid: NodeJS.Timer = setInterval(() => {
			update()
		}, 1000)
		return () => clearInterval(timerid)
	}, [])

	return (
		<div className={tw(wrapper)}>
			<div
				className={tw(
					"relative flex flex-row gap-0 justify-start items-start overflow-hidden",
					redtape,
				)}
			>
				<div className={tw("h-full flex justify-center items-center")}>
					<div
						className={tw(
							"relative -top-2 -mr-8",
							css`
								height: 270px;
								width: 210px;
							`,
						)}
					>
						<h1 className={tw("font-bold text-red-300", dlabel)}>{time.day}</h1>
						<div className={tw("px-4")}>
							<svg viewBox="0 0 36 20" className={tw("w-full")}>
								<title>Clock</title>
								<text
									x="0"
									y="15"
									className={tw("font-semibold text-uppercase text-center")}
								>
									{time.toLocaleString("en-gb", { month: "short" })}
								</text>
							</svg>
							<svg viewBox="0 0 36 20" className={tw("w-full relative -top-8")}>
								<title>Clock</title>
								<text
									x="0"
									y="15"
									className={tw("font-semibold text-uppercase text-center")}
								>
									{time.year}
								</text>
							</svg>
						</div>
					</div>
				</div>
				<div
					className={tw(
						"h-full relative transition-all",
						css`
							transform: translateY(-${time.hour * 58.8}px);
						`,
					)}
				>
					{new Array(28).fill(0).map((_, idx) => {
						const h = (idx - 2 < 0 ? 24 + idx - 2 : idx - 2) % 24
						return (
							<div
								key={`h_${idx}`}
								className={tw(
									"flex justify-center items-center text-4xl ml-2 bg-white",
									time.hour === h ? "text-red-300" : "text-gray-900",
									dm,
								)}
							>
								{h.toLocaleString("fr", { minimumIntegerDigits: 2 })}
							</div>
						)
					})}
				</div>
				<div
					className={tw(
						"h-full relative transition-all",
						css`
							transform: translateY(-${time.minute * 58.8}px);
						`,
					)}
				>
					{new Array(66).fill(0).map((_, idx) => {
						const m = (idx - 2 < 0 ? 60 + idx - 2 : idx - 2) % 60
						return (
							<div
								key={`m_${idx}`}
								className={tw(
									"flex justify-center items-center text-4xl mr-2 ml-1 bg-white",
									time.minute === m ? "text-red-300" : "text-gray-900",
									dm,
								)}
							>
								{m.toLocaleString("fr", { minimumIntegerDigits: 2 })}
							</div>
						)
					})}
				</div>
				<div
					className={tw(
						"h-full relative transition-all",
						css`
							transform: translateY(-${time.second * 42}px);
						`,
					)}
				>
					{new Array(66).fill(0).map((_, idx) => {
						const s = (idx - 5 < 0 ? 60 + idx - 5 : idx - 5) % 60
						return (
							<div
								key={`s_${idx}`}
								className={tw(
									"flex justify-center items-center text-xl px-1 bg-white",
									s % 5 === 0 ? "text-red-300" : "text-gray-900",
									ds,
								)}
							>
								{s.toLocaleString("fr", { minimumIntegerDigits: 2 })}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

function OClock() {
	return (
		<div className={tw(container)} id="oclock">
			<div className={tw(section)}>
				<Clock />
			</div>
		</div>
	)
}

export default OClock
