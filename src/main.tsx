import { createRoot } from "react-dom/client"
import { setup, apply } from "twind"

import App from "./App"
import { StrictMode } from "react"

setup({
	theme: {
		extend: {
			fontFamily: {
				sans: "Inconsolata, sans-serif",
			},
		},
	},
	preflight: {
		"@import": `url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;700&display=swap')`,
		body: apply`min-h-screen font-normal`,
		"#root": apply`min-h-screen relative bg-gray-900`,
		a: apply`text-pink-400 hover:(text-pink-600) transition-colors no-underline`,
	},
})
const root = createRoot(document.getElementById("root")!)
root.render(
	<StrictMode>
		<App />
	</StrictMode>,
)
