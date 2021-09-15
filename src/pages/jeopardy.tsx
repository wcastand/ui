import create from 'zustand'
import * as React from 'react'
import { css } from 'twind/css'
import { apply, tw } from 'twind'
import shallow from 'zustand/shallow'
import { useForm, SubmitHandler } from 'react-hook-form'
import { animated, useSpring } from '@react-spring/web'

import { container, section, Title } from '../components'

const wrapper = apply(
	`mx-auto rounded-sm border-2 font-normal font-sans text-base rounded overflow-hidden`,
	css`
		width: 420px;
		@media (max-width: 640px) {
			width: 100%;
		}
	`
)
const form = apply`w-full flex flex-col justify-center items-center`
const input = apply`w-full flex-1 px-4 py-2 border-t-2 border-b-2`
const button = apply`text-center flex-1 text-sm py-2 transition-colors`
const thanks = apply`absolute bottom-4 left-4 text-sm`

export type CategoryType = {
	id: number
	title: string
	created_at: string
	updated_at: string
	clues_count?: number
}

export type QuestionType = {
	id: number
	answer: string
	question: string
	value: number
	airdate: string
	created_at: string
	updated_at: string
	category_id: number
	game_id?: number
	invalid_count?: number
	category: CategoryType
}

export type State = {
	score: number
	state: -1 | 0 | 1 | 2
	question: QuestionType | undefined
	loading: boolean
	newQuestion: () => void
	answer: (answer: string) => void
	reset: () => void
	nopoint: () => void
}

const allStoreSelector = (s: State) => s

const useStore = create<State>((set, get) => ({
	score: 0,
	state: 0,
	question: undefined,
	loading: false,
	reset: () => set({ score: 0, question: undefined, state: 0 }),
	nopoint: () => set({ state: 2 }),
	answer: (answer: string) => {
		const result = get().question?.answer === answer
		if (result) {
			set((s) => ({
				score: s.state !== 2 ? s.score + (s.question?.value ?? 100) : s.score,
				state: 1,
			}))
			get().newQuestion()
		} else set({ state: -1 })
	},
	newQuestion: async () => {
		set({ loading: true })
		const json = await fetch('/api/question').then((r) => r.json())
		set({ question: json, loading: false, state: 0 })
	},
}))

type Input = {
	answer: string
}
function Spinner() {
	return (
		<div
			className={tw(
				'flex-1 flex justify-center items-center',
				css`
					min-height: 80px;
				`
			)}
		>
			<div className={tw('h-8 w-8 border-b-2 border-l-2 border-t-2 border-blue-500 rounded-full transition-all animate-spin')} />
		</div>
	)
}

function Jeopardy() {
	const { register, handleSubmit, reset, setValue } = useForm<Input>()
	const { loading, score, question, answer, state, newQuestion, nopoint } = useStore(allStoreSelector, shallow)
	const { x } = useSpring({
		from: { x: 0 },
		x: loading ? 0 : 1,
		config: { duration: 300 },
	})

	const onSubmit: SubmitHandler<Input> = (data) => {
		answer(data.answer)
		reset()
	}

	React.useEffect(() => {
		newQuestion()
	}, [])

	const getAnswer = () => {
		setValue('answer', question?.answer ?? '')
		nopoint()
	}

	const borderColor = apply`border-${state === -1 ? 'red' : state === 1 ? 'green' : 'gray'}-500`

	return (
		<div className={tw(wrapper, 'shadow', borderColor)}>
			<div className={tw('flex flex-row py-2 border-b-2', borderColor)}>
				<div className={tw('flex-1 px-4')}>
					Category: <animated.span style={{ opacity: x }}>{question?.category?.title ?? ''}</animated.span>
				</div>
				<div className={tw('px-4 border-l-2', borderColor)}>Score: {score}</div>
			</div>
			<div className={tw('relative px-4 py-1 flex flex-col')}>
				<h5>Question :</h5>
				<p
					className={tw(
						'flex-1',
						css`
							min-height: 80px;
						`
					)}
				>
					<animated.span style={{ opacity: x }}>{question?.question ?? ''}</animated.span>
				</p>
			</div>
			<form className={tw(form)} onSubmit={handleSubmit(onSubmit)}>
				<input
					className={tw(input, borderColor)}
					type="text"
					placeholder="Answer here..."
					autoComplete="off"
					{...register('answer', { required: true })}
				/>
				<div className={tw('w-full flex flex-row')}>
					<button className={tw(button, 'bg-pink-300 hover:(bg-pink-500 text-gray-900)')} type="submit">
						{state === 2 ? 'Next question' : `Check answer (${question?.value ?? '-'} pts)`}
					</button>
					<button className={tw(button, 'bg-gray-100 hover:(bg-gray-300 text-gray-900)')} type="button" onClick={getAnswer}>
						Give answer (0 pts)
					</button>
				</div>
			</form>
		</div>
	)
}

function JeopardyApp() {
	return (
		<div className={tw(container, 'h-screen')} id="loading">
			<div className={tw(section)}>
				<Title title="Jeopardy." subtitle="I suck at this" />
				<Jeopardy />
			</div>
			<div className={tw('relative')}>
				<div className={tw(thanks)}>
					Thanks for the{' '}
					<a className={tw('text-underline')} href="https://jservice.io/" title="link to api" target="_blank">
						API
					</a>{' '}
					<a className={tw('text-underline')} href="https://github.com/sottenad" title="link to Steve Ottenad's github" target="_blank">
						Steve Ottenad
					</a>
				</div>
			</div>
		</div>
	)
}

export default JeopardyApp
