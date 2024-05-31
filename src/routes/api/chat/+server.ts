import { json, type RequestHandler } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

// configure the openAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		// validate the input
		if (!messages || !Array.isArray(messages)) {
			return json({ error: 'Invalid request body' }, { status: 400 });
		}

		// call the openAI API
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages
		});

		// extract the response content
		const content = response.choices[0]?.message?.content || '';

		return json({ content }, { status: 200 });
	} catch (error) {
		return json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
	}
};
