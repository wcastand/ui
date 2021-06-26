import React from 'react'
import ReactDOM from 'react-dom'
import { setup, apply } from 'twind'

import App from './App'

setup({
	theme: {
		extend: {
			fontFamily: {
				sans: 'Inconsolata, sans-serif',
			},
		},
	},
	preflight: {
		'@import': `url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@700&display=swap')`,
		body: apply`h-screen bg-gray-900 text-gray-900 font-sans p-12 font-bold`,
		'#root': apply`h-full relative`,
		a: apply`text-gray-900 hover:(text-gray-500) transition-colors no-underline`,
	},
})

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)
