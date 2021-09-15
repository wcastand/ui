import * as React from 'react'
import { useMemo } from 'react'
import create from 'zustand'
import shortid from 'shortid'
import { css } from 'twind/css'
import { apply, tw } from 'twind'
import shallow from 'zustand/shallow'
import { persist } from 'zustand/middleware'
import { TiDeleteOutline } from 'react-icons/ti'
import { animated, useTransition } from '@react-spring/web'

import { fromNow } from '../utils'
import { container, section, Title } from '../components'

const wrapper = apply(
	`mx-auto rounded-sm border shadow`,
	css`
		width: 420px;
		@media (max-width: 640px) {
			width: 100%;
		}
	`
)
const form = apply`w-full flex justify-center items-center`
const input = apply`flex-1 border-b px-4 py-2`
const list = apply`py-4`
const todoitem = apply`transition-colors cursor-pointer flex-1 px-4 py-1 font-normal font-sans text-base flex flex-row justify-start items-center`
const todoitemcompleted = apply`line-through text-gray-400`
const todoitemcontent = apply`flex-1 pl-2 block break-all`
const todoitemtime = apply`text-xs text-gray-400`

export type TodoType = {
	id: string
	content: string
	completed: boolean
	createdat: string
}

export type State = {
	todos: Map<string, TodoType>
	get: (id: string) => TodoType | undefined
	add: (id: string, todo: TodoType) => void
	complete: (id: string, value: boolean) => void
	remove: (id: string) => void
}

const initialMap = new Map<string, TodoType>([
	['one', { id: 'one', content: 'Eat a banana', completed: false, createdat: new Date().toString() }],
	['two', { id: 'two', content: 'Drink a coke', completed: true, createdat: new Date().toString() }],
	['three', { id: 'three', content: 'Make a todo app', completed: true, createdat: new Date().toString() }],
	['four', { id: 'four', content: 'Be more productive', completed: false, createdat: new Date(1900, 1, 1).toString() }],
])

const useStore = create<State>(
	persist(
		(set, get) => ({
			todos: initialMap,
			get: (id: string) => get().todos.get(id),
			add: (id: string, todo: TodoType) => set((s) => void s.todos.set(id, todo)),
			complete: (id: string, value: boolean) =>
				set((s) => {
					if (s.todos.has(id)) {
						const todo = s.todos.get(id)
						if (todo) s.todos.set(id, { ...todo, completed: value })
					}
				}),
			remove: (id: string) => set((s) => void s.todos.delete(id)),
		}),
		{
			name: 'todos-storage',
			serialize: (state) =>
				JSON.stringify(state, (key: string, value: any) => {
					value.state.todos = Array.from(value.state.todos.entries())
					return JSON.stringify(value)
				}),
			deserialize: (str: string) =>
				JSON.parse(str, (key: string, value: any) => {
					const res = JSON.parse(value)
					res.state.todos = new Map<string, TodoType>(res.state.todos)
					return res
				}),
		}
	)
)

export type TodoProps = {
	item: TodoType
	style: any
	remove: (id: string) => void
	complete: (id: string, value: boolean) => void
}

function Todo({ item, style, remove, complete }: TodoProps) {
	const time = useMemo(() => fromNow(item.createdat), [item])
	return (
		<animated.li
			className={tw(todoitem, item.completed && todoitemcompleted)}
			style={style}
			onClick={() => complete(item.id, !item.completed)}
		>
			<TiDeleteOutline onClick={() => remove(item.id)} />
			<span className={tw(todoitemcontent)} title={item.content}>
				{item.content}
			</span>
			<span className={tw(todoitemtime)}>{time}</span>
		</animated.li>
	)
}

function Todos() {
	const { todos, add, complete, remove } = useStore(
		(s) => ({ todos: Array.from(s.todos.entries()), add: s.add, complete: s.complete, remove: s.remove }),
		shallow
	)
	const orderedTodos = useMemo(() => {
		const r = todos
		r.sort(([, a], [, b]) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime())
		return r
	}, [todos])

	const transitions = useTransition(orderedTodos, {
		keys: ([id]) => id,
		from: { transform: 'translateX(-30px)', opacity: 0 },
		enter: { transform: 'translateX(0px)', opacity: 1 },
		leave: { transform: 'translateX(-30px)', opacity: 0 },
	})

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		const target = e.target as typeof e.target & {
			content: { value: string }
		}

		if (target.content.value.split(',').length === 1) {
			const id = shortid.generate()
			add(id, { id, content: target.content.value, completed: false, createdat: new Date().toString() })
		} else {
			for (let v of target.content.value.split(',')) {
				const id = shortid.generate()
				add(id, { id, content: v.trim(), completed: false, createdat: new Date().toString() })
			}
		}
		target.content.value = ''
		e.preventDefault()
	}

	return (
		<div className={tw(wrapper)}>
			<form className={tw(form)} onSubmit={onSubmit}>
				<input className={tw(input)} name="content" id="content" type="text" placeholder="do a todo app, ..." />
			</form>
			<ul className={tw(list)}>
				{transitions((style, [, todo]) => (
					<Todo style={style} item={todo} complete={complete} remove={remove} />
				))}
			</ul>
		</div>
	)
}

function TodoPage() {
	return (
		<div className={tw(container, 'h-screen')} id="loading">
			<div className={tw(section)}>
				<Title title="Todo App." />
				<Todos />
			</div>
		</div>
	)
}

export default TodoPage
