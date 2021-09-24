import create from 'zustand'
import * as React from 'react'
import { css } from 'twind/css'
import { apply, tw } from 'twind'
import { FiRefreshCw } from 'react-icons/fi'

import { randomInteger } from '../utils'
import { container, section } from '../components'

type Choices = ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F')[]
const choices: Choices = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

type State = {
	color: string
	last: string | null
	current: string[]
	guessed: boolean[]
	reroll: () => void
	addGuess: (idx: number, guess: string) => void
	guess: () => void
}

const cell = apply`text-2xl font-bold text-gray-800`

const useStore = create<State>((set, get) => {
	let color = ''
	for (let i = 0; i < 6; i++) color += choices[randomInteger(0, choices.length - 1)]
	return {
		color,
		last: null,
		current: ['', '', '', '', '', ''],
		guessed: [false, false, false, false, false, false],
		reroll: () => {
			let color = ''
			for (let i = 0; i < 6; i++) color += choices[randomInteger(0, choices.length - 1)]
			set({ color, last: null, current: ['', '', '', '', '', ''], guessed: [false, false, false, false, false, false] })
		},
		addGuess: (idx, guess) => {
			const current = [...get().current]
			current.splice(idx, 1, guess)
			set({ current })
		},
		guess: () => {
			const current = get().current
			const color = get().color
			const last = current.join('')
			if (color === last) get().reroll()
			else set({ last, guessed: current.map((c, idx) => c === color[idx]) })
		},
	}
})

function ColorMind() {
	const store = useStore()
	const color = css`
		background-color: #${store.color};
	`
	const lastGuess = css`
		background-color: #${store.last};
	`
	return (
		<div className={tw(container)} id="colormind">
			<div className={tw(section)}>
				<div className={tw('flex flex-col md:(flex-row) gap-8 justify-center items-center')}>
					<div className={tw('flex-1 flex flex-row md:(flex-col) gap-4')}>
						<div className={tw('w-24 h-24 rounded border border-gray-300', color)} />
						<div className={tw('flex flex-col justify-around items-center md:(flex-row justify-between)')}>
							<button className={tw('px-4')} onClick={() => store.reroll()}>
								<FiRefreshCw className={tw('transition-all rotate-0 hover:(rotate-180)')} />
							</button>
							<div
								className={tw(
									'w-8 h-8 rounded border border-gray-300 text-center',
									css`
										line-height: 2rem;
									`,
									lastGuess
								)}
							>
								{store.last === null ? '?' : null}
							</div>
						</div>
						<button
							className={tw(
								'px-2 py-1 text-center font-bold border bg-gray-100 text-gray-900 hover:(bg-green-500 text-white) transition-colors rounded-md'
							)}
							onClick={() => store.guess()}
						>
							Guess
						</button>
					</div>
					<div>
						<span className={tw(cell, 'flex-1 self-start')}>#</span>
						<div className={tw('flex flex-row gap-4')}>
							<div className={tw('flex flex-col')}>
								{store.guessed.map((c, idx) => (
									<span key={`guessed_${idx}`} className={tw(cell, c ? 'text-green-400' : 'text-gray-800')}>
										{c ? store.color[idx] : '?'}
									</span>
								))}
							</div>
							<div className={tw('grid grid-cols-1')}>
								{new Array(6).fill(0).map((_, idx) => (
									<div key={`col_${idx}`} className={tw('flex flex-row justify-start items-start gap-2')}>
										{choices.map((c) => (
											<span
												key={`choice_${c}_${idx}`}
												onClick={() => (!store.guessed[idx] ? store.addGuess(idx, c) : null)}
												className={tw(
													cell,
													'transition-all scale-100 hover:(scale-150)',
													store.guessed[idx] ? 'text-gray-200' : 'text-gray-800 cursor-pointer',
													store.current[idx] === c ? 'scale-150 text-yellow-400' : 'text-gray-800'
												)}
											>
												{c}
											</span>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className={tw('absolute bottom-2 left-2 text-sm flex flex-col px-4')}>
					<span>Colormind, like mastermind but if you are good with color, you can win easy (it's hard).</span>
					<span>
						Idea came looking at{' '}
						<a href="https://twitter.com/robdimarzo/status/1440709989341941776?s=20" title="link to inspi" target="_blank">
							this tweet
						</a>
					</span>
				</div>
			</div>
		</div>
	)
}

export default ColorMind
