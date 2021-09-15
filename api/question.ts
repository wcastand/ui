import fetch from 'isomorphic-unfetch'
import { VercelRequest, VercelResponse } from '@vercel/node'

const base = 'https://jservice.io/'

export default async (request: VercelRequest, response: VercelResponse) => {
	let json = { invalid_count: 1 }
	while (json.invalid_count > 0) json = (await fetch(`${base}api/random`).then((r) => r.json()))[0]
	response.status(200).json(json)
}
