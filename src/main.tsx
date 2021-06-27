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
		'@import': `url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;700&display=swap')`,
		body: apply`min-h-screen font-normal`,
		'#root': apply`min-h-screen relative bg-gray-900`,
		a: apply`text-gray-900 hover:(text-gray-500) transition-colors no-underline`,
	},
})

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)
